import { users } from "./state.js";
import { saveUsers } from "./storage.js";

const grid = document.getElementById("usersGrid");

export function renderUsers(list = users) {
  grid.innerHTML = "";

  list.forEach(user => {
    const card = document.createElement("div");
    card.className = "user-card";

    card.innerHTML = `
      <img src="${user.image || "https://i.pravatar.cc/100"}">
      <p><b>${user.firstName} ${user.lastName}</b></p>
      <p>${user.email}</p>
      <p>${user.city || ""}</p>
      <div class="user-actions">
        <button data-id="${user.id}">Delete</button>
      </div>
    `;

    card.querySelector("button").onclick = () => {
      const updated = users.filter(u => u.id !== user.id);
      saveUsers(updated);
      location.reload();
    };

    grid.appendChild(card);
  });
}
