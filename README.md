# UserFlow — User Management Dashboard

A modern, responsive, frontend-only user management dashboard built with **HTML, CSS, and Vanilla JavaScript**. It is designed to deploy directly to **GitHub Pages** without a backend.

## Features

- Responsive desktop, tablet, and mobile dashboard
- Local demo login with Administrator, Manager, and Viewer roles
- User CRUD (create, read, update, delete) with role-based permissions
- Search across names, email, city, phone, department, role, and status
- Role and status filters
- Multiple sorting options
- Table and card directory views
- Pagination
- Dashboard statistics and role/status visualizations
- User details drawer
- Local activity/audit trail
- CSV export
- Light, dark, and system theme preferences
- Comfortable and compact table density
- Restore demo data / clear local data
- LocalStorage persistence
- Keyboard shortcut: `/` focuses user search
- Accessible labels, focus states, reduced-motion support
- No framework and no build step

## Roles

- **Administrator**: full CRUD, reset, clear data
- **Manager**: add/edit users and clear activity; cannot delete users or clear all data
- **Viewer**: read/search/filter/export only

> Authentication is intentionally a frontend demo. It is **not secure authentication** and should not be used to protect real private data.

## Project Structure

```text
User_Management_Dashboard/
├── index.html
├── README.md
├── css/
│   ├── variables.css
│   └── styles.css
└── js/
    ├── app.js
    ├── auth.js
    ├── charts.js
    ├── demoUsers.js
    ├── drag.js
    ├── export.js
    ├── form.js
    ├── pagination.js
    ├── search.js
    ├── sidebar.js
    ├── state.js
    ├── storage.js
    ├── theme.js
    └── ui.js
```

## Run Locally

Because JavaScript modules are used, serve the folder through a local HTTP server.

### VS Code
Install **Live Server**, then open `index.html` with Live Server.

### Python

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

1. Push these files to the `main` branch.
2. Open the repository **Settings → Pages**.
3. Set source to **Deploy from a branch**.
4. Choose `main` and `/ (root)`.
5. Save.

## Browser Storage

This app uses LocalStorage keys beginning with `userflow_`. Clearing site data in the browser will reset the local app.

## Notes

Avatar demo images use `i.pravatar.cc`. If the image service is unavailable, the UI falls back to user initials.
