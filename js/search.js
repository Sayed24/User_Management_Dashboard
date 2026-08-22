import { state } from "./state.js";

export function getFilteredUsers() {
  const query = state.query.trim().toLowerCase();

  const filtered = state.users.filter((user) => {
    const haystack = [
      user.firstName, user.lastName, user.email, user.phone, user.city,
      user.department, user.role, user.status
    ].filter(Boolean).join(" ").toLowerCase();

    const matchesQuery = !query || haystack.includes(query);
    const matchesRole = state.roleFilter === "all" || user.role === state.roleFilter;
    const matchesStatus = state.statusFilter === "all" || user.status === state.statusFilter;

    return matchesQuery && matchesRole && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (state.sort === "name-asc") return fullName(a).localeCompare(fullName(b));
    if (state.sort === "name-desc") return fullName(b).localeCompare(fullName(a));
    if (state.sort === "oldest") return new Date(a.joinedAt) - new Date(b.joinedAt);
    return new Date(b.joinedAt) - new Date(a.joinedAt);
  });

  state.filteredUsers = sorted;
  return sorted;
}

export function initSearch(onChange) {
  const searchInput = document.getElementById("searchInput");
  const roleFilter = document.getElementById("roleFilter");
  const statusFilter = document.getElementById("statusFilter");
  const sortSelect = document.getElementById("sortSelect");

  searchInput.addEventListener("input", () => {
    state.query = searchInput.value;
    state.currentPage = 1;
    onChange();
  });

  roleFilter.addEventListener("change", () => {
    state.roleFilter = roleFilter.value;
    state.currentPage = 1;
    onChange();
  });

  statusFilter.addEventListener("change", () => {
    state.statusFilter = statusFilter.value;
    state.currentPage = 1;
    onChange();
  });

  sortSelect.addEventListener("change", () => {
    state.sort = sortSelect.value;
    state.currentPage = 1;
    onChange();
  });

  document.getElementById("clearFiltersBtn").addEventListener("click", () => {
    state.query = "";
    state.roleFilter = "all";
    state.statusFilter = "all";
    state.sort = "newest";
    state.currentPage = 1;
    searchInput.value = "";
    roleFilter.value = "all";
    statusFilter.value = "all";
    sortSelect.value = "newest";
    onChange();
    searchInput.focus();
  });

  return { searchInput };
}

function fullName(user) {
  return `${user.firstName || ""} ${user.lastName || ""}`.trim();
}
