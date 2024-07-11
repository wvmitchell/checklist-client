import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TrashIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/solid";
import { useParams, useLocation } from "react-router-dom";
import { debounce } from "lodash";
import {
  updateChecklist,
  getChecklist,
  createItem,
  updateItem,
  deleteItem,
} from "../../api/checklistAPI";

type ChecklistItem = {
  id: string;
  content: string;
  checked: boolean;
  created_at: string;
  updated_at: string;
};

function Checklist() {
  const checklistID = useParams().id || "";
  const [title, setTitle] = useState(useLocation().state?.title || "");
  const [locked, setLocked] = useState(false);

  const queryClient = useQueryClient();
  const { isPending, isError, data, error, isSuccess } = useQuery({
    queryKey: ["checklist", checklistID],
    queryFn: () => getChecklist(checklistID),
    staleTime: 1000 * 60 * 5, // 5 minutes,
  });

  const updateChecklistMutation = useMutation({
    mutationFn: (variables: { checklistID: string; title: string }) => {
      return updateChecklist(variables.checklistID, variables.title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: (variables: {
      checklistID: string;
      itemID: string;
      checked: boolean;
      content: string;
    }) => {
      return updateItem(
        variables.checklistID,
        variables.itemID,
        variables.checked,
        variables.content,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] });
    },
  });

  const newItemMutation = useMutation({
    mutationFn: (variables: { checklistID: string; content: string }) => {
      return createItem(variables.checklistID, variables.content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (variables: { checklistID: string; itemID: string }) => {
      return deleteItem(variables.checklistID, variables.itemID);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] });
    },
  });

  function toggleItem(e: React.ChangeEvent<HTMLInputElement>) {
    const itemID = e.target.id;
    const checked = e.target.checked;
    const content = e.target.nextSibling?.textContent || "";
    updateItemMutation.mutate({ checklistID, itemID, checked, content });
  }

  function handleUpdateChecklistTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    debouncedUpdateChecklistTitle(e.target.value);
  }

  function handleNewItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let form = e.target as HTMLFormElement;
    let formData = new FormData(form);
    newItemMutation.mutate({
      checklistID,
      content: formData.get("new-item") as string,
    });
  }

  function handleDeleteItem(e: React.MouseEvent<HTMLButtonElement>) {
    const itemID = e.currentTarget.id;
    deleteItemMutation.mutate({ checklistID, itemID });
  }

  useEffect(() => {
    if (isSuccess && data) {
      setTitle(data.checklist.title);
    }
  }, [isSuccess, data]);

  const debouncedUpdateChecklistTitle = useCallback(
    debounce(
      (newTitle) =>
        updateChecklistMutation.mutate({ checklistID, title: newTitle }),
      500,
    ),
    [checklistID],
  );

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  let items: ChecklistItem[] = data?.items || [];
  items = items.sort(
    (a, b) => Date.parse(a.created_at) - Date.parse(b.created_at),
  );

  return (
    <div>
      <input
        type="text"
        name="checklist-name"
        value={title}
        onChange={handleUpdateChecklistTitle}
        className="w-full bg-transparent text-xl font-bold focus:outline-none"
        disabled={locked}
      />
      <button onClick={() => setLocked(!locked)}>
        {locked ? (
          <LockClosedIcon className="size-6 text-slate-700" />
        ) : (
          <LockOpenIcon className="size-6 text-slate-700" />
        )}
      </button>
      {items.map((item: { [key: string]: any }) => (
        <div key={item.id} className="space-x-2">
          <input
            type="checkbox"
            id={item.id}
            onChange={toggleItem}
            checked={item.checked}
          />
          <label htmlFor={item.id}>{item.content}</label>
          {locked ? null : (
            <button id={item.id} onClick={handleDeleteItem}>
              <TrashIcon className="size-6" />
            </button>
          )}
        </div>
      ))}
      {locked ? null : (
        <form onSubmit={handleNewItem}>
          <input type="text" name="new-item" />
          <label htmlFor="new-item">New Item</label>
        </form>
      )}
    </div>
  );
}

export default Checklist;
