# iMovies - Full-Stack Cinema Ticket Booking Platform

A full-stack movie ticketing platform recreated from [RiteshSinghBaghel18/iMovies](https://github.com/RiteshSinghBaghel18/iMovies) with a custom **Espresso & Warm Bronze** theme, **Direct Instant Reservation** (Razorpay bypassed), **TMDB Live Sync**, and **Brevo Transactional Email** integration.

---

## 🎨 Theme & Styling

- **Primary Colors**:
  - `#5B3113` — Deep Rich Espresso / Chestnut (Buttons, hero accents, active states)
  - `#B08F7A` — Warm Sand / Light Bronze (Highlights, icons, badges, borders, auditorium screen glow)
- **Background**: Obsidian Black (`#000000`, `#09090b`, `#121216`)
- **Typography & Framework**: Tailwind CSS with custom cinema palettes + responsive layouts

---

## 🚀 Key Features

### 1. Customer Experience
- **Live Catalog (TMDB Sync)**:
  - Fetches real-time movie releases using TMDb API v3 key (`b731f3487e373d7b2b7c954592a43721`).
  - Categorized into *Now Playing* and *Upcoming*.
- **Ambient Movie Details**:
  - Embedded backdrop and trailers with cast profiles, runtime, genres, and ratings.
- **Real-Time Interactive Seat Selection**:
  - Visual auditorium layout divided into Balcony, Middle, and Lower tiers.
  - Live seat synchronization via **Socket.io**.
  - Temporary seat reservation timers to prevent race conditions.
- **Direct Instant Reservation (No Razorpay Required)**:
  - Bypasses mandatory external payment gateways with an instant checkout modal.
  - Issues scannable digital ticket passes with QR codes, transaction IDs, and one-click print/download.
- **Automated Brevo Confirmation Emails**:
  - Dispatches transactional booking confirmations via **Brevo API** (`@getbrevo/brevo`).

### 2. Admin Portal
- Dashboard analytics with live booking summaries, revenue tracking, and seat status.
- Add movies, theatres, and schedule new showtimes.
- Manage user reservations and monitor transactions.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Socket.io-client, Canvas Confetti, QRCode.react.
- **Backend**: Node.js, Express.js, Socket.io, Mongoose, JWT, Bcryptjs, Axios, Node-cron.
- **APIs**:
  - **TMDB API**: Live movie metadata and posters.
  - **Brevo API**: Transactional confirmation emails.

---

## 💻 Running the Application

### 1. Start Both Frontend & Backend (Single Command)
From the project root:
```bash
npm run dev
```
*(Runs backend on port 5000 and frontend on port 5173 concurrently).*

### Or Start Individually:
- **Backend (Port 5000)**:
  ```bash
  cd server
  npm start
  ```
- **Frontend (Port 5173)**:
  ```bash
  cd client
  npm run dev
  ```

---

## 🌐 URLs

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🗄️ MongoDB Configuration Note

The backend starts gracefully in both connected and offline database modes without crashing.

To connect your MongoDB Atlas cluster:
1. Open [`server/.env`](file:///c:/Users/rehma_3fbkvtm/Documents/IMovies/server/.env).
2. Replace `<db_username>` with your actual MongoDB Atlas database username:
   ```env
   MONGO_URI=mongodb+srv://YOUR_USERNAME:db_uXWoxP95CgEhkHCF@imovies.bylwhba.mongodb.net/IMovies
   ```
3. Restart the server. Once connected, the server will auto-seed default admin credentials and sync movies from TMDB.
