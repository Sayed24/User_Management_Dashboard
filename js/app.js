import { loadUsers } from "./storage.js";
import { renderUsers } from "./ui.js";
import { initAuth } from "./auth.js";
import "./form.js";
import "./search.js";
import "./theme.js";

loadUsers();
initAuth();
renderUsers();

logoLink.onclick=e=>{
  e.preventDefault();
  window.scrollTo({top:0,behavior:"smooth"});
};
