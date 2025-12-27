import { loadUsers } from "./storage.js";
import { renderUsers } from "./ui.js";
import { initAuth } from "./auth.js";
import { initSidebar } from "./sidebar.js";
import { initExport } from "./export.js";
import "./form.js";
import "./search.js";
import "./theme.js";

initAuth();
initSidebar();
initExport();

loadUsers();
renderUsers();
