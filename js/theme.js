const root=document.documentElement;
const saved=localStorage.getItem("theme")||"light";
root.setAttribute("data-theme",saved);

themeToggle.onclick=()=>{
  const t=root.getAttribute("data-theme")==="dark"?"light":"dark";
  root.setAttribute("data-theme",t);
  localStorage.setItem("theme",t);
};
