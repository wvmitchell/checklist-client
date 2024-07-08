import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getChecklists } from "../../api/checklistAPI";
import Checklist from "../Checklist";

function App() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["checklists"],
    queryFn: getChecklists,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  let checklists = data?.checklists || [];

  return (
    <div className="m-4 rounded border-2 border-green-400 font-mono">
      <h1 className="text-xl font-bold">Checklists</h1>
      {checklists.map((checklist: { [key: string]: any }) => (
        <Link to={`/checklist/${checklist.id}`}>{checklist.name}</Link>
      ))}
    </div>
  );
}

export default App;
