import { renderUsers } from "./ui.js";
import { saveUsers } from "./storage.js";
import { users } from "./state.js";

const form = document.getElementById("userForm");

form.addEventListener("submit", e => {
  e.preventDefault();

  const newUser = {
    id: Date.now().toString(),
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    city: city.value.trim(),
    image: image.value.trim()
  };

  if (!newUser.firstName || !newUser.lastName || !newUser.email) {
    alert("Please fill required fields");
    return;
  }

  users.push(newUser);
  saveUsers(users);
  renderUsers(users);

  form.reset();
});

