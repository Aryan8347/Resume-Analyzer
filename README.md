# Resume Analyzing System 

> **Next-Gen Resume Analysis & Optimization Platform**
> A high-performance, AI-driven resume analyzer offering deep insights, skill gap detection, and role matching, wrapped in a premium "Cyber-Industrial" aesthetic.

---

## 🚀 Features

### Core Intelligence (Backend)
- **AI-Powered Parsing**: Uses local LLM (**Ollama/Llama 3.2**) to extract structured data from unstructured text.
- **Deep Skill Extraction**: Identifies technical skills, tools, frameworks, and soft skills.
- **Role Mapping Engine**: Matches candidates to ideal job roles with percentage confidence.
- **Skill Gap Analysis**: Detects missing critical skills for target roles.
- **ATS Compatibility Check**: Scans for "resume killers" (tables, images, bad symbols).
- **Secure Authentication**: Unified Login/Register system using **JWT** and **SQLite** encrypted database.

### Immersive UI (Frontend)
- **"BreachBunny" Aesthetic**: Dark Charcoal theme (`#0a0a0a`) with Neon Pink accents (`#ff07fe`).
- **Interactive Visuals**:
    - "Neon Matrix" Skill Visualization.
    - 3D-style Glassmorphism cards.
    - Custom Mouse Spotlight & Grid Backgrounds.
- **System Logs**: Terminal-style feedback for all user actions.
- **Drag & Drop Protocol**: Industrial-grade file upload interface.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + PostCSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Network**: Axios

### Backend
- **API**: FastAPI (Python 3.10+)
- **Server**: Uvicorn
- **Database**: SQLite (SQLAlchemy ORM)
- **Auth**: Passlib (PBKDF2-SHA256) + Python-Jose (JWT)
- **AI Engine**: Ollama (Running `llama3.2`)
- **PDF/Doc Processing**: PyMuPDF (`fitz`), `python-docx`

---

## 📦 Installation & Setup

### Prerequisites
1.  **Python 3.10+**
2.  **Node.js 18+**
3.  **Ollama**: Installed and running [Download Ollama](https://ollama.com/).
    - Pull the model: `ollama pull llama3.2`

### 1. Backend Setup
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r ../requirements.txt

# Start the Server (Port 8001)
python main.py
```

### 2. Frontend Setup
Open a new terminal:
```powershell
cd frontend
npm install
npm run dev
```
Access the application at: **http://localhost:5173**

---

## 📂 Project Structure

```
resume_project/
├── backend/                # Python FastAPI Server
│   ├── main.py             # Entry point & API Routes
│   ├── auth_lib.py         # Auth, Database, & User Models
│   ├── processor.py        # Resume Extraction & Parsing Logic
│   ├── analyzer.py         # AI Analysis Logic
│   └── sql_app.db          # Local Database
│
├── frontend/               # React Application
│   ├── src/
│   │   ├── pages/          # Login, Upload, Dashboard, Landing
│   │   ├── components/     # Reusable UI Elements
│   │   └── api/            # Axios Client
│   └── tailwind.config.js  # Theme Configuration
│
└── requirements.txt        # Python Dependencies
```

## 🔒 Security

- **Password Hashing**: Industry-standard PBKDF2-SHA256.
- **Session**: Stateless JWT Tokens (Expire in 30 mins).
- **CORS**: Strict Origin policies allowing only the local frontend.

---

*Verified locally on Windows 11.*
