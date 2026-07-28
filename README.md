# 🚲 CampusCycle — Campus Mobility, Equipment & Peer Marketplace

CampusCycle is a full-stack web platform designed to streamline campus bicycle rentals, lab/outdoor equipment borrowing, and peer-to-peer student item trading. Built with **React 19**, **Vite**, **Express**, and **MongoDB Atlas**, it is structured for one-click deployment on **Vercel**.

---

## 🌟 Key Features

### 🚲 1. Bicycle Rental System
- Browse campus bicycles with real-time availability badges (`available` / `rented`).
- One-click rental booking with automatic return date calculation and status updates.
- Admin capabilities to add, edit, or remove bicycles from the fleet.

### 🛠️ 2. Gear & Equipment Inventory
- Borrow lab electronics (Arduino, Raspberry Pi, Multimeters), tools, and outdoor equipment.
- Tracks real-time stock levels (`availableQuantity` vs `totalQuantity`).
- Prevents double-booking when inventory items are out of stock.

### 🛍️ 3. Student Marketplace (Peer-to-Peer)
- Buy and sell used textbooks, dorm appliances, and gadgets within the campus community.
- **Admin Approval Queue**: Student listing submissions enter a pending queue before appearing on the public marketplace.
- Contact seller integration allowing buyers to directly reach out to student sellers.

### 🛡️ 4. Role-Based Access Control
- **Student Role**: Rent bikes, borrow gear, post marketplace sell requests, and view personal active bookings.
- **Admin Role**: Direct marketplace listing approvals/rejections, complete catalog management, and platform analytics dashboard.

---

## 🏗️ Tech Stack

- **Frontend**: React 19, Vite, React Router v7, Recharts, Axios, Modern Glassmorphism CSS.
- **Backend**: Node.js, Express 5, Mongoose, Express-Session, Connect-Mongo, BcryptJS.
- **Database**: MongoDB Atlas (Cloud Managed Database).
- **Deployment**: Vercel (Serverless Functions for API + Vite SPA for Frontend).

---

## 🗺️ Application & Data Flow

```mermaid
graph TD
    User([User / Student]) --> Auth{Authentication}
    Auth -->|Login / Register| Session[Express Session Cookie]
    Session --> DB[(MongoDB Atlas)]

    User -->|Browse / Rent| Bikes[Bicycle Rental Module]
    User -->|Borrow| Gear[Equipment Inventory Module]
    User -->|Submit Listing| MarketPending[Pending Marketplace Queue]

    MarketPending -->|Admin Approve| MarketPublic[Public Marketplace]
    Admin([Admin User]) -->|Approve / Manage| MarketPublic
    Admin -->|Manage Fleet & Gear| DB
```

1. **Authentication Flow**: Users register/log in via Roll Number or Email. The Express session is stored directly in MongoDB using `connect-mongo`.
2. **Browsing Flow**: Frontend fetches items from `/api/bicycles`, `/api/inventory`, and `/api/marketplace`.
3. **Listing Flow**: Students submit marketplace items -> Saved with status `pending` -> Admin approves via `/api/marketplace/approve/:id` -> Listing status changes to `active`.

---

## 📂 Project Structure

```text
campus_cycle_final/
├── api/
│   └── index.js              # Vercel Serverless Function entry point
├── backend/
│   ├── config/               # Database connection & DNS fallback
│   ├── controllers/          # Business logic for Auth, Bicycles, Inventory, Marketplace
│   ├── middleware/           # Auth guard & error handling
│   ├── models/               # Mongoose schemas (User, Bicycle, Inventory, Marketplace, Booking)
│   ├── routes/               # API route declarations
│   ├── utils/                # Seed data & utilities
│   ├── server.js             # Express app definition & session setup
│   └── seeder.js             # Database seeding script
├── frontend/
│   ├── src/                  # React components, pages, context, and styles
│   ├── index.html            # Vite HTML template
│   └── vite.config.js        # Vite configuration
├── package.json              # Workspace root package scripts
├── vercel.json               # Vercel routing & build configuration
└── README.md
```

---

## ⚡ Quick Start for Developers

### Prerequisites
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **MongoDB Atlas Connection URI**

### 1. Environment Setup
Create a `.env` file in the `backend/` directory (or set environment variables):

```env
MONGODB_URI=mongodb+srv://varun_admin:rfA0qvJNDx4DL5m8@cluster0.lg2aib3.mongodb.net/campuscycle?retryWrites=true&w=majority&appName=Cluster0
SESSION_SECRET=campus_cycle_secure_session_secret_2026!
PORT=5000
NODE_ENV=development
```

### 2. Seed Database
Populate your MongoDB database with initial Admin and Student accounts, Bicycles, Gear, and Marketplace listings:

```bash
npm run seed
```

### 3. Run Locally

#### Run Backend Server:
```bash
npm run dev:backend
# Starts Express API at http://localhost:5000
```

#### Run Frontend App:
```bash
npm run dev:frontend
# Starts React Vite app at http://localhost:5173
```

---

## 🔑 Pre-Configured Test Accounts

| Role | Email / Roll No. | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@campus.edu` / `ADMIN` | `password` |
| **Student** | `john@campus.edu` / `STU123` | `password` |

---

## 🚀 Deployment on Vercel

1. Push this repository to GitHub.
2. Import the repository in [Vercel.com](https://vercel.com).
3. Set the Environment Variables in Vercel settings:
   - `MONGODB_URI`
   - `SESSION_SECRET`
   - `NODE_ENV` = `production`
4. Deploy! Vercel automatically builds the Vite frontend and routes `/api/*` requests to the serverless Express backend via `vercel.json`.
