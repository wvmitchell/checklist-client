import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "@heroicons/react/24/solid";
import { updateItem, deleteItem } from "../../api/checklistAPI";

type ChecklistItem = {
  id: string;
  content: string;
  checked: boolean;
  created_at: string;
  updated_at: string;
};

type ItemProps = {
  checklistID: string;
  item: ChecklistItem;
  locked: boolean;
};

function Item({ checklistID, item, locked }: ItemProps) {
  const queryClient = useQueryClient();
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

  function handleDeleteItem(e: React.MouseEvent<HTMLButtonElement>) {
    const itemID = e.currentTarget.id;
    deleteItemMutation.mutate({ checklistID, itemID });
  }

  return (
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
          <TrashIcon className="size-4" />
        </button>
      )}
    </div>
  );
}

export default Item;
