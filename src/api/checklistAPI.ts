// base url is the environment variable BASE_URL or http://localhost:3000
const BASE_URL = process.env.BASE_URL || "http://localhost:8080";

async function getChecklists() {
  const res = await fetch(`${BASE_URL}/checklists`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // TODO: replace with actual user ID
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
      // TODO: replace with actual user ID
      userID: "1",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to get checklist: ${res.status}`);
  }
  return await res.json();
}

async function createChecklist() {
  const res = await fetch(`${BASE_URL}/checklist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // TODO: replace with actual user ID
      userID: "1",
    },
    body: JSON.stringify({ title: "New Checklist" }),
  });

  if (!res.ok) {
    throw new Error(`Failed to create checklist: ${res.status}`);
  }

  return await res.json();
}

async function updateChecklist(checklistID: string, title: string) {
  const res = await fetch(`${BASE_URL}/checklist/${checklistID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // TODO: replace with actual user ID
      userID: "1",
    },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update checklist: ${res.status}`);
  }

  return await res.json();
}

async function createItem(checklistID: string, content: string) {
  const res = await fetch(`${BASE_URL}/checklist/${checklistID}/item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // TODO: replace with actual user ID
      userID: "1",
    },
    body: JSON.stringify({ content }),
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
  content: string,
) {
  const res = await fetch(
    `${BASE_URL}/checklist/${checklistID}/item/${itemID}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // TODO: replace with actual user ID
        userID: "1",
      },
      body: JSON.stringify({ content, checked }),
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to update item: ${res.status}`);
  }
  return await res.json();
}

async function deleteItem(checklistID: string, itemID: string) {
  const res = await fetch(
    `${BASE_URL}/checklist/${checklistID}/item/${itemID}`,
    {
      method: "DELETE",
      headers: {
        // TODO: replace with actual user ID
        userID: "1",
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to delete item: ${res.status}`);
  }
  return await res.json();
}

export {
  getChecklists,
  getChecklist,
  createChecklist,
  updateChecklist,
  createItem,
  updateItem,
  deleteItem,
};
