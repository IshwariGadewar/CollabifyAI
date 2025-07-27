# 🤝 CollabifyAI — Real-time Collaborative Coding & AI Review Platform

## 📖 About

**CollabifyAI** is a MERN Stack (MongoDB, Express, React, Node.js) based full-stack web application that enables real-time collaborative coding, project sharing, and integrated AI code assistance. It mimics the feel of VS Code in the browser and allows users to create or join coding groups, write and edit code together, chat live, and get instant code reviews or file generation from AI models like Gemini or OpenAI.

Whether you're building a team project, pair programming, or testing snippets with AI, CollabifyAI provides a seamless collaborative experience.

---

## ✨ Features

- 🔐 User registration and authentication using JWT
- 👥 Create or join collaborative coding groups
- 🧑‍💻 VS Code–style real-time code editor with multiple file support
- 💬 Group chat with @ai mention for AI-powered code generation
- 📁 Save and preview project files (auto-generated or manually created)
- 🔍 AI code review assistant to analyze pasted code
- ⚙️ Live preview section (iFrame) to test and visualize your web app
- 📦 Group and file management system
- 🚀 Run code (via WebContainer / browser-based sandbox)
- 🌐 Responsive design built with TailwindCSS

---

## 🧠 Technologies Used

### 🔧 Frontend

- React.js
- Tailwind CSS
- Socket.IO-client
- React Router
- React Simple Code Editor
- Markdown & rehype-highlight
- Prism.js , Highlight.js

### 🛠 Backend

- Node.js + Express.js
- MongoDB + Mongoose
- Socket.IO-server
- Gemini API 
- dotenv for API key management
- JWT for authentication
- CORS, Body-parser for middleware

---

## ⬇️ Install dependencies for both backend and frontend

### 🔧 Backend

- cd backend
- npm install

### 🛠 Frontend

- cd ../frontend
- npm install

---

## 🤖 Set up Environment Variables

### 🔧 Create a .env file in the backend/ directory and add:

- PORT=PORT_NUMBER
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- GEMINI_API_KEY=your_gemini_or_openai_api_key

---

## 🚀 Setup Instructions

### 1. Clone this repository

```bash
git clone https://github.com/IshwariGadewar/CollabifyAI.git
cd CollabifyAI


