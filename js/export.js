import { state } from "./state.js";

export function exportUsersCSV(users = state.filteredUsers.length ? state.filteredUsers : state.users) {
  const headers = ["First Name", "Last Name", "Email", "Phone", "Role", "Status", "Department", "City", "Joined"];
  const rows = users.map((user) => [
    user.firstName, user.lastName, user.email, user.phone, user.role,
    user.status, user.department, user.city, user.joinedAt
  ]);
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  downloadBlob(csv, "userflow-users.csv", "text/csv;charset=utf-8");
}

export function exportUsersJSON(users = state.filteredUsers.length ? state.filteredUsers : state.users) {
  downloadBlob(JSON.stringify(users, null, 2), "userflow-users.json", "application/json");
}

function csvCell(value = "") {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadBlob(content, fileName, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
