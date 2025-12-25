const root=document.documentElement;
themeToggle.onclick=()=>{
  const t=root.getAttribute("data-theme")==="dark"?"light":"dark";
  root.setAttribute("data-theme",t);
  localStorage.setItem("theme",t);
};
root.setAttribute("data-theme",localStorage.getItem("theme")||"light");
