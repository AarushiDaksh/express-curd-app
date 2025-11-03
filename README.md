# express-curd-app

A clean, production-ready CRUD application built with **Node.js + Express** using an **MVC** structure.  
It manages two core resources: **Users** and **Tasks**.  
Includes **Docker Compose** for local development, **MongoDB** storage, request validation, and layered architecture.

---

## Table of Contents

1. Features  
2. Tech Stack  
3. Architecture (MVC)  
4. Project Structure  
5. Getting Started  
6. Environment Variables  
7. Running with Docker  
8. NPM Scripts  
9. API Reference  
10. Data Models  
11. Validation Rules  
12. Error Handling  
13. Sample Requests  
14. Testing  
15. Linting and Formatting  
16. Notes and Roadmap  
17. License

---

## 1) Features

| Area        | Details                                                                 |
|-------------|-------------------------------------------------------------------------|
| Users       | Create, read, update, delete users                                      |
| Tasks       | Create, read, update, delete tasks; link task to user                   |
| Validation  | Centralized request validation with clear error messages                |
| Config      | `.env` driven configuration                                             |
| Logging     | Basic request logging (morgan)                                          |
| Security    | Helmet, CORS                                                            |
| Docker      | `docker-compose.yml` for API + MongoDB                                  |
| Testing     | Jest + Supertest scaffolding                                            |

---

## 2) Tech Stack

| Layer     | Choice                  |
|-----------|-------------------------|
| Runtime   | Node.js                 |
| Framework | Express                 |
| DB        | MongoDB (Mongoose)      |
| Container | Docker + Docker Compose |
| Tests     | Jest + Supertest        |
| Lint      | ESLint + Prettier       |

---

## 3) Architecture (MVC)

- **Model**: Mongoose schemas and database access.  
- **View**: Not applicable for this API (JSON responses only).  
- **Controller**: Request handling, validation, and response formatting.  
- **Routes**: Map HTTP endpoints to controllers.  
- **Services**: Optional business logic layer to keep controllers thin.  
- **Middlewares**: Cross-cutting concerns (validation, errors, logging).

---

## 4) Project Structure

```
express-curd-app/
├─ src/
│  ├─ config/
│  │  └─ index.js
│  ├─ database/
│  │  └─ connect.js
│  ├─ models/
│  │  ├─ Task.js
│  │  └─ User.js
│  ├─ services/
│  │  ├─ task.service.js
│  │  └─ user.service.js
│  ├─ controllers/
│  │  ├─ task.controller.js
│  │  └─ user.controller.js
│  ├─ routes/
│  │  ├─ task.routes.js
│  │  └─ user.routes.js
│  ├─ middlewares/
│  │  ├─ validate.js
│  │  └─ error.js
│  ├─ utils/
│  │  └─ ApiResponse.js
│  ├─ app.js
│  └─ server.js
├─ tests/
│  ├─ users.test.js
│  └─ tasks.test.js
├─ docker-compose.yml
├─ Dockerfile
├─ .env.example
├─ package.json
└─ README.md
```

---

## 5) Getting Started

```bash
# 1) Install dependencies
npm install

# 2) Copy env and set values
cp .env.example .env

# 3) Start MongoDB locally (if not using Docker)
# or ensure MONGODB_URI in .env points to a running MongoDB

# 4) Run in dev mode
npm run dev
```

API runs at: `http://localhost:3000`

---

## 6) Environment Variables

| Variable     | Description                 | Example                                |
|--------------|-----------------------------|----------------------------------------|
| PORT         | Server port                 | 3000                                   |
| MONGODB_URI  | MongoDB connection string   | mongodb://mongo:27017/express-curd     |
| NODE_ENV     | Environment                 | development                            |

Place these in `.env` or use the provided `.env.example` as a template.

---

## 7) Running with Docker

```bash
docker-compose up --build
```
This will spin up the Express API and MongoDB in connected containers.

A typical `docker-compose.yml` for this project:

