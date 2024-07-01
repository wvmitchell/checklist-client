// base url is the environment variable BASE_URL or http://localhost:3000
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// Function to get all checklists
// returns a promise with the response
// the response is an array of checklists for the user
// GET /checklists
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

export { getChecklists, getChecklist };
