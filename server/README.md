# Server (Backend)

## Contents

1. [What you're building](#1-what-youre-building)
2. [Write the API contract first](#2-write-the-api-contract-first)
3. [Choose your framework](#3-choose-your-framework)
4. [Set up the project](#4-set-up-the-project)
5. [Folder structure](#5-folder-structure)
6. [Mock data (no database yet)](#6-mock-data-no-database-yet)
7. [Best practices](#7-best-practices)
8. [Midterm checklist](#8-midterm-checklist)

---

## 1. What you're building

```
  Client (frontend) ──HTTP + JSON──►  Server (this folder)  ──►  Mock data now
  Other modules' servers ──HTTP + JSON──►                         Database at finals
```

building an Express backend server for an Inventory Management System. It uses mock data for now because there is no database yet for the Midterm. This server is the only way to access the data of your module. The frontend and other modules should never handle the data directly. Instead, they call your API to get or update the data.

## 2. Write the API contract first

Before writing any code, the entire API contract is written and described in `openapi.yaml`. This serves as a to-do list and allows the frontend member and other groups to start integrating right away without waiting for the code implementation.

## 3. Choose your framework

All API endpoints use the /api/v1 prefix. Swagger UI is available at http://localhost:3000/docs, using port 3000 and your custom entry file. 

| Framework | Language | How you get Swagger UI | Good to know |
|-----------|----------|------------------------|--------------|
| **Express** | JavaScript (Node.js) | Use swagger-ui-express and yaml to read and display openapi.yaml in the browser | Fast and lightweight. You can organize your backend using a layered architecture|

## 4. Set up the project

## Setup and Installation

To set up and run the project, follow the instructions below.

### Prerequisites

Make sure you have Node.js and npm installed on your computer.

### Installation

1. Open your terminal and navigate to the `server/` directory.

2. Install the required dependencies.

   ```bash
   npm install
   ```

3. Create a `.env` file by copying `.env.example`.

   ```powershell
   copy .env.example .env
   ```

4. Check your `.env` file and make sure the server port is set to `3000` or your preferred port.

### Running the Server

Start the development server using the following command.

```bash
npm run dev
```

Alternatively, you can run the server directly.

```bash
node server.js
```

### Accessing Swagger UI

Once the server is running, open your browser and visit the following URL to view and test the API endpoints.

**Swagger UI:** http://localhost:3000/docs

Use the **Try it out** button to test the available API endpoints and view their responses.

## 5. Folder structure

```
server/
├── server.js               # Main entry point ng server sa port 3000
├── openapi.yaml            # API contract para sa Swagger
├── README.md               # Backend/Server documentation (ito ang ginagawa natin)
├── .env                    # Environment variables configuration
├── .gitignore              # Files na naka-ignore sa Git
├── package.json            # Dependencies at npm scripts
├── package-lock.json       # Locked dependency versions
└── src/
    ├── controllers/        # Request handlers
    │   ├── auth.controller.js
    │   ├── dashboard.controller.js
    │   └── item.controller.js
    ├── data/               # In-memory mock data
    │   └── items.mock.js
    ├── middleware/         # Custom middlewares
    │   ├── auth.js
    │   ├── auth.middleware.js
    │   └── validate.js
    ├── routes/             # API route definitions
    │   ├── auth.routes.js
    │   ├── inventory-transaction.routes.js
    │   ├── item.routes.js
    │   └── user.routes.js
    └── services/           # Business logic
        └── item.service.js
```

src/controllers/README.md
This folder holds the request handlers for every route. Its job is to read the incoming HTTP request get the data and send back the correct JSON response to the user.

src/services/README.md
This folder contains the main business logic and rules of the app. It does not have any HTTP code so it only focuses on processing the data.

src/data/README.md
This folder keeps the mock data and functions that read or write information. It acts as a temporary storage for the midterm project which will later change into a real database.

src/routes/README.md
This folder defines the URL paths and HTTP methods like GET or POST. It connects incoming requests so they reach the right controller.

src/middleware/README.md
This folder includes functions that run on every request before it reaches the routes. It handles tasks like checking authentication and validating user inputs.

### Same layers, different names

| Layer | Express (Your Setup) |
| :--- | :--- |
| **routes** | `src/routes/` (`auth.routes.js`, `item.routes.js`, `user.routes.js`, `inventory-transaction.routes.js`) |
| **controllers** | `src/controllers/` (`auth.controller.js`, `dashboard.controller.js`, `item.controller.js`) |
| **services** | `src/services/` (`item.service.js`) |
| **data** | `src/data/` (`items.mock.js`) |
| **middleware** | `src/middleware/` (`auth.js`, `auth.middleware.js`, `validate.js`) |
| **entry** | `server.js` |

## 6. Mock data (no database yet)

For the midterm, your endpoints must **really work**. They just store data in memory instead of a database.

- The mock data lives in `src/data/items.mock.js` and loads when the server starts[cite: 2].
- It includes five to ten realistic records with real names dates and IDs that match your `openapi.yaml` rules[cite: 2].
- GET reads data from the list[cite: 2]. POST adds a new item creates an ID and date and gives a `201` status[cite: 2]. PATCH updates an item[cite: 2]. DELETE removes an item and gives a `204` status[cite: 2].
- Search filters and pagination like `?status=...&page=2` work directly on the list[cite: 2].
- Input validation and errors work too so missing fields give a `400` error and an unknown ID gives a `404` error[cite: 2].
- The data resets every time you restart the server which is fine for the midterm[cite: 2].

## 7. Best practices

### 7. Best practices

1. Follow the contract exactly using the same paths field names and status codes. Update `openapi.yaml` first if any changes are needed and inform the team.
2. Keep route handlers thin so they only read requests call services and send responses while the rules live in `src/services/`.
3. Validate every input in body path parameters and query parameters to ensure the client is never trusted blindly.
4. Handle errors in one central place inside `src/middleware/` and always return Problem Details JSON without sending stack traces.
5. Use the right HTTP status codes for every request response.
6. Use environment variables for settings so no ports URLs or passwords are hardcoded in the files.
7. Use camelCase for all JSON response keys like `studentId` and `createdAt`.
8. Only allow authorized frontends and modules in `CORS_ORIGINS`.
9. Log every request and error to the console to make debugging easier.
10. Commit dependency lock files like `package-lock.json` so everyone installs the same package versions.
11. Test every single endpoint using the Swagger UI Try it out feature including the error cases.
## 8. Midterm checklist

- [ ] `openapi.yaml` lists **every** endpoint the module needs, with schemas, examples, and error responses
- [ ] `openapi.yaml` has **no errors** in the Swagger Editor or in `npx @redocly/cli lint openapi.yaml`
- [ ] The frontend member reviewed the contract (and so did any group that calls your API)
- [ ] **Every** endpoint in the contract is implemented and returns mock data in the correct shape
- [ ] Swagger UI runs at `http://localhost:<port>/docs`, and "Try it out" works for every endpoint
- [ ] Bad input returns `400`, and unknown IDs return `404`, both as Problem Details
- [ ] `GET /api/v1/health` returns `{ "status": "ok" }`
- [ ] A teammate can run the server using only the root README's Getting Started steps
- [ ] `.env.example` is committed, and `.env` is **not**