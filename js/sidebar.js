import { state } from "./state.js";

const titles = {
  dashboard: ["WORKSPACE", "Overview"],
  users: ["DIRECTORY", "Users"],
  activity: ["AUDIT TRAIL", "Activity"],
  settings: ["PREFERENCES", "Settings"]
};

export function initNavigation({ onViewChange }) {
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  const menuBtn = document.getElementById("menuBtn");

  function navigate(view) {
    if (!titles[view]) return;
    state.currentView = view;

    document.querySelectorAll("[data-view-panel]").forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.viewPanel === view);
    });
    document.querySelectorAll(".nav-item[data-view]").forEach((button) => {
      button.classList.toggle("active", button.dataset.view === view);
    });

    document.getElementById("pageEyebrow").textContent = titles[view][0];
    document.getElementById("pageTitle").textContent = titles[view][1];
    closeSidebar();
    onViewChange?.(view);
    requestAnimationFrame(() => document.getElementById("mainContent").focus({ preventScroll: true }));
  }

  function openSidebar() {
    sidebar.classList.add("open");
    backdrop.hidden = false;
    menuBtn.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    backdrop.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
  }

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => navigate(button.dataset.view));
  });
  document.querySelectorAll("[data-go-view]").forEach((button) => {
    button.addEventListener("click", () => navigate(button.dataset.goView));
  });

  menuBtn.addEventListener("click", () => sidebar.classList.contains("open") ? closeSidebar() : openSidebar());
  backdrop.addEventListener("click", closeSidebar);
  document.getElementById("logoLink").addEventListener("click", (event) => {
    event.preventDefault();
    navigate("dashboard");
  });
  document.getElementById("profileSettingsBtn").addEventListener("click", () => navigate("settings"));

  return { navigate, closeSidebar };
}
