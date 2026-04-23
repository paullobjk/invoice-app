# Invoice Management App

A fully functional, responsive Invoice Management Application built with React and Vite.

## Live URL
> https://YOUR-VERCEL-URL.vercel.app

## Setup Instructions

1. Clone the repo and install:
```bash
git clone https://github.com/YOUR-USERNAME/invoice-app.git
cd invoice-app
npm install
npm run dev
```

## Architecture
- `context/InvoiceContext.jsx` — Invoice state, CRUD, LocalStorage persistence
- `context/ThemeContext.jsx` — Light/dark mode with LocalStorage persistence
- `components/Sidebar.jsx` — Navigation sidebar with theme toggle
- `components/StatusBadge.jsx` — Paid/Pending/Draft badge
- `components/Filter.jsx` — Filter dropdown by status
- `components/DeleteModal.jsx` — Confirmation modal with ESC support
- `components/InvoiceForm.jsx` — Create/Edit form drawer with validation
- `pages/InvoiceList.jsx` — Invoice list page
- `pages/InvoiceDetail.jsx` — Invoice detail page

## Features
- Full CRUD for invoices
- Draft / Pending / Paid status flow
- Form validation (required fields, email, positive numbers)
- Filter by status (multi-select)
- Light/Dark mode persisted to LocalStorage
- All data persisted via LocalStorage
- Fully responsive (320px to 1440px+)
- Keyboard navigable, semantic HTML, WCAG AA contrast

## Trade-offs
- LocalStorage used instead of backend for simplicity
- Single CSS file for easier theming with CSS variables

## Accessibility Notes
- All form fields have associated labels
- Delete modal closes on ESC and traps focus
- Invoice list items keyboard navigable with Enter
- Status badges use color + text (not color alone)
