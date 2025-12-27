import { users, filteredUsers } from "./state.js";
import { renderUsers } from "./ui.js";

searchInput.oninput = () => {
  const q = searchInput.value.toLowerCase();
  filteredUsers = q
    ? users.filter(u => Object.values(u).join(" ").toLowerCase().includes(q))
    : null;
  renderUsers();
};
