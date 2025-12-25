import { users } from "./state.js";
import { renderUsers } from "./ui.js";

searchInput.oninput = () => {
  const q = searchInput.value.toLowerCase();
  renderUsers(users.filter(u =>
    Object.values(u).join(" ").toLowerCase().includes(q)
  ));
};
