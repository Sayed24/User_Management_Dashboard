import { state, addActivity } from "./state.js";
import { getSession, setSession, clearSession, saveActivity } from "./storage.js";

const roleLabels = {
  admin: "Administrator",
  manager: "Manager",
  viewer: "Viewer"
};

export function initAuth({ onLogin, onLogout }) {
  const loginScreen = document.getElementById("loginScreen");
  const app = document.getElementById("app");
  const form = document.getElementById("loginForm");
  const nameInput = document.getElementById("loginName");
  const roleSelect = document.getElementById("loginRole");
  const nameError = document.getElementById("loginNameError");

  const session = getSession();
  if (session?.name && session?.role) {
    state.currentUser = session;
    showApp(loginScreen, app);
    onLogin?.(session, false);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    if (name.length < 2) {
      nameError.textContent = "Enter at least 2 characters.";
      nameInput.focus();
      return;
    }

    nameError.textContent = "";
    const sessionData = {
      name,
      role: roleSelect.value,
      roleLabel: roleLabels[roleSelect.value] || "Viewer",
      loggedInAt: new Date().toISOString()
    };
    state.currentUser = sessionData;
    setSession(sessionData);
    addActivity("login", `${name} signed in as ${sessionData.roleLabel}.`, name);
    saveActivity();
    showApp(loginScreen, app);
    onLogin?.(sessionData, true);
  });

  function logout() {
    if (state.currentUser) {
      addActivity("logout", `${state.currentUser.name} signed out.`, state.currentUser.name);
      saveActivity();
    }
    state.currentUser = null;
    clearSession();
    app.classList.add("hidden");
    loginScreen.classList.remove("hidden");
    form.reset();
    nameInput.focus();
    onLogout?.();
  }

  document.getElementById("logoutBtn").addEventListener("click", logout);
  document.getElementById("profileLogoutBtn").addEventListener("click", logout);

  return { logout };
}

function showApp(loginScreen, app) {
  loginScreen.classList.add("hidden");
  app.classList.remove("hidden");
}

export function canEdit() {
  return state.currentUser?.role === "admin" || state.currentUser?.role === "manager";
}

export function canDelete() {
  return state.currentUser?.role === "admin";
}
