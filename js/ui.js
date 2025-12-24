import { saveUsers } from "./storage.js";

const usersGrid = document.getElementById("usersGrid");

export function renderUsers(users) {
  usersGrid.innerHTML = "";

  if (users.length === 0) {
    usersGrid.innerHTML = "<p>No users yet.</p>";
    return;
  }

  users.forEach(user => {
    const card = document.createElement("div");
    card.className = "user-card";

    card.innerHTML = `
      <img src="${user.image || "https://via.placeholder.com/150"}" alt="${user.firstName}">
      <p class="user-name">${user.firstName} ${user.lastName}</p>
      <p class="user-city">${user.city || ""}</p>
      <p>${user.email}</p>
      <p>${user.phone || ""}</p>

      <div class="user-actions">
        <button class="btn-delete">Delete</button>
      </div>
    `;

    card.querySelector(".btn-delete").addEventListener("click", () => {
      deleteUser(user.id, users);
    });

    usersGrid.appendChild(card);
  });
}

function deleteUser(id, users) {
  const updatedUsers = users.filter(user => user.id !== id);
  saveUsers(updatedUsers);
  renderUsers(updatedUsers);
}

