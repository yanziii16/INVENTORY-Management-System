1. Overview
The Inventory module is one of the eight modules of the College Management System. This module lets storekeepers track campus supplies and equipment, issue items to departments, and receive low-stock alerts for reorders. It has a React client that users interact with and a Node.js + Express REST API that holds the business rules. 

2. System Context





3. Building Blocks

| Part | Technology | What it does | Where it lives |
|------|------------|--------------|----------------|
| Client | React + Vite | The screens users see. Calls the API | `frontend/` |
| Server | Node.js 22 + Express | Business rules. Provides the REST API | `backend/` |
| API contract | OpenAPI 3.0 + Swagger UI | Lists every endpoint | `backend/openapi.yaml` |
| Data | Mock data (midterm), PostgreSQL (finals) | Stores items, warehouses, stock levels, issuances | `backend/src/data/` |

4. Backend Layers

5. Frontend Structure

| Screen | URL in the app | Who can see it | Endpoints used |
|--------|----------------|----------------|----------------|
| Item list | `/items` | Everyone | `GET /items` |
| Item details and stock per warehouse | `/items/:id` | Everyone | `GET /items/{id}` |
| Add item form | `/items/new` | Warehouse staff, Admin | `POST /items` |
| Issue item form | `/issuances/new` | Warehouse staff | `POST /issuances` |
| Low-stock alerts | `/low-stock` | Warehouse staff, Admin | `GET /items/low-stock` |

7. Cross-Cutting Concerns

| Concern | How we handle it |
|---------|------------------|
| Configuration | Environment variables (`.env`). See `backend/.env.example` |
| Input validation | Validation in the routes layer before the request reaches services |
| Error handling | Every error returns Problem Details JSON (see `backend/API-CONTRACT.md`) |
| Logging | Log every request and every error to the console |
| Authentication | Not in midterm. Planned: login with role-based access (staff vs admin) |
| CORS | The server allows only the URLs in `CORS_ORIGINS` |

8. Deployment

Not applicable yet.

9. Known Limitations and Future Work
No database yet. Data resets every time the server restarts.
Authentication and roles are not implemented yet.
Integration with other CMS modules is not finished yet.
Real-time stock updates are planned for finals.