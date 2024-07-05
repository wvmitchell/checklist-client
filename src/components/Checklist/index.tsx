import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
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

function Checklist({ checklistID }: { checklistID: string }) {
  const queryClient = useQueryClient();
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["checklist", checklistID],
    queryFn: () => getChecklist(checklistID),
    staleTime: 1000 * 60 * 5, // 5 minutes
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

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  let checklist = data?.checklist || {};
  let items: ChecklistItem[] = data?.items || [];
  items = items.sort(
    (a, b) => Date.parse(a.created_at) - Date.parse(b.created_at),
  );

  return (
    <div>
      <h2>{checklist.name}</h2>
      {items.map((item: { [key: string]: any }) => (
        <div key={item.id}>
          <input
            type="checkbox"
            id={item.id}
            onChange={toggleItem}
            checked={item.checked}
          />
          <label htmlFor={item.id}>{item.content}</label>
          <button id={item.id} onClick={handleDeleteItem}>
            Delete
          </button>
        </div>
      ))}
      <form onSubmit={handleNewItem}>
        <input type="text" name="new-item" />
        <label htmlFor="new-item">New Item</label>
      </form>
    </div>
  );
}

export default Checklist;
