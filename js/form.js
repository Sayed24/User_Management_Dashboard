import { state, addActivity } from "./state.js";
import { saveUsers, saveActivity } from "./storage.js";
import { canEdit } from "./auth.js";

export function initUserForm({ onSaved, showToast }) {
  const modal = document.getElementById("userModal");
  const form = document.getElementById("userForm");
  const title = document.getElementById("userModalTitle");

  function open(user = null) {
    if (!canEdit()) {
      showToast("Permission required", "Your role can view users but cannot modify them.", "error");
      return;
    }

    clearErrors();
    form.reset();
    document.getElementById("userId").value = user?.id || "";
    document.getElementById("firstName").value = user?.firstName || "";
    document.getElementById("lastName").value = user?.lastName || "";
    document.getElementById("email").value = user?.email || "";
    document.getElementById("role").value = user?.role || "Member";
    document.getElementById("status").value = user?.status || "Active";
    document.getElementById("department").value = user?.department || "";
    document.getElementById("city").value = user?.city || "";
    document.getElementById("phone").value = user?.phone || "";
    document.getElementById("image").value = user?.image || "";
    title.textContent = user ? "Edit user" : "Add user";

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => document.getElementById("firstName").focus());
  }

  function close() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!canEdit()) return;

    const values = getValues();
    if (!validate(values)) return;

    const id = document.getElementById("userId").value;
    const duplicate = state.users.find((user) => user.email.toLowerCase() === values.email.toLowerCase() && user.id !== id);
    if (duplicate) {
      setError("email", "That email is already in the directory.");
      document.getElementById("email").focus();
      return;
    }

    if (id) {
      const index = state.users.findIndex((user) => user.id === id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...values };
        addActivity("edit", `Updated ${values.firstName} ${values.lastName}.`);
        showToast("User updated", `${values.firstName} ${values.lastName}'s profile was saved.`);
      }
    } else {
      const user = {
        id: crypto.randomUUID ? crypto.randomUUID() : `u-${Date.now()}`,
        ...values,
        joinedAt: new Date().toISOString()
      };
      state.users.unshift(user);
      addActivity("add", `Added ${user.firstName} ${user.lastName} to the directory.`);
      showToast("User added", `${user.firstName} ${user.lastName} is now in the directory.`);
    }

    saveUsers();
    saveActivity();
    close();
    onSaved?.();
  });

  modal.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", close));

  return { open, close };
}

function getValues() {
  return {
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    email: document.getElementById("email").value.trim(),
    role: document.getElementById("role").value,
    status: document.getElementById("status").value,
    department: document.getElementById("department").value.trim() || "General",
    city: document.getElementById("city").value.trim() || "Not set",
    phone: document.getElementById("phone").value.trim() || "Not set",
    image: document.getElementById("image").value.trim()
  };
}

function validate(values) {
  clearErrors();
  let valid = true;
  if (values.firstName.length < 2) { setError("firstName", "Enter at least 2 characters."); valid = false; }
  if (values.lastName.length < 2) { setError("lastName", "Enter at least 2 characters."); valid = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) { setError("email", "Enter a valid email address."); valid = false; }
  return valid;
}

function setError(id, message) {
  document.querySelector(`[data-error-for="${id}"]`).textContent = message;
}

function clearErrors() {
  document.querySelectorAll("[data-error-for]").forEach((el) => { el.textContent = ""; });
}
