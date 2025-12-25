import { users } from "./state.js";
import { saveUsers } from "./storage.js";
import { renderUsers } from "./ui.js";

image.oninput=()=>previewImage.src=image.value;

userForm.onsubmit=e=>{
  e.preventDefault();
  let ok=true;

  if(!firstName.value){errFirstName.textContent="Required";ok=false}else errFirstName.textContent="";
  if(!lastName.value){errLastName.textContent="Required";ok=false}else errLastName.textContent="";
  if(!email.value.includes("@")){errEmail.textContent="Invalid";ok=false}else errEmail.textContent="";
  if(!ok) return;

  users.push({
    id:Date.now(),
    firstName:firstName.value,
    lastName:lastName.value,
    email:email.value,
    phone:phone.value,
    city:city.value,
    image:image.value || "https://i.pravatar.cc/300"
  });

  saveUsers(); renderUsers(); userForm.reset(); previewImage.src="";
};
