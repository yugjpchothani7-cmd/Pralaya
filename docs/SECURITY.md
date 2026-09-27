# PRALAYA: Security Architecture & Operational Threat Model

---

### 1. Threat Modeling (STRIDE Matrix for Disaster Intelligence)

Civil defense and disaster response platforms represent high-value targets during emergencies. A compromised system could cause fatal misdirection of evacuees, fraudulent resource diversion, or panic-inducing false warnings.

| Threat Category | Disaster System Vector | Impact | PRALAYA Architectural Mitigation |
| :--- | :--- | :--- | :--- |
| **Spoofing** | Attacker impersonates IMD or district magistrate issuing fake landfall or evacuation alerts. | Mass panic, chaotic counter-evacuation into flooded zones. | Cryptographic HMAC/SHA-256 verification of ingested bulletins; RBAC authentication for alert issuance. |
| **Tampering** | Malicious alteration of shelter capacities or flood depth grids to hide road submergence. | Evacuation convoys directed into deep water traps. | Database check constraints, immutable provenance audit logs (`audit_provenance_log`), signed route packets. |
| **Repudiation** | Operator denies authorizing an emergency generator dispatch or route closure. | Lack of accountability during post-disaster judicial reviews. | Append-only audit logging with operator ID, client IP, timestamp, and action signature. |
| **Information Disclosure** | Leakage of API keys (`GEMINI_API_KEY`, `GEE_SERVICE_KEY`) or personally identifiable shelter occupant data. | Cloud resource hijacking, privacy breach of displaced families. | Zero frontend secrets; proxying all third-party calls through FastAPI; PII anonymization in public APIs. |
| **Denial of Service (DoS)** | Flooding routing endpoint with complex spatial bounding boxes during storm landfall. | System downtime when commanders need dynamic re-planning. | Redis-backed sliding-window rate limiting; hard spatial bounds on queries; pre-computed offline graph cache. |
| **Elevation of Privilege** | Public user escalates privileges to trigger parametric insurance payouts or NDRF dispatch. | Unauthorized state asset movement, fraudulent liquidity transfers. | JWT claims with strictly enforced FastAPI dependency scopes (`Security(require_role("INCIDENT_COMMANDER"))`). |

---

### 2. Secret Management & Air-Gapped Secret Isolation

1. **Zero Client-Side Secrets**:
   - The React frontend bundle contains **no third-party API keys**.
   - Prohibited in frontend: `VITE_GEMINI_API_KEY`, `VITE_GEE_KEY`, `VITE_DB_URL`.
   - The browser communicates solely with `/api/v1/*` endpoints on the FastAPI server.
2. **Server-Side Environment Configuration**:
   - All secrets are loaded through Pydantic `BaseSettings` reading exclusively from OS environment variables.
   - Development secrets reside in `.env` (strictly listed in `.gitignore`).
   - Standardized `.env.example` provides documentation without populated keys:
     ```bash
     GEMINI_API_KEY=your_gemini_api_key_here
     GEMINI_MODEL=gemini-2.5-flash
     POSTGRES_DB_URL=postgresql+asyncpg://pralaya_user:secret@localhost:5432/pralaya
     REDIS_URL=redis://localhost:6379/0
     SECRET_KEY=long_random_jwt_signing_secret_here
     ```

---

### 3. Role-Based Access Control (RBAC) Matrix

PRALAYA establishes three functional tiers of authority:

```mermaid
flowchart TD
    subgraph Roles["Role Hierarchy"]
        IC["Incident Commander (EOC Lead)"]
        RO["Responding Officer (Field NDRF / Block Officer)"]
        PC["Public Citizen / Community"]
    end

    subgraph Actions["Permitted System Operations"]
        A_PUBLIC["- View live storm track & surge extent\n- Find nearest safe shelter & turn-by-turn route\n- Read verified multilingual advisories"]
        A_FIELD["- Report real-time road obstructions\n- Update shelter headcounts & fuel status\n- Request emergency supply restock"]
        A_COMMAND["- Trigger multilingual SMS/PA emergency broadcasts\n- Execute What-If counterfactual simulations\n- Dispatch NDRF battalions & boats (MILP)\n- Authorize parametric insurance execution"]
    end

    PC --> A_PUBLIC
    RO --> A_PUBLIC & A_FIELD
    IC --> A_PUBLIC & A_FIELD & A_COMMAND
```

---

### 4. Geospatial Query Sanitization & PostGIS Injection Prevention

1. **SQL Injection Elimination**:
   - Zero raw SQL string interpolation. All PostGIS operations are constructed using SQLAlchemy 2.0 type-safe expressions or GeoAlchemy2 spatial functions:
     ```python
     # SECURE IMPLEMENTATION
     stmt = (
         select(ShelterEntity)
         .where(
             func.ST_DWithin(
                 func.ST_Transform(ShelterEntity.location_geom, 3857),
                 func.ST_Transform(func.ST_SetSRID(func.ST_MakePoint(lon, lat), 4326), 3857),
                 max_distance_meters
             )
         )
     )
     ```
2. **Denial-of-Service Query Clamping**:
   - Bounding box queries validate maximum permissible search areas ($\max 25,000\text{ km}^2$) to prevent CPU exhaustion on geometric joins.
   - Pydantic models enforce strict coordinate bounds:
     $$\text{Latitude} \in [-90.0, 90.0], \quad \text{Longitude} \in [-180.0, 180.0]$$

---

### 5. Provenance Cryptographic Integrity

Every ingested external record (IMD bulletin, CWC river gauge reading, GEE inundation mask) undergoes cryptographic digest validation upon arrival:

$$\text{Digest} = \text{SHA-256}\left(\text{CanonicalJSON}(\text{Payload}) \,\|\, \text{Timestamp}\right)$$

This digest is stored in `audit_provenance_log`. Any subsequent internal modification of historical hazard surfaces or bulletin parameters causes a mismatch against the recorded hash, immediately triggering a security audit alarm.
