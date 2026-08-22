export const state = {
  users: [],
  filteredUsers: [],
  activity: [],
  currentUser: null,
  query: "",
  roleFilter: "all",
  statusFilter: "all",
  sort: "newest",
  currentPage: 1,
  pageSize: 8,
  directoryView: "table",
  currentView: "dashboard",
  pendingConfirm: null
};

export function setUsers(users) {
  state.users = Array.isArray(users) ? users : [];
}

export function setActivity(activity) {
  state.activity = Array.isArray(activity) ? activity : [];
}

export function addActivity(type, message, actor = state.currentUser?.name || "System") {
  const item = {
    id: crypto.randomUUID ? crypto.randomUUID() : `a-${Date.now()}-${Math.random()}`,
    type,
    message,
    actor,
    createdAt: new Date().toISOString()
  };
  state.activity.unshift(item);
  state.activity = state.activity.slice(0, 100);
  return item;
}
