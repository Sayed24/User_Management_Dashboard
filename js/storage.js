import { users } from "./state.js";
import { demoUsers } from "./demoUsers.js";

const KEY = "dashboard-users";

export function loadUsers() {
  const data = localStorage.getItem(KEY);
  if (data) users.push(...JSON.parse(data));
  else { users.push(...demoUsers); saveUsers(); }
}

export function saveUsers() {
  localStorage.setItem(KEY, JSON.stringify(users));
}
