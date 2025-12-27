import { users } from "./state.js";
import { saveUsers } from "./storage.js";
import { renderUsers } from "./ui.js";

image.oninput=()=>previewImage.src=image.value;

userForm.onsubmit=e=>{
  e.preventDefault();
  users.push({
    id:Date.now(),
    firstName:firstName.value,
    lastName:lastName.value,
    email:email.value,
    phone:phone.value,
    city:city.value,
    image:image.value||"https://i.pravatar.cc/300"
  });
  saveUsers();
  renderUsers();
  userForm.reset();
  previewImage.src="";
};
