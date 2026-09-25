# 📚 Library Management System — MERN + AI

A full-stack Library Management System built with **MongoDB, Express, React, and Node.js**, featuring three AI-powered features using the **Anthropic Claude API**.

---

## ✨ Features

### User Features
- Browse and search the full book catalog
- **AI Smart Search** — describe what you want in plain English ("a thriller set in Japan")
- Reserve books and get notified when available
- View active loans, due dates, and fine amounts
- Renew books online (up to 2 renewals per book)
- **AI Recommendations** — personalised picks based on your reading history
- **AI Support Chatbot** — instant answers about library policies
- Notification centre with due-date and fine alerts

### Admin Features
- Dashboard with live stats and charts
- Full book management (add, edit, delete)
- User management (activate/deactivate, upgrade membership)
- Issue and return books on behalf of members
- Reports with monthly trend charts

### AI Features (Powered by Claude)
- **Natural Language Search** — extracts structured search intent from plain English queries
- **Personalised Recommendations** — analyses borrowing history, returns 5 scored suggestions
- **Library Chatbot** — context-aware assistant that knows your current loans and overdue status

### Background Automation
- Automatic overdue marking every hour with fine calculation (₹5/day)
- Due-tomorrow reminder notifications sent daily

---

## 🗂 Project Structure

```
library-management/
├── client/                  ← React + Vite frontend
│   ├── src/
│   │   ├── components/      ← 18 page components
│   │   ├── context/         ← AuthContext (JWT + user state)
│   │   ├── services/        ← api.js (axios instance + all API calls)
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── server/                  ← Express + MongoDB backend
    ├── models/              ← User, Book, Transaction, Notification
    ├── routes/              ← auth, books, transactions, users, notifications, ai
    ├── middleware/          ← auth.js (JWT protect + adminOnly)
    ├── cron.js              ← Background jobs (overdue checker, reminders)
    ├── seed.js              ← One-time data seeder
    ├── server.js
    └── package.json
```

---

## ⚙️ Setup (Step by Step)

### Prerequisites
- **Node.js v18+**
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account
- An [Anthropic API key](https://console.anthropic.com)

---

### Step 1 — Configure the Backend

Create the file `server/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/library?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxx
PORT=5000
CLIENT_URL=http://localhost:5173
```

> **How to get MongoDB URI:**
> 1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) → Create free cluster
> 2. Click **Connect** → **Drivers** → Copy the connection string
> 3. Replace `<user>` and `<password>` with your Atlas credentials

---

### Step 2 — Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

---

### Step 3 — Seed the Database

Run once to insert 12 sample books and create the admin account:

```bash
cd server
node seed.js
```

This creates:
- **12 sample books** across all categories
- **Admin account:** `admin@library.com` / `admin123`

---

### Step 4 — Start the App

Open **two terminals**:

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

Open your browser at **http://localhost:5173**

---

## 🔑 Default Login Credentials

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | admin@library.com   | admin123  |
| User  | Register a new account at /register |

---

## 📡 API Reference

### Auth
| Method | Endpoint                  | Access | Description          |
|--------|---------------------------|--------|----------------------|
| POST   | /api/auth/register        | Public | Register new user    |
| POST   | /api/auth/login           | Public | Login, get JWT       |
| GET    | /api/auth/me              | User   | Get current user     |
| PUT    | /api/auth/update-profile  | User   | Update profile       |
| PUT    | /api/auth/change-password | User   | Change password      |

### Books
| Method | Endpoint       | Access | Description             |
|--------|----------------|--------|-------------------------|
| GET    | /api/books     | User   | List all (with filters) |
| GET    | /api/books/:id | User   | Get single book         |
| POST   | /api/books     | Admin  | Add new book            |
| PUT    | /api/books/:id | Admin  | Update book             |
| DELETE | /api/books/:id | Admin  | Delete book             |

### Transactions
| Method | Endpoint                    | Access | Description          |
|--------|-----------------------------|--------|----------------------|
| GET    | /api/transactions/my        | User   | My loans             |
| GET    | /api/transactions           | Admin  | All transactions     |
| POST   | /api/transactions/issue     | Admin  | Issue book to user   |
| POST   | /api/transactions/return    | Admin  | Return a book        |
| POST   | /api/transactions/renew     | User   | Renew a loan         |
| POST   | /api/transactions/reserve   | User   | Reserve a book       |
| GET    | /api/transactions/stats     | Admin  | Summary stats        |

### AI
| Method | Endpoint              | Access | Description                    |
|--------|-----------------------|--------|--------------------------------|
| POST   | /api/ai/search        | User   | Natural language book search   |
| POST   | /api/ai/recommendations | User | Personalised recommendations  |
| POST   | /api/ai/chat          | User   | Library chatbot                |

---

## 📋 Library Policies (Built-in)

| Policy           | Value                              |
|------------------|------------------------------------|
| Borrowing period | 14 days                            |
| Renewals         | 2 per book (14-day extension each) |
| Late fine        | ₹5 per day overdue                 |
| Max books        | 5 (Standard), 8 (Premium)         |
| Reservations     | Unlimited — notified when available|

---

## 🛠 Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, Vite, React Router, Framer Motion, Recharts, Lucide Icons |
| Backend   | Node.js, Express 4, Mongoose 8          |
| Database  | MongoDB Atlas                           |
| Auth      | JWT (jsonwebtoken), bcryptjs            |
| AI        | Anthropic Claude API (claude-sonnet-4)  |
| HTTP      | Axios                                   |

---

## 🚀 Production Deployment

### Backend (Render / Railway)
1. Push `server/` to a Git repo
2. Set all environment variables from `server/.env`
3. Build command: `npm install`
4. Start command: `node server.js`

### Frontend (Vercel / Netlify)
1. Push `client/` to a Git repo
2. Set environment variable: `VITE_API_URL=https://your-backend-url.com/api`
3. Update `client/src/services/api.js` baseURL to use `import.meta.env.VITE_API_URL`
4. Build command: `npm run build` | Output: `dist/`

---

## 🔒 Security Notes

- Change `JWT_SECRET` to a long random string before deployment
- Never commit `server/.env` to version control
- The seed script creates `admin123` — change the admin password after first login
- Rate limiting is built in (500 req / 15 min per IP)
