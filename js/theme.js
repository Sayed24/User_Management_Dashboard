const btn = document.getElementById("themeToggle");
const root = document.documentElement;

btn.onclick = () => {
  const t = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", t);
};
