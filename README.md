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
- **Framework**: React 18
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


```

## 🔒 Security

- **Password Hashing**: Industry-standard PBKDF2-SHA256.
- **Session**: Stateless JWT Tokens (Expire in 30 mins).
- **CORS**: Strict Origin policies allowing only the local frontend.

---

*Verified locally on Windows 11.*
