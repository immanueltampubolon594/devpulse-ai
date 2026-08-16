# ⚡ DevPulse: AI-Powered Code Reviewer

DevPulse is a high-performance automated code review system built with **Go** and **Next.js**. It monitors GitHub Pull Requests in real-time and provides intelligent technical feedback using **Groq AI (Llama 3.3)**.

## 🔗 Live Demo
- **Dashboard:** [https://devpulse-ai-iota.vercel.app/](https://devpulse-ai-iota.vercel.app/)
- **Backend API:** [https://devpulse-ai-production.up.railway.app/](https://devpulse-ai-production.up.railway.app/)

## 🚀 Key Features
- **🌍 Bilingual Analysis:** English technical summary for global teams with deep Indonesian insights.
- **🛡️ Security Shield:** Automatically detects leaked API keys, database credentials, and plaintext passwords.
- **💡 Commit Suggestions:** Direct code fixes that can be applied with one click via GitHub.
- **📊 Professional Dashboard:** Real-time monitoring feed built with Next.js, Tailwind CSS, and Framer Motion.

## 🛠️ Tech Stack
- **Backend:** Go (Golang), Gin Gonic, GORM (SQLite)
- **Frontend:** Next.js 14, Tailwind CSS, Framer Motion, Lucide React
- **AI Engine:** Groq API (Llama 3.3-70b-versatile)
- **Workflow:** GitHub Apps & Webhooks

## 📦 Architecture
The system follows a modern event-driven architecture:
`GitHub Webhook` ➡️ `Go Backend (Railway)` ➡️ `Groq AI` ➡️ `GitHub API (Comment)` ➡️ `Next.js Dashboard (Vercel)`

## 👤 Author
- **Immanuel Tampubolon** - [GitHub Profile](https://github.com/immanueltampubolon594)
