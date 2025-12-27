import { users } from "./state.js";
import { renderUsers } from "./ui.js";

searchInput.oninput = () => {
  const v = searchInput.value.toLowerCase();
  renderUsers(users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(v)
  ));
};
