import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { getChecklists, createChecklist } from "../../api/checklistAPI";

function App() {
  const navigate = useNavigate();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["checklists"],
    queryFn: getChecklists,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  async function createNewChecklist() {
    const { checklist } = await createChecklist();
    navigate(`/checklist/${checklist.id}`);
  }

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  let checklists = data?.checklists || [];

  return (
    <div>
      <h1 className="text-xl font-bold">Listo</h1>
      <div className="flex flex-col space-y-4">
        {checklists.map((checklist: { [key: string]: any }) => (
          <Link
            to={`/checklist/${checklist.id}`}
            state={{ title: checklist.title }}
            key={checklist.id}
          >
            <div className="rounded-md bg-white p-5">
              <h2 className="font-semibold">{checklist.title}</h2>
              <p className="text-sm text-slate-500">{checklist.created_at}</p>
            </div>
          </Link>
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
