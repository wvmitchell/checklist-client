import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  getChecklists,
  createChecklist,
  deleteChecklist,
} from "../../api/checklistAPI";

function App() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["checklists"],
    queryFn: getChecklists,
  });

  const deleteChecklistMutation = useMutation({
    mutationFn: (variables: { checklistID: string }) => {
      return deleteChecklist(variables.checklistID);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] });
    },
  });

  async function createNewChecklist() {
    const { checklist } = await createChecklist();
    navigate(`/checklist/${checklist.id}`);
  }

  async function handleDeleteChecklist(e: React.MouseEvent<HTMLButtonElement>) {
    const checklistID = e.currentTarget.id;
    deleteChecklistMutation.mutate({ checklistID });
  }

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  let checklists = data?.checklists || [];

  return (
    <div>
      <div className="grid grid-cols-1 gap-3">
        {checklists.map((checklist: { [key: string]: any }) => (
          <div
            className="grid grid-cols-[3fr_1fr] rounded-md bg-white p-5"
            key={checklist.id}
          >
            <Link
              to={`/checklist/${checklist.id}`}
              state={{ title: checklist.title }}
            >
              <h2 className="font-semibold">{checklist.title}</h2>
              <p className="text-sm text-slate-500">{checklist.created_at}</p>
            </Link>
            <div className="grid justify-items-end">
              <button onClick={handleDeleteChecklist}>
                <TrashIcon
                  className="h-5 w-5 cursor-pointer text-slate-500 hover:text-slate-700"
                  id={checklist.id}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-5 right-5">
        <button onClick={createNewChecklist}>
          <PencilSquareIcon className="h-10 w-10 text-slate-500 active:text-slate-700" />
        </button>
      </div>
    </div>
  );
}

export default App;
