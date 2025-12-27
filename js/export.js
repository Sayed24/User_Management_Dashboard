import { users } from "./state.js";

export function initExport(){
  exportBtn.onclick=()=>{
    const csv=[
      Object.keys(users[0]).join(","),
      ...users.map(u=>Object.values(u).join(","))
    ].join("\n");

    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([csv]));
    a.download="users.csv";
    a.click();
  };
}
