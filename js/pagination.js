import { users, currentPage, PER_PAGE } from "./state.js";
import { renderUsers } from "./ui.js";

export function renderPagination() {
  const total = Math.ceil(users.length / PER_PAGE);
  pagination.innerHTML = "";

  for (let i=1;i<=total;i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.onclick = () => {
      window.currentPage = i;
      renderUsers();
    };
    pagination.appendChild(btn);
  }
}
