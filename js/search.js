import { users } from "./state.js";
import { renderUsers } from "./ui.js";

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = users.filter(user =>
    `${user.firstName} ${user.lastName} ${user.email} ${user.city}`
      .toLowerCase()
      .includes(value)
  );

  renderUsers(filtered);
});

