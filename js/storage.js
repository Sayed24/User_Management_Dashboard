import { users } from "./state.js";
import { demoUsers } from "./demoUsers.js";

const KEY = "dashboard-users";

export function loadUsers() {
  const saved = localStorage.getItem(KEY);
  if (saved) users.push(...JSON.parse(saved));
  else {
    users.push(...demoUsers);
    saveUsers();
  }
}

export function saveUsers() {
  localStorage.setItem(KEY, JSON.stringify(users));
}
