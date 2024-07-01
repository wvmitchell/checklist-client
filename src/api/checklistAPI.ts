// base url is the environment variable BASE_URL or http://localhost:3000
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function getChecklists() {
  const res = await fetch(`${BASE_URL}/checklists`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      userID: "1",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to get checklists: ${res.status}`);
  }
  return await res.json();
}

async function getChecklist(id: string) {
  const res = await fetch(`${BASE_URL}/checklist/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      userID: "1",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to get checklist: ${res.status}`);
  }
  return await res.json();
}

async function createItem(checklistID: string, text: string) {
  const res = await fetch(`${BASE_URL}/checklist/${checklistID}/item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      userID: "1",
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error(`Failed to create item: ${res.status}`);
  }
  return await res.json();
}

async function updateItem(
  checklistID: string,
  itemID: string,
  checked: boolean,
) {
  const res = await fetch(
    `${BASE_URL}/checklist/${checklistID}/item/${itemID}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        userID: "1",
      },
      body: JSON.stringify({ checked }),
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to update item: ${res.status}`);
  }
  return await res.json();
}

export { getChecklists, getChecklist, createItem, updateItem };
