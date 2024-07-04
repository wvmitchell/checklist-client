import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getChecklists } from "../../api/checklistAPI";
import Checklist from "../Checklist";
import "./index.css";

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
    <div className="App">
      <h1>Checklists</h1>
      {checklists.map((checklist: { [key: string]: any }) => (
        <Checklist key={checklist.id} checklistID={checklist.id} />
      ))}
    </div>
  );
}

export default App;
