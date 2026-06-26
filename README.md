# ResolveHub - Online Complaint Registration System

ResolveHub is a premium, modern web application designed to streamline the process of lodging and resolving civic complaints (e.g., Water Leakage, Electricity issues, Municipal problems). Built with the **MERN Stack** (MongoDB, Express, React, Node.js) and styled with a beautiful, custom **Tailwind CSS v4** UI.

## 🎥 Project Demo
*(Watch the live demo of the ResolveHub application below)*

👉 **[Watch the Demo Video Here](https://1drv.ms/v/c/aaf2282d13320c36/IQB8Bx50x2JxTp7d_0gk7hAoAT8F8FjTsyf65z8lPVVFA0k)** 👈

---

## ✨ Features
- **Role-Based Dashboards:** Separate dashboards and functionalities for Citizens (Users) and Department Agents.
- **Premium UI:** Designed with modern aesthetics including glassmorphism, animated backgrounds, and glowing gradients.
- **Real-Time Live Chat:** Fully functional WhatsApp/Discord-style live chat between Citizens and Agents using `Socket.io`.
- **Status Tracking:** Complaints can be tracked in real-time (Pending, In Progress, Resolved).

## 🚀 Tech Stack
- **Frontend:** React, Vite, Tailwind CSS v4, React Router
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yaswanthhari/resolve-hub-complaint-app.git
   cd resolve-hub-complaint-app
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Run the Application:**
   Open two terminals.
   
   *Terminal 1 (Backend):*
   ```bash
   cd backend
   node server.js
   ```

   *Terminal 2 (Frontend):*
   ```bash
   cd frontend
   npm run dev
   ```

*(Note: The backend currently utilizes `mongodb-memory-server` for instant local testing without requiring external database configuration).*
