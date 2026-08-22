import { state } from "./state.js";
import { paginate, pageWindow } from "./pagination.js";
import { getFilteredUsers } from "./search.js";
import { renderRoleChart } from "./charts.js";
import { canEdit, canDelete } from "./auth.js";

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

export function renderAll() {
  renderAccess();
  renderHeader();
  renderOverview();
  renderDirectory();
  renderActivity();
}

export function renderHeader() {
  const user = state.currentUser;
  if (!user) return;
  document.getElementById("profileName").textContent = user.name;
  document.getElementById("profileRole").textContent = user.roleLabel;
  document.getElementById("profileAvatar").textContent = initials(user.name);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  document.getElementById("welcomeHeading").textContent = `${greeting}, ${user.name.split(/\s+/)[0]}.`;
}

export function renderAccess() {
  const editable = canEdit();
  const deletable = canDelete();

  document.querySelectorAll(".admin-control").forEach((el) => {
    el.hidden = !editable && !deletable;
  });
}

export function renderOverview() {
  const users = state.users;
  const total = users.length;
  const active = countBy(users, "status", "Active");
  const pending = countBy(users, "status", "Pending");
  const inactive = countBy(users, "status", "Inactive");
  const admins = countBy(users, "role", "Admin");
  const now = new Date();
  const newThisMonth = users.filter((user) => {
    const date = new Date(user.joinedAt);
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }).length;

  document.getElementById("statTotal").textContent = total;
  document.getElementById("statActive").textContent = active;
  document.getElementById("statAdmins").textContent = admins;
  document.getElementById("statNew").textContent = newThisMonth;
  document.getElementById("usersNavCount").textContent = total;
  document.getElementById("statActiveNote").textContent = `${total ? Math.round(active / total * 100) : 0}% of directory`;
  document.getElementById("statTotalNote").textContent = total ? "Across all teams" : "Add your first user";
  document.getElementById("statNewNote").textContent = newThisMonth ? "Recent growth" : "No new users yet";

  const percent = total ? Math.round(active / total * 100) : 0;
  document.getElementById("healthPercent").textContent = `${percent}%`;
  document.getElementById("legendActive").textContent = active;
  document.getElementById("legendPending").textContent = pending;
  document.getElementById("legendInactive").textContent = inactive;

  const activeAngle = total ? active / total * 360 : 0;
  const pendingAngle = total ? (active + pending) / total * 360 : 0;
  const donut = document.getElementById("healthDonut");
  donut.style.setProperty("--active-angle", `${activeAngle}deg`);
  donut.style.setProperty("--pending-angle", `${pendingAngle}deg`);

  renderRoleChart(users);
  renderRecentUsers(users);
}

function renderRecentUsers(users) {
  const target = document.getElementById("recentUsers");
  const recent = [...users].sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt)).slice(0, 4);
  target.innerHTML = recent.length ? recent.map((user) => `
    <button class="recent-user" type="button" data-view-user="${esc(user.id)}">
      ${avatar(user, "avatar-md")}
      <span class="recent-user-copy">
        <strong>${esc(fullName(user))}</strong>
        <span>${esc(user.department)} · ${formatRelative(user.joinedAt)}</span>
      </span>
    </button>
  `).join("") : `<div class="activity-empty">No users yet.</div>`;
}

export function renderDirectory() {
  const filtered = getFilteredUsers();
  const pageData = paginate(filtered, state.currentPage, state.pageSize);
  state.currentPage = pageData.page;

  document.getElementById("resultCount").textContent = filtered.length;

  const tableWrap = document.getElementById("usersTableWrap");
  const grid = document.getElementById("usersGrid");
  const tableBtn = document.getElementById("tableViewBtn");
  const cardBtn = document.getElementById("cardViewBtn");

  const tableMode = state.directoryView === "table";
  tableWrap.classList.toggle("hidden", !tableMode);
  grid.classList.toggle("hidden", tableMode);
  tableBtn.classList.toggle("active", tableMode);
  cardBtn.classList.toggle("active", !tableMode);

  document.getElementById("usersTableBody").innerHTML = pageData.items.map(userRow).join("");
  grid.innerHTML = pageData.items.map(userCard).join("");

  const empty = filtered.length === 0;
  document.getElementById("emptyState").classList.toggle("hidden", !empty);
  tableWrap.classList.toggle("hidden", empty || !tableMode);
  grid.classList.toggle("hidden", empty || tableMode);

  renderPagination(pageData);
}

