import { getSettings, saveSettings } from "./storage.js";

let mediaQuery;

export function initTheme() {
  mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const settings = getSettings();
  applyTheme(settings.theme || "system");
  applyDensity(settings.density || "comfortable");

  document.getElementById("themeToggle").addEventListener("click", () => {
    const current = document.documentElement.dataset.theme;
    const next = current === "dark" ? "light" : "dark";
    saveSettings({ theme: next });
    applyTheme(next);
  });

  document.querySelectorAll("[data-theme-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const choice = button.dataset.themeChoice;
      saveSettings({ theme: choice });
      applyTheme(choice);
    });
  });

  document.querySelectorAll("[data-density]").forEach((button) => {
    button.addEventListener("click", () => {
      const density = button.dataset.density;
      saveSettings({ density });
      applyDensity(density);
    });
  });

  mediaQuery.addEventListener?.("change", () => {
    const settingsNow = getSettings();
    if (settingsNow.theme === "system") applyTheme("system");
  });
}

export function applyTheme(choice) {
  const resolved = choice === "system" ? (mediaQuery?.matches ? "dark" : "light") : choice;
  document.documentElement.dataset.theme = resolved;
  document.getElementById("themeIcon").textContent = resolved === "dark" ? "☀" : "☾";
  document.getElementById("themeToggle").setAttribute("aria-label", resolved === "dark" ? "Switch to light theme" : "Switch to dark theme");

  document.querySelectorAll("[data-theme-choice]").forEach((button) => {
    button.classList.toggle("active", button.dataset.themeChoice === choice);
  });
}

export function applyDensity(density) {
  document.body.classList.toggle("compact", density === "compact");
  document.querySelectorAll("[data-density]").forEach((button) => {
    button.classList.toggle("active", button.dataset.density === density);
  });
}
