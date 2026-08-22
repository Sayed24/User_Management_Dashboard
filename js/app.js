import { state, addActivity } from "./state.js";
import {
  loadUsers, saveUsers, restoreDemoUsers, clearUsers,
  loadActivity, saveActivity, clearActivity, getSettings, saveSettings
} from "./storage.js";
import { initAuth, canDelete, canEdit } from "./auth.js";
import { initTheme, applyDensity } from "./theme.js";
import { initSearch } from "./search.js";
import { initNavigation } from "./sidebar.js";
import { initUserForm } from "./form.js";
import { exportUsersCSV } from "./export.js";
import {
  renderAll, renderOverview, renderDirectory, renderActivity,
  openDrawer, closeDrawer, showToast
} from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  loadUsers();
  loadActivity();
  initTheme();

  const settings = getSettings();
  state.directoryView = settings.directoryView || "table";
  applyDensity(settings.density || "comfortable");

  const nav = initNavigation({
    onViewChange(view) {
      document.getElementById("profileMenu").hidden = true;
      if (view === "users") renderDirectory();
      if (view === "activity") renderActivity();
    }
  });

  const search = initSearch(() => renderDirectory());

  const form = initUserForm({
    onSaved() {
      renderAll();
    },
    showToast
  });

  initAuth({
    onLogin() {
      renderAll();
      updatePermissionCopy();
    },
    onLogout() {
      nav.navigate("dashboard");
    }
  });

  if (state.currentUser) {
    renderAll();
    updatePermissionCopy();
  }

  // Add user actions
  document.getElementById("addUserBtn").addEventListener("click", () => form.open());
  document.getElementById("addUserBtnTop").addEventListener("click", () => form.open());

  // Global search shortcut/button
  const globalSearchBtn = document.getElementById("globalSearchBtn");
  globalSearchBtn.addEventListener("click", () => {
    nav.navigate("users");
    setTimeout(() => search.searchInput.focus(), 0);
  });

  document.addEventListener("keydown", (event) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
    if (event.key === "/" && !typing && state.currentUser) {
      event.preventDefault();
      nav.navigate("users");
      setTimeout(() => search.searchInput.focus(), 0);
    }
    if (event.key === "Escape") {
      closeDrawer();
      form.close();
      closeConfirm();
      document.getElementById("profileMenu").hidden = true;
    }
  });

  // Directory table/card view
  document.getElementById("tableViewBtn").addEventListener("click", () => setDirectoryView("table"));
  document.getElementById("cardViewBtn").addEventListener("click", () => setDirectoryView("card"));

  // Delegated user actions
  document.addEventListener("click", (event) => {
    const viewBtn = event.target.closest("[data-view-user]");
    const editBtn = event.target.closest("[data-edit-user]");
    const deleteBtn = event.target.closest("[data-delete-user]");
    const pageBtn = event.target.closest("[data-page]");

    if (viewBtn) {
      const user = state.users.find((item) => item.id === viewBtn.dataset.viewUser);
      openDrawer(user);
    }

    if (editBtn) {
      const user = state.users.find((item) => item.id === editBtn.dataset.editUser);
      if (user) {
        closeDrawer();
        form.open(user);
      }
    }

    if (deleteBtn) {
      const user = state.users.find((item) => item.id === deleteBtn.dataset.deleteUser);
      if (user) requestDelete(user);
    }

    if (pageBtn && !pageBtn.disabled) {
      state.currentPage = Number(pageBtn.dataset.page) || 1;
      renderDirectory();
      document.querySelector(".directory-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  document.querySelectorAll("[data-close-drawer]").forEach((el) => el.addEventListener("click", closeDrawer));

  // Profile menu
  const profileBtn = document.getElementById("profileBtn");
  const profileMenu = document.getElementById("profileMenu");
  profileBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const hidden = profileMenu.hidden;
    profileMenu.hidden = !hidden;
    profileBtn.setAttribute("aria-expanded", String(hidden));
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".profile-wrap")) {
      profileMenu.hidden = true;
      profileBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Export
  document.getElementById("exportBtn").addEventListener("click", () => {
    exportUsersCSV();
    addActivity("export", `Exported ${state.filteredUsers.length || state.users.length} users to CSV.`);
    saveActivity();
    renderActivity();
    showToast("Export complete", "Your CSV file has been created.");
  });

  // Activity
  document.getElementById("clearActivityBtn").addEventListener("click", () => {
    if (!canEdit()) return permissionDenied();
    openConfirm({
      title: "Clear activity?",
      message: "This removes the local activity history from this browser.",
      actionLabel: "Clear activity",
      onConfirm() {
        clearActivity();
        renderActivity();
        showToast("Activity cleared", "The local audit trail is empty.");
      }
    });
  });

  // Demo reset
  document.getElementById("resetDemoBtn").addEventListener("click", () => {
    if (!canEdit()) return permissionDenied();
    openConfirm({
      title: "Restore demo users?",
      message: "Your current directory will be replaced with the original demo users.",
      actionLabel: "Restore",
      onConfirm() {
        restoreDemoUsers();
        addActivity("reset", "Restored the demo user directory.");
        saveActivity();
        state.currentPage = 1;
        renderAll();
        showToast("Demo restored", "The sample users are back.");
      }
    });
  });

  // Clear local data
  document.getElementById("clearDataBtn").addEventListener("click", () => {
    if (!canDelete()) return permissionDenied("Only administrators can clear all local data.");
    openConfirm({
      title: "Clear all local data?",
      message: "All users and activity stored in this browser will be permanently removed.",
      actionLabel: "Clear everything",
      onConfirm() {
        clearUsers();
        clearActivity();
        state.currentPage = 1;
        renderAll();
        showToast("Local data cleared", "The directory and activity history are empty.");
      }
    });
  });

  // Confirm modal
  document.getElementById("confirmCancel").addEventListener("click", closeConfirm);
  document.getElementById("confirmAction").addEventListener("click", () => {
    const action = state.pendingConfirm?.onConfirm;
    closeConfirm();
    action?.();
  });
});

function setDirectoryView(view) {
  state.directoryView = view;
  saveSettings({ directoryView: view });
  renderDirectory();
}

function requestDelete(user) {
  if (!canDelete()) return permissionDenied("Only administrators can delete users.");

  openConfirm({
    title: "Delete user?",
    message: `${user.firstName} ${user.lastName} will be permanently removed from this local directory.`,
    actionLabel: "Delete user",
    onConfirm() {
      state.users = state.users.filter((item) => item.id !== user.id);
      addActivity("delete", `Deleted ${user.firstName} ${user.lastName} from the directory.`);
      saveUsers();
      saveActivity();
      closeDrawer();
      renderAll();
      showToast("User deleted", `${user.firstName} ${user.lastName} was removed.`);
    }
  });
}

function openConfirm({ title, message, actionLabel, onConfirm }) {
  const modal = document.getElementById("confirmModal");
  document.getElementById("confirmTitle").textContent = title;
  document.getElementById("confirmMessage").textContent = message;
  document.getElementById("confirmAction").textContent = actionLabel;
  state.pendingConfirm = { onConfirm };
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeConfirm() {
  const modal = document.getElementById("confirmModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  state.pendingConfirm = null;
}

function updatePermissionCopy() {
  if (!state.currentUser) return;
  if (state.currentUser.role === "viewer") {
    showToast("Viewer mode", "You can browse and export users, but editing is disabled.");
  }
}

function permissionDenied(message = "Your current role does not allow this action.") {
  showToast("Permission required", message, "error");
}
