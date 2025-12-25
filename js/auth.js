import { role } from "./state.js";

loginBtn.onclick=()=>{
  localStorage.setItem("role",roleSelect.value);
  location.reload();
};

logoutBtn.onclick=()=>{
  localStorage.removeItem("role");
  location.reload();
};

export function initAuth(){
  const r=localStorage.getItem("role");
  if(!r) return;
  loginSection.classList.add("hidden");
  if(r==="admin") formSection.classList.remove("hidden");
}
