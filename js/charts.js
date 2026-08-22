export function renderRoleChart(users) {
  const target = document.getElementById("roleChart");
  const roles = ["Admin", "Manager", "Member"];
  const counts = roles.map((role) => ({
    role,
    count: users.filter((user) => user.role === role).length
  }));
  const max = Math.max(1, ...counts.map((item) => item.count));

  target.innerHTML = counts.map(({ role, count }) => `
    <div class="role-row">
      <span class="role-row-label">${role}</span>
      <div class="role-track" aria-hidden="true">
        <div class="role-bar" style="width:${Math.max(count ? 8 : 0, (count / max) * 100)}%"></div>
      </div>
      <strong class="role-value">${count}</strong>
    </div>
  `).join("");
}
