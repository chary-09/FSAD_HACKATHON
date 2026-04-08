# Project README

## Overview
This is a full-stack airline ticketing application built as a hackathon project. It offers: flight search, seat selection with real-time updates, booking summary, payment flow (mocked), and user authentication. The app uses a modern React frontend and an Express/Node.js backend with REST APIs and socket updates for seat availability.

## Features
- Flight listing and search
- Seat selection (3-3 layout) with available/booked/selected/business states
- Real-time seat status updates via Socket.IO
- Booking summary + pricing breakdown
- Payment page mimic (local simulation)
- User login/register and profile
- Admin dashboard for flight and booking management
- Ticket generation + confirmation

## Directory layout
- `frontend/`
  - `src/pages`: app pages (Home, Search Results, Seat Selection, Booking, Payment, Confirmation, Profile, Admin)
  - `src/components`: reusable UI components (SeatMap, SeatComponent, Navbar, etc.)
  - `src/config/api.js`: Axios API client for backend calls
  - `src/services/socket.js`: socket connection helper
  - CSS: Tailwind utility classes + custom overrides in `index.css`

- `backend/`
  - `server.js`: Express server setup, middleware, routes
  - `controllers/`: handles route business logic
  - `services/`: seat/flight/payment logic used by controllers
  - `models/`: data model objects (Mongoose-like or plain JS)
  - `database/`: initialization scripts (SQLite or other) and schema
  - `routes/`: API routes (auth, flights, booking, payment, admin)

## Tech Stack
- **Frontend**:
  - React (Vite)
  - Tailwind CSS for utility-first styling
  - React Router for page navigation
  - Axios for HTTP requests
  - Socket.IO client for live seat updates
  - Local state w/ React hooks for seat selection and booking

- **Backend**:
  - Node.js + Express
  - Socket.IO server
  - JWT authentication middleware
  - SQL or NoSQL (project uses schema file and initialization script in `database/`)
  - Payment stubs and validation in `paymentController.js`

- **Development tools**:
  - ESLint + Prettier (typical for JS style, may be included)
  - Concurrent dev scripts (e.g., `npm run dev` for frontend/backend if in package scripts)

## Seat selection UI updates (applied today)
- `frontend/src/components/SeatMap.jsx`:
  - reduced bright green gradient overlay
  - improved z-index and row/aisle label visibility
  - padded content to keep scrollbar outside seat grid
- `frontend/src/components/SeatComponent.jsx`:
  - explicit high-contrast classes for available/booked/selected/business seats
  - better color mappings and ring outlines
- `frontend/src/pages/SeatSelectionPage.jsx`:
  - legend updated with matching supported colors
- `frontend/src/index.css`:
  - customized `.seat-map-plane` gradient and outline
  - added custom scrollbar styles with stable gutter

## Run locally
1. `cd backend` and `npm install`, then `npm run dev` (or `node server.js`).
2. `cd frontend` and `npm install`, then `npm run dev`.
3. Open the URL shown by Vite (usually `http://localhost:5173`).

## Notes
- Mock data is used for flight seat layout when flights cannot be fetched or for demo mode.
- Real-time seat updates are through `socket.io`, using `join-flight` and `seat-updated` events.
- Styling uses Tailwind classes plus custom CSS for component-specific polish.

---

Created for FSAD Hackathon (Bharat Airways clone) with seat selection layout and accessibility improvements.