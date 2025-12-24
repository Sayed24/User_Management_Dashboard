import { setUsers } from "./state.js";

const STORAGE_KEY = "users";

export function loadUsers() {
  const data = localStorage.getItem(STORAGE_KEY);
  const users = data ? JSON.parse(data) : [];
  setUsers(users);
  return users;
}

export function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

