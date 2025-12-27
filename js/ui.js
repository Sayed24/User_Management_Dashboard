import { users, filteredUsers } from "./state.js";
import { saveUsers } from "./storage.js";
import { paginate, renderPagination } from "./pagination.js";
import { renderChart } from "./charts.js";

export function renderUsers(){
  const data=filteredUsers||users;
  const pageData=paginate(data);
  usersGrid.innerHTML="";

  pageData.forEach(u=>{
    const c=document.createElement("div");
    c.className="user-card";
    c.innerHTML=`
      <img src="${u.image}">
      <h4>${u.firstName} ${u.lastName}</h4>
      <p>${u.email}</p>
      <p>${u.city}</p>
      <button onclick="editUser(${u.id})">Edit</button>
      <button onclick="deleteUser(${u.id})">Delete</button>
    `;
    usersGrid.appendChild(c);
  });

  totalUsers.textContent=users.length;
  totalCities.textContent=new Set(users.map(u=>u.city)).size;
  renderPagination(data.length);
  renderChart();
