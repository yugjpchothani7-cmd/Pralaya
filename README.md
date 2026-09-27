# PRALAYA: Predictive Resilience & Adaptive Local Action AI

> **An AI-powered anticipatory disaster intelligence platform for coastal cyclone and flood emergencies.**

PRALAYA transforms reactive emergency response into anticipatory engineering:
$$\text{Weather + Satellite + Terrain + Infrastructure + Demographics + Official Alerts}$$
$$\Downarrow$$
$$\text{Hazard Prediction} \longrightarrow \text{Exposure} \longrightarrow \text{Vulnerability} \longrightarrow \text{Cascade Failures} \longrightarrow \text{Safe Havens} \longrightarrow \text{Dynamic Evacuation} \longrightarrow \text{Continuous Re-planning}$$

---

## Architecture Principles
1. **Separation of Concerns**: Deterministic mathematical compute (surge heights, flood runoffs, Dijkstra shortest paths) is strictly isolated from generative AI reasoning.
2. **Zero Hallucination Policy**: Gemini AI Copilot never invents coordinates, shelters, or casualty figures; it reasons strictly over verified backend JSON facts.
3. **Data Provenance & Audit Integrity**: 100% of data values carry source ID, timestamp, and verification level metadata.
4. **Air-Gapped Operational Resilience**: Includes offline pre-seeded scenario vectors for autonomous operation during telecommunication failures.
5. **Secret Isolation**: Zero API keys or secrets in frontend client code.

---

## Directory Layout

```
pralaya/
├── backend/          # FastAPI async backend & modular API v1 routers
├── frontend/         # React 19 + TypeScript + Vite responsive mission control UI
├── data/             # Static administrative boundaries & pre-seeded scenario vectors
├── geospatial/       # Earth Engine & Sentinel-1 SAR raster processing pipelines
├── risk/             # Holland wind field, storm surge, and vulnerability models
├── simulation/       # What-If scenario sandbox & parametric insurance evaluator
├── ai/               # Gemini Copilot tools, guardrails, and multilingual pipeline
├── routing/          # Disaster-aware flood-penalized evacuation router
├── alerts/           # Template-grounded multilingual alert generator
├── tests/            # pytest backend suite & frontend validation tests
└── docs/             # Master Architectural Specifications & Contracts
```

---

## Quickstart Guide

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# On Windows:
.\.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
python run.py
# Backend runs at http://127.0.0.1:8000 (Swagger docs at http://127.0.0.1:8000/docs)
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

### 3. Run Tests
```bash
# Backend pytest suite:
.\backend\.venv\Scripts\pytest tests/backend -v

# Frontend type-check & build:
cd frontend
npm run build
```