function userRow(user) {
  return `
    <tr>
      <td>
        <button class="user-cell row-user-button" type="button" data-view-user="${esc(user.id)}">
          ${avatar(user, "avatar-md")}
          <span class="user-cell-copy">
            <strong>${esc(fullName(user))}</strong>
            <span>${esc(user.email)}</span>
          </span>
        </button>
      </td>
      <td><span class="badge ${roleClass(user.role)}">${esc(user.role)}</span></td>
      <td><span class="table-text">${esc(user.department)}</span></td>
      <td><span class="badge ${statusClass(user.status)}"><i class="dot"></i>${esc(user.status)}</span></td>
      <td><span class="table-text">${esc(user.city)}</span></td>
      <td><span class="table-text">${formatDate(user.joinedAt)}</span></td>
      <td>
        <div class="row-actions">
          <button class="row-action" type="button" data-view-user="${esc(user.id)}" aria-label="View ${esc(fullName(user))}">↗</button>
          ${canEdit() ? `<button class="row-action" type="button" data-edit-user="${esc(user.id)}" aria-label="Edit ${esc(fullName(user))}">✎</button>` : ""}
          ${canDelete() ? `<button class="row-action danger" type="button" data-delete-user="${esc(user.id)}" aria-label="Delete ${esc(fullName(user))}">⌫</button>` : ""}
        </div>
      </td>
    </tr>
  `;
}

function userCard(user) {
  return `
    <article class="user-card">
      <div class="user-card-head">
        ${avatar(user, "avatar-lg")}
        <span class="badge ${statusClass(user.status)}">${esc(user.status)}</span>
      </div>
      <div class="user-card-main">
        <h3>${esc(fullName(user))}</h3>
        <p>${esc(user.email)}</p>
      </div>
      <div class="user-card-meta">
        <span>◫ ${esc(user.department)}</span>
        <span>⌖ ${esc(user.city)}</span>
        <span>◷ Joined ${formatDate(user.joinedAt)}</span>
      </div>
      <div class="user-card-footer">
        <span class="badge ${roleClass(user.role)}">${esc(user.role)}</span>
        <div class="row-actions">
          <button class="row-action" type="button" data-view-user="${esc(user.id)}" aria-label="View ${esc(fullName(user))}">↗</button>
          ${canEdit() ? `<button class="row-action" type="button" data-edit-user="${esc(user.id)}" aria-label="Edit ${esc(fullName(user))}">✎</button>` : ""}
          ${canDelete() ? `<button class="row-action danger" type="button" data-delete-user="${esc(user.id)}" aria-label="Delete ${esc(fullName(user))}">⌫</button>` : ""}
        </div>
      </div>
    </article>
  `;
}

function renderPagination(pageData) {
  const target = document.getElementById("pagination");
  if (!pageData.totalItems) {
    target.innerHTML = "";
    return;
  }

  const pages = pageWindow(pageData.page, pageData.totalPages, 1);
  let previous = 0;
  const buttons = [];

  for (const page of pages) {
    if (previous && page - previous > 1) buttons.push(`<span class="page-btn" aria-hidden="true">…</span>`);
    buttons.push(`<button class="page-btn ${page === pageData.page ? "active" : ""}" type="button" data-page="${page}">${page}</button>`);
    previous = page;
  }

  target.innerHTML = `
    <span class="pagination-copy">Showing ${pageData.start + 1}–${pageData.end} of ${pageData.totalItems}</span>
    <div class="pagination-buttons">
      <button class="page-btn" type="button" data-page="${pageData.page - 1}" ${pageData.page <= 1 ? "disabled" : ""}>←</button>
      ${buttons.join("")}
      <button class="page-btn" type="button" data-page="${pageData.page + 1}" ${pageData.page >= pageData.totalPages ? "disabled" : ""}>→</button>
    </div>
  `;
}

