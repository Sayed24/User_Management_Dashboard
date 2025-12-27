export function initAuth() {
  const login = document.getElementById("loginScreen");
  const app = document.getElementById("app");

  const saved = localStorage.getItem("user");
  if (saved) {
    login.classList.add("hidden");
    app.classList.remove("hidden");
  }

  loginBtn.onclick = () => {
    localStorage.setItem("user", loginName.value);
    login.classList.add("hidden");
    app.classList.remove("hidden");
  };

  logoutBtn.onclick = () => {
    localStorage.removeItem("user");
    location.reload();
  };
}
