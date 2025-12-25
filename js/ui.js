import { users, PER_PAGE } from "./state.js";
import { saveUsers } from "./storage.js";
import { renderPagination } from "./pagination.js";

export function renderUsers() {
  usersGrid.innerHTML = "";
  const start = (window.currentPage-1)*PER_PAGE;
  const slice = users.slice(start,start+PER_PAGE);

  slice.forEach(user => {
    const card = document.createElement("div");
    card.className = "user-card";
    card.innerHTML = `
      <img src="${user.image}">
      <h4>${user.firstName} ${user.lastName}</h4>
      <p>${user.email}</p>
      <div class="user-actions">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>
    `;
    card.querySelector(".delete").onclick=()=>{
      users.splice(users.indexOf(user),1);
      saveUsers(); renderUsers();
    };
    card.querySelector(".edit").onclick=()=>{
      editModal.classList.remove("hidden");
      window.editUser = user;
      editFirstName.value=user.firstName;
      editLastName.value=user.lastName;
      editEmail.value=user.email;
      editPhone.value=user.phone;
      editCity.value=user.city;
      editImage.value=user.image;
    };
    usersGrid.appendChild(card);
  });
  renderPagination();
}

saveEdit.onclick=()=>{
  Object.assign(window.editUser,{
    firstName:editFirstName.value,
    lastName:editLastName.value,
    email:editEmail.value,
    phone:editPhone.value,
    city:editCity.value,
    image:editImage.value
  });
  saveUsers(); editModal.classList.add("hidden"); renderUsers();
};

cancelEdit.onclick=()=>editModal.classList.add("hidden");
