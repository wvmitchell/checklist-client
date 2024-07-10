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

  async function handleDeleteChecklist(e: React.MouseEvent<SVGSVGElement>) {
    const checklistID = e.currentTarget.id;
    deleteChecklistMutation.mutate({ checklistID });
  }

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  let checklists = data?.checklists || [];

  return (
    <div>
      <div className="flex flex-col space-y-4">
        {checklists.map((checklist: { [key: string]: any }) => (
          <div className="grid grid-cols-2 rounded-md bg-white p-5">
            <Link
              to={`/checklist/${checklist.id}`}
              state={{ title: checklist.title }}
              key={checklist.id}
            >
              <h2 className="font-semibold">{checklist.title}</h2>
              <p className="text-sm text-slate-500">{checklist.created_at}</p>
            </Link>
            <TrashIcon
              className="h-5 w-5 justify-end text-slate-500"
              id={checklist.id}
              onClick={handleDeleteChecklist}
            />
          </div>
        ))}
      </div>
      <div className="fixed bottom-5 right-5">
        <PencilSquareIcon
          className="h-10 w-10 text-slate-500 active:text-slate-700"
          onClick={createNewChecklist}
        />
      </div>
    </div>
  );
}

export default App;
