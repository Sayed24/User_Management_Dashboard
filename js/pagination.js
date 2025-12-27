import { users } from "./state.js";
import { renderUsers } from "./ui.js";

let page=1;
const size=6;

export function paginate(data){
  const start=(page-1)*size;
  return data.slice(start,start+size);
}

export function renderPagination(total){
  pagination.innerHTML="";
  const pages=Math.ceil(total/size);
  for(let i=1;i<=pages;i++){
    const b=document.createElement("button");
    b.textContent=i;
    b.onclick=()=>{page=i;renderUsers()};
    pagination.appendChild(b);
  }
}
