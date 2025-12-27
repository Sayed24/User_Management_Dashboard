import { users, filteredUsers } from "./state.js";
import { saveUsers } from "./storage.js";
import { renderChart } from "./charts.js";

const grid = document.getElementById("usersGrid");

export function renderUsers(){
  const data = filteredUsers || users;
  grid.innerHTML = "";

  data.forEach(u=>{
    const card = document.createElement("div");
    card.className="user-card";
    card.innerHTML=`
      <img src="${u.image}">
      <h4>${u.firstName} ${u.lastName}</h4>
      <p>${u.email}</p>
      <p>${u.city}</p>
      <div class="actions">
        <button onclick="editUser(${u.id})">Edit</button>
        <button onclick="deleteUser(${u.id})">Delete</button>
      </div>
    `;
    grid.appendChild(card);
  });

  document.getElementById("totalUsers").textContent = users.length;
  document.getElementById("totalCities").textContent =
    new Set(users.map(u=>u.city)).size;

  renderChart();
}

window.deleteUser = id=>{
  const i = users.findIndex(u=>u.id===id);
  users.splice(i,1);
  saveUsers();
  renderUsers();
};

window.editUser = id=>{
  const u = users.find(x=>x.id===id);
  editModal.classList.remove("hidden");
  window.current = u;
  editFirstName.value=u.firstName;
  editLastName.value=u.lastName;
  editEmail.value=u.email;
  editPhone.value=u.phone;
  editCity.value=u.city;
  editImage.value=u.image;
};

saveEdit.onclick=()=>{
  Object.assign(window.current,{
    firstName:editFirstName.value,
    lastName:editLastName.value,
    email:editEmail.value,
    phone:editPhone.value,
    city:editCity.value,
    image:editImage.value
  });
  saveUsers();
  editModal.classList.add("hidden");
  renderUsers();
};

cancelEdit.onclick=()=>editModal.classList.add("hidden");
