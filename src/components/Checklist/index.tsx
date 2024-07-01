import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChecklist, updateItem, createItem } from "../../api/checklistAPI";

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
    }) => {
      return updateItem(
        variables.checklistID,
        variables.itemID,
        variables.checked,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] });
    },
  });

  const newItemMutation = useMutation({
    mutationFn: (variables: { checklistID: string; text: string }) => {
      return createItem(variables.checklistID, variables.text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] });
    },
  });

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  function toggleItem(e: React.ChangeEvent<HTMLInputElement>) {
    const itemID = e.target.id;
    const checked = e.target.checked;
    updateItemMutation.mutate({ checklistID, itemID, checked });
  }

  function handleNewItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let form = e.target as HTMLFormElement;
    let formData = new FormData(form);
    newItemMutation.mutate({
      checklistID,
      text: formData.get("new-item") as string,
    });
  }

  return (
    <div>
      <h2>{data?.checklist.name}</h2>
      {data?.checklist.items.map((item: { [key: string]: any }) => (
        <div key={item.id}>
          <input
            type="checkbox"
            id={item.id}
            onChange={toggleItem}
            checked={item.checked}
          />
          <label htmlFor={item.id}>{item.text}</label>
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
