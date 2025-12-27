import { users } from "./state.js";
import { saveUsers } from "./storage.js";
import { renderUsers } from "./ui.js";

const form = document.getElementById("userForm");

form.addEventListener("submit", e => {
  e.preventDefault();

  const user = {
    id: Date.now(),
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    phone: phone.value,
    city: city.value,
    image: image.value
  };

  users.push(user);
  saveUsers(users);
  renderUsers();
  form.reset();
});