```yaml
version: "3.9"
services:
  api:
    build: .
    ports:
      - "${PORT:-3000}:3000"
    environment:
      - PORT=3000
      - MONGODB_URI=mongodb://mongo:27017/express-curd
      - NODE_ENV=development
    depends_on:
      - mongo
  mongo:
    image: mongo:7
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data: {}
```

A minimal `Dockerfile`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 8) NPM Scripts

| Script            | Description                            |
|-------------------|----------------------------------------|
| `npm run dev`     | Run development server with nodemon    |
| `npm start`       | Run production build                   |
| `npm test`        | Run test suite                         |
| `npm run lint`    | Run ESLint                             |
| `npm run format`  | Run Prettier                           |

---

## 9) API Reference

Base URL: `http://localhost:3000/api`

### User Routes

| Method | Endpoint        | Description     |
|--------|-----------------|-----------------|
| POST   | /users          | Create a user   |
| GET    | /users          | Get all users   |
| GET    | /users/:id      | Get user by ID  |
| PUT    | /users/:id      | Update user     |
| DELETE | /users/:id      | Delete user     |

### Task Routes

| Method | Endpoint        | Description     |
|--------|-----------------|-----------------|
| POST   | /tasks          | Create a task   |
| GET    | /tasks          | Get all tasks   |
| GET    | /tasks/:id      | Get task by ID  |
| PUT    | /tasks/:id      | Update task     |
| DELETE | /tasks/:id      | Delete task     |

### Common Response Format

| Field   | Type    | Description                    |
|---------|---------|--------------------------------|
| success | boolean | Operation status               |
| data    | any     | Response data payload          |
| error   | object  | Error info if `success=false`  |

Example success:
```json
{
  "success": true,
  "data": { "id": "64f...", "name": "John" }
}
```

Example error:
```json
{
  "success": false,
  "error": { "message": "Validation failed" }
}
```

---

## 10) Data Models

### User Model
| Field    | Type    | Required | Description     |
|----------|---------|----------|-----------------|
| name     | String  | Yes      | User full name  |
| email    | String  | Yes      | Unique email    |
| password | String  | Yes      | Hashed password |

### Task Model
| Field       | Type     | Required | Description          |
|-------------|----------|----------|----------------------|
| title       | String   | Yes      | Task title           |
| description | String   | No       | Task details         |
| status      | String   | No       | Default: pending     |
| user        | ObjectId | Yes      | Reference to User    |

---

## 11) Validation Rules

| Resource | Rule                                                |
|----------|-----------------------------------------------------|
| User     | `email` must be valid and unique                    |
| User     | `password` minimum length and hashed before saving  |
| Task     | `title` is required                                 |
| Task     | `user` must be a valid User reference               |
| Common   | Update requests require at least one valid field    |

---

## 12) Error Handling

Centralized middleware handles:
- Invalid input  
- Database errors  
- Not Found routes  
- Unexpected server errors

Error responses are always in the common format with `success=false` and an `error` object.

---

## 13) Sample Requests

Create user:
```bash
curl -X POST http://localhost:3000/api/users   -H "Content-Type: application/json"   -d '{"name":"Alice","email":"alice@example.com","password":"Secret123"}'
```

Create task:
```bash
curl -X POST http://localhost:3000/api/tasks   -H "Content-Type: application/json"   -d '{"title":"Write docs","description":"README first","user":"<userId>"}'
```

Update task status:
```bash
curl -X PUT http://localhost:3000/api/tasks/<taskId>   -H "Content-Type: application/json"   -d '{"status":"done"}'
```

---

## 14) Testing

| Tool     | Purpose                  |
|----------|--------------------------|
| Jest     | Unit and integration     |
| Supertest| HTTP endpoint testing    |

Example run:
```bash
npm test
```

---

## 15) Linting and Formatting

| Tool     | Command           |
|----------|-------------------|
| ESLint   | `npm run lint`    |
| Prettier | `npm run format`  |

---

## 16) Notes and Roadmap

- Add authentication and authorization  
- Pagination and filtering for list endpoints  
- Request rate limiting  
- OpenAPI (Swagger) documentation

---


