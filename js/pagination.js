export function paginate(items, currentPage, pageSize) {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const page = Math.min(Math.max(1, currentPage), totalPages);
  const start = (page - 1) * pageSize;
  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    start,
    end: Math.min(start + pageSize, totalItems),
    items: items.slice(start, start + pageSize)
  };
}

export function pageWindow(current, total, radius = 1) {
  const pages = new Set([1, total]);
  for (let i = current - radius; i <= current + radius; i += 1) {
    if (i >= 1 && i <= total) pages.add(i);
  }
  return [...pages].sort((a, b) => a - b);
}
