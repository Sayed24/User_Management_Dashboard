import { users } from "./state.js";
import { saveUsers } from "./storage.js";
import { renderUsers } from "./ui.js";

const preview = document.getElementById("previewImage");

image.oninput = () => {
  preview.src = image.value || "";
};

userForm.onsubmit = e => {
  e.preventDefault();

  let valid = true;

  if (!firstName.value) {
    errFirstName.textContent = "First name required";
    valid = false;
  } else errFirstName.textContent = "";

  if (!lastName.value) {
    errLastName.textContent = "Last name required";
    valid = false;
  } else errLastName.textContent = "";

  if (!email.value.includes("@")) {
    errEmail.textContent = "Valid email required";
    valid = false;
  } else errEmail.textContent = "";

  if (!valid) return;

  users.push({
    id: Date.now(),
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    phone: phone.value,
    city: city.value,
    image: image.value
  });

  saveUsers();
  renderUsers();
  userForm.reset();
  preview.src = "";
};
