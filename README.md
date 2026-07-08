# Hostel Management System

A React + Vite + Tailwind CSS front end for a university hostel management portal, with a landing page and a login screen that includes a role selector (Student, Student Affairs Unit, Sub Warden, Maintenance Staff, Hostel Canteen Staff).

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
hostel-management-system/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx          # React entry point
    ├── App.jsx           # Routes: "/" -> HomePage, "/login" -> LoginPage
    ├── index.css         # Tailwind directives
    ├── components/
    │   ├── Navbar.jsx    # Shared top navigation (Login/Register link to /login)
    │   └── Footer.jsx    # Shared footer
    └── pages/
        ├── HomePage.jsx  # Landing page (hero, hostel picker, services, stats, announcements, CTA)
        └── LoginPage.jsx # Login screen with role dropdown
```

## Notes

- Routing uses `react-router-dom`. Every "Login" / "Register" / "Student Login" button on the home page routes to `/login`.
- `LoginPage.jsx` logs the submitted `{ role, identifier, password, keepLoggedIn }` object to the console — replace that with your real authentication call.
- All content arrays (hostels, services, announcements) live at the top of `HomePage.jsx` — swap in API data whenever ready.
- Icons come from `lucide-react`.
