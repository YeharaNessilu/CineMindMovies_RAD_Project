# CineMindMovies_RAD_Project
# 🎬 CineMind - Movie Management System

A full-stack movie management application developed for the **Rapid Application Development (RAD)** coursework. This application allows users to search for movies, view details, and manage their favorite collections securely.

## 🚀 Live Demo (Deployment)

Click the links below to view the live application:

- **Frontend (Vercel):** [https://cine-mind-movies-rad-project-git-main-yeharas-projects.vercel.app](https://cine-mind-movies-rad-project-git-main-yeharas-projects.vercel.app)
- **Backend (Render):** [https://cinemindmovies-rad-project.onrender.com](https://cinemindmovies-rad-project.onrender.com)

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Language:** TypeScript
- **Styling:** CSS
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment:** Render

---

## ✨ Features

- **User Authentication:** Secure Sign Up & Login functionality.
- **Movie Search:** Search for movies using the connection to the backend API.
- **Responsive Design:** Works smoothly on Desktop and Mobile devices.
- **CRUD Operations:** Users can manage their data effectively.

---

## ⚙️ Installation & Setup (Run Locally)

If you want to run this project locally, follow these steps:

### 1. Clone the Repository
```bash
git clone [https://github.com/YeharaNessilu/CineMindMovies_RAD_Project.git](https://github.com/YeharaNessilu/CineMindMovies_RAD_Project.git)
cd CineMindMovies_RAD_Project
cd "RAD Cource work bakend"
npm install
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
npm start
cd "../RAD Cource work Frontend"
npm install
npm run dev