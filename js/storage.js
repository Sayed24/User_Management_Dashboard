import { setUsers } from "./state.js";

const KEY = "users";

export function loadUsers() {
  const data = JSON.parse(localStorage.getItem(KEY)) || [];
  setUsers(data);
  return data;
}

export function saveUsers(users) {
  localStorage.setItem(KEY, JSON.stringify(users));
}
