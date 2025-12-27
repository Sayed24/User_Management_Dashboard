const root = document.documentElement;
const saved = localStorage.getItem("theme") || "light";
root.setAttribute("data-theme", saved);

themeToggle.onclick = () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
};