export function renderActivity() {
  const target = document.getElementById("activityList");
  if (!state.activity.length) {
    target.innerHTML = `<div class="activity-empty"><strong>No activity yet.</strong><br>Actions you take in this dashboard will appear here.</div>`;
    return;
  }

  target.innerHTML = state.activity.map((item) => `
    <article class="activity-item">
      <div class="activity-symbol">${activityIcon(item.type)}</div>
      <div class="activity-copy">
        <p>${esc(item.message)}</p>
        <span>By ${esc(item.actor || "System")}</span>
      </div>
      <time class="activity-time" datetime="${esc(item.createdAt)}">${formatRelative(item.createdAt)}</time>
    </article>
  `).join("");
}

export function openDrawer(user) {
  if (!user) return;
  const drawer = document.getElementById("detailsDrawer");
  document.getElementById("drawerContent").innerHTML = `
    <div class="drawer-profile">
      ${avatar(user, "avatar-lg")}
      <h2>${esc(fullName(user))}</h2>
      <p>${esc(user.email)}</p>
      <div class="drawer-badges">
        <span class="badge ${roleClass(user.role)}">${esc(user.role)}</span>
        <span class="badge ${statusClass(user.status)}">${esc(user.status)}</span>
      </div>
    </div>
    <div class="detail-list">
      <div class="detail-row"><span>Department</span><span>${esc(user.department)}</span></div>
      <div class="detail-row"><span>Location</span><span>${esc(user.city)}</span></div>
      <div class="detail-row"><span>Phone</span><span>${esc(user.phone)}</span></div>
      <div class="detail-row"><span>Joined</span><span>${formatDateLong(user.joinedAt)}</span></div>
      <div class="detail-row"><span>User ID</span><span>${esc(user.id)}</span></div>
    </div>
    <div class="drawer-actions">
      ${canEdit() ? `<button class="btn btn-secondary" type="button" data-edit-user="${esc(user.id)}">✎ Edit</button>` : ""}
      ${canDelete() ? `<button class="btn btn-danger" type="button" data-delete-user="${esc(user.id)}">Delete</button>` : ""}
    </div>
  `;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

export function closeDrawer() {
  const drawer = document.getElementById("detailsDrawer");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

export function showToast(title, message, type = "success") {
  const region = document.getElementById("toastRegion");
  const toast = document.createElement("div");
  toast.className = `toast ${type === "error" ? "error" : ""}`;
  toast.innerHTML = `
    <div class="toast-icon">${type === "error" ? "!" : "✓"}</div>
    <div class="toast-copy"><strong>${esc(title)}</strong><span>${esc(message)}</span></div>
    <button class="toast-close" type="button" aria-label="Dismiss">×</button>
  `;
  region.appendChild(toast);

  const remove = () => {
    toast.classList.add("out");
    setTimeout(() => toast.remove(), 220);
  };
  toast.querySelector(".toast-close").addEventListener("click", remove);
  setTimeout(remove, 4200);
}

function avatar(user, sizeClass) {
  const name = fullName(user);
  const fallback = initials(name);
  const image = user.image?.trim();
  return image
    ? `<span class="avatar ${sizeClass}"><img src="${esc(image)}" alt="" loading="lazy" onerror="this.parentElement.textContent='${esc(fallback)}'"></span>`
    : `<span class="avatar ${sizeClass}">${esc(fallback)}</span>`;
}

function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";
}

function fullName(user) {
  return `${user.firstName || ""} ${user.lastName || ""}`.trim();
}

function countBy(users, key, value) {
  return users.filter((user) => user[key] === value).length;
}

function roleClass(role) {
  return `role-${String(role).toLowerCase()}`;
}

function statusClass(status) {
  return `status-${String(status).toLowerCase()}`;
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function formatDateLong(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

function formatRelative(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  const diff = date.getTime() - Date.now();
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  if (abs < 60_000) return "just now";
  if (abs < 3_600_000) return rtf.format(Math.round(diff / 60_000), "minute");
  if (abs < 86_400_000) return rtf.format(Math.round(diff / 3_600_000), "hour");
  if (abs < 604_800_000) return rtf.format(Math.round(diff / 86_400_000), "day");
  return formatDate(value);
}

function activityIcon(type) {
  return ({ add: "＋", edit: "✎", delete: "⌫", login: "→", logout: "←", reset: "↻", clear: "×", export: "⇩" })[type] || "•";
}
