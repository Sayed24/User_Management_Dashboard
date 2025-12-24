import { loadUsers } from "./storage.js";
import { renderUsers } from "./ui.js";
import "./form.js";
import "./search.js";
import "./theme.js";

const users = loadUsers();
renderUsers(users);

