# Inventory Module — College Management System

A full-stack Inventory Management System that manages items, authentication, transaction logs, and user roles while tracking and monitoring equipment, office supplies, and campus resources efficiently.

---

## About the Module

The Inventory Module allows campus personnel to monitor asset stock levels, manage item status, assign equipment to departments, and log inventory transactions efficiently across the campus.

---

## Users

| User | What they do in this module |
|---|---|
| **Student** | Views available equipment for official campus requests |
| **Faculty** | Requests equipment, items, or office supplies for academic use |
| **Staff / Admin** | Manages item records, updates stock levels, approves requests, and logs inventory transactions |

---

## Features

- **Item & Asset Management**: Full CRUD operations for campus equipment, items, and office supplies.
- **Inventory Transactions**: Logs for stock adjustments, items issued, and returns.
- **Role-Based Access & Authentication**: Middleware-protected endpoints for secure user actions.
- **Interactive API Documentation**: Full OpenAPI 3.0 specification served with Swagger UI.

---

## Part of the College Management System

This module is one of eight modules that together make up the College Management System.

| Module | This repo |
|---|---|
| Landing Page | |
| Library | |
| Student Portal | |
| Finance | |
| Faculty | |
| Clinic | |
| Registrar | |
| Inventory | **This module** |


---

## Team

| Name | Role | GitHub |
|---|---|---|
| **Diana Mae J. Oxina** | Backend | [@yanziii16](https://github.com/yanziii16) |
| **Angela BlesieM. Encisa** | Frontend | [@gella10](https://github.com/gella10) |
| **Mae Angela T. Faylon** | Documentation | [@maeangela12](https://github.com/maeangela12) |

> **Roles**: Backend owns `server/` and the API contract. Frontend owns `client/`. Documentation owns `docs/`, this `README.md`, and the instructor's handout.

---

## Tech Stack

| Part | Technology |
|---|---|
| **Frontend (client)** |  |
| **Backend (server)** | Express.js on Node.js |
| **API documentation** | OpenAPI 3.0 + Swagger UI |
| **Database** | Mock Data |

---

## Project Structure

```text

INVENTORY-Management-System/
├── server/                  # Express.js backend application
│   ├── src/
│   │   ├── config/          # Database and app configurations
│   │   ├── controllers/     # Controller logic
│   │   ├── data/            # Mock data and initial datasets
│   │   ├── middleware/      # Authentication & authorization middlewares
│   │   ├── routes/          # Express route handlers (auth, items, transactions, users)
│   │   └── services/        # Business logic & database operations
│   ├── openapi.yaml         # API documentation specification
│   ├── package.json         # Node.js dependencies & scripts
│   └── README.md            # Backend specific documentation
└── README.md