export function initAuth(){
  loginBtn.onclick=()=>{
    localStorage.setItem("userRole",loginRole.value);
    loginScreen.classList.add("hidden");
    app.classList.remove("hidden");
  };
}
