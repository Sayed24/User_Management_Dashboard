import { users } from "./state.js";
import { saveUsers } from "./storage.js";
import { renderUsers } from "./ui.js";

let dragged;

export function enableDrag(container) {
  [...container.children].forEach((card,i) => {
    card.draggable = true;

    card.ondragstart = () => dragged = i;
    card.ondragover = e => e.preventDefault();
    card.ondrop = () => {
      const moved = users.splice(dragged,1)[0];
      users.splice(i,0,moved);
      saveUsers();
      renderUsers();
    };
  });
}
