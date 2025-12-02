# PerC AI

PerC AI is a small educational web app that computes permutations and combinations and provides AI-powered explanations.

**Learning Group 3**

Team Members:
- VOOTUKURI KEERTHAN (6277)
- VASIREDDY AKHIL (6269)
- VARRI HANUMAN (4162)
- TOGANTI PRUTHVI RAJ (4157)
- NYAYAM SRI CHARAN REDDY (6288)

Overview
---
- Frontend: React + Vite (located in `perc-ai-frontend`)
- Backend: FastAPI (root `main.py`)

Requirements
---
- Node.js (v16+ recommended) and npm
- Python 3.10+ and `pip`

Environment
---
Create a `.env` file in the repository root with at least:

```
NVIDIA_API_KEY=your_nvidia_api_key_here
```

Development (frontend)
---
Open a terminal in `perc-ai-frontend` and run:

```powershell
cd "perc-ai-frontend"
npm install
npm run dev
```

This starts the Vite dev server at `http://localhost:5173` by default.

Development (backend)
---
Create and activate a virtual environment, install dependencies, and start the FastAPI dev server:

```powershell
python -m venv .venv
& ".\.venv\Scripts\Activate.ps1"
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Open the frontend and backend simultaneously to develop (frontend calls `http://127.0.0.1:8000/solve`).

Build/Production
---
Frontend build:

```powershell
cd "perc-ai-frontend"
npm run build
```

The build output will be in `perc-ai-frontend/dist`.

CI
---
A GitHub Actions workflow is included at `.github/workflows/ci.yml` that builds the frontend and validates the backend Python file.

Contributing
---
See `CONTRIBUTING.md` for guidelines.

License
---
This project uses the MIT License. See `LICENSE`.
