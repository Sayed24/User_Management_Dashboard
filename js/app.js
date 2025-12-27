import { initAuth } from "./auth.js";
import { loadUsers } from "./storage.js";
import { renderUsers } from "./ui.js";
import "./form.js";
import "./search.js";
import "./theme.js";

document.addEventListener("DOMContentLoaded", () => {
  initAuth();
  loadUsers();
  renderUsers();

  logoLink.onclick = e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
});
