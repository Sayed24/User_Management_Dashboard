// Optional helper retained for compatibility with the original modular project.
// Call enableDragSort(container, onReorder) if you later want drag-and-drop card ordering.
export function enableDragSort(container, onReorder) {
  if (!container) return;
  let dragged = null;

  container.addEventListener("dragstart", (event) => {
    const item = event.target.closest("[draggable='true']");
    if (!item) return;
    dragged = item;
    item.setAttribute("aria-grabbed", "true");
  });

  container.addEventListener("dragover", (event) => {
    if (!dragged) return;
    event.preventDefault();
    const target = event.target.closest("[draggable='true']");
    if (!target || target === dragged) return;
    const rect = target.getBoundingClientRect();
    target.parentNode.insertBefore(dragged, event.clientY < rect.top + rect.height / 2 ? target : target.nextSibling);
  });

  container.addEventListener("dragend", () => {
    if (!dragged) return;
    dragged.removeAttribute("aria-grabbed");
    dragged = null;
    onReorder?.([...container.querySelectorAll("[data-id]")].map((item) => item.dataset.id));
  });
}
