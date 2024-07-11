import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "react-router-dom";
import { debounce } from "lodash";
import Item from "../Item";
import ChecklistControls from "../ChecklistControls";
import {
  updateChecklist,
  getChecklist,
  createItem,
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
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [locked, setLocked] = useState(true);

  const queryClient = useQueryClient();
  const { isPending, isError, data, error, isSuccess } = useQuery({
    queryKey: ["checklist", checklistID],
    queryFn: () => getChecklist(checklistID),
    staleTime: 1000 * 60 * 5, // 5 minutes,
  });

  const updateChecklistMutation = useMutation({
    mutationFn: (variables: {
      checklistID: string;
      title: string;
      locked: boolean;
    }) => {
      return updateChecklist(
        variables.checklistID,
        variables.title,
        variables.locked,
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

  useEffect(() => {
    if (isSuccess && data) {
      setTitle(data.checklist.title);
      setLocked(data.checklist.locked);
      let sorted = data.items.sort(
        (a: ChecklistItem, b: ChecklistItem) =>
          Date.parse(a.created_at) - Date.parse(b.created_at),
      );
      setItems(sorted);
    }
  }, [isSuccess, data]);

  const debouncedUpdateChecklistTitle = useCallback(
    debounce(
      (newTitle: string, locked: boolean) =>
        updateChecklistMutation.mutate({
          checklistID,
          title: newTitle,
          locked: locked,
        }),
      500,
    ),
    [checklistID],
  );

  function handleUpdateChecklistTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    debouncedUpdateChecklistTitle(e.target.value, locked);
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

  function handleLockChecklist() {
    updateChecklistMutation.mutate({ checklistID, title, locked: !locked });
  }

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="grid grid-cols-2">
        <input
          type="text"
          name="checklist-name"
          value={title}
          onChange={handleUpdateChecklistTitle}
          className="w-full bg-transparent text-xl font-bold focus:outline-none"
          disabled={locked}
        />
        <ChecklistControls
          locked={locked}
          handleLockChecklist={handleLockChecklist}
        />
      </div>
      {items.map((item: ChecklistItem) => (
        <Item
          key={item.id}
          checklistID={checklistID}
          item={item}
          locked={locked}
        />
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
