# AI E-Commerce Engine 🚀

A production-style **AI-powered e-commerce platform** built with the MERN stack, designed with modular backend architecture, REST APIs, authentication, caching, AI-ready services, automated testing, Docker support, and CI/CD practices.

> **Project Status:** Active development

---

## 📌 Overview

**AI E-Commerce Engine** is a full-stack e-commerce application designed to demonstrate modern software engineering practices while providing an architecture that can be extended with AI-powered search, recommendations, and personalization.

The project focuses on:

* Scalable REST API architecture
* Secure authentication and authorization
* Product management
* Search, filtering, sorting, and pagination
* Redis-based caching architecture
* AI/embedding service integration
* React-based frontend
* Automated testing
* Docker containerization
* GitHub Actions CI

---

## ✨ Key Features

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Protected API routes
* Role-based authorization
* Admin access control

### 🛍️ Product Management

* Product CRUD operations
* Product categories and brands
* Product pricing and stock management
* Product image support
* Pagination
* Filtering
* Sorting
* Single-product retrieval

### 🤖 AI Architecture

The backend is structured to support AI-powered e-commerce capabilities, including:

* Product embeddings
* Semantic search architecture
* AI service layer
* Future recommendation and personalization systems

### ⚡ Performance

* Redis cache layer
* Pagination for large product datasets
* Modular service architecture
* Compression middleware
* Efficient REST API design

### 🖥️ Frontend

* React-based client
* Vite development environment
* Admin-oriented application architecture
* API integration using Axios

### 🧪 Testing & Quality

* Automated test structure
* API testing support
* Modular code organization
* Centralized API response handling
* Error-handling middleware

### 🐳 DevOps

* Docker support
* Docker Compose configuration
* GitHub Actions CI pipeline
* Environment-based configuration

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │     React Client     │
                    │      (Vite)          │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │    Express Server    │
                    │       (Node.js)      │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
       │   MongoDB   │  │    Redis    │  │ AI Services │
       │  Database   │  │    Cache    │  │  Embeddings │
       └─────────────┘  └─────────────┘  └─────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Axios
* React Router

### Backend

* Node.js
* Express.js
* JWT
* Mongoose
* REST APIs

### Database & Caching

* MongoDB
* Redis

### AI

* Embedding-based architecture
* Semantic search architecture
* AI service layer

### DevOps

* Docker
* Docker Compose
* GitHub Actions

### Development

* JavaScript
* npm
* Git/GitHub

---

## 📁 Project Structure

```text
ai-ecommerce-engine/
│
├── client/                  # React frontend
│
├── server/                  # Node.js / Express backend
│   └── src/
│       ├── ai/              # AI-related services
│       ├── cache/           # Redis/cache layer
│       ├── config/          # Configuration
│       ├── controllers/     # Request controllers
│       ├── data/            # Application data
│       ├── middleware/      # Express middleware
│       ├── models/          # Mongoose models
│       ├── routes/          # API routes
│       ├── seed/            # Database seed scripts
│       ├── services/        # Business logic
│       ├── utils/           # Utility functions
│       ├── app.js
│       └── server.js
│
├── docs/                    # Project documentation
├── tests/                   # Automated tests
├── demo/                    # Demo resources
├── screenshots/             # Application screenshots
│
├── .github/
│   └── workflows/           # GitHub Actions
│
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── README.md
```

---

## ⚙️ Prerequisites

Make sure the following are installed:

* Node.js 18+
* npm
* MongoDB
* Redis
* Git
* Docker *(optional)*

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/CodeWithArafath/ai-ecommerce-engine.git

cd ai-ecommerce-engine
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server` directory.

Use `.env.example` as the template.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
JWT_SECRET=your_jwt_secret
```

> Never commit real credentials, API keys, JWT secrets, or database passwords to GitHub.

---

## ▶️ Running the Application

### Start the backend

```bash
cd server
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will be available at the Vite development URL shown in the terminal.

---

## 🌱 Database Seeding

The project includes a product seed script capable of generating a large product dataset for development and API testing.

From the `server` directory:

```bash
node src/seed/seedProducts.js
```

> The seed script clears existing products before inserting the generated dataset. Use it only when you intentionally want to reset the product collection.

---

## 🔌 API Overview

### Authentication

| Method | Endpoint             | Description     |
| ------ | -------------------- | --------------- |
| POST   | `/api/auth/register` | Register a user |
| POST   | `/api/auth/login`    | Login           |

### Products

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/api/products`     | Get products         |
| GET    | `/api/products/:id` | Get a single product |
| POST   | `/api/products`     | Create a product     |
| PUT    | `/api/products/:id` | Update a product     |
| DELETE | `/api/products/:id` | Delete a product     |

### Product Query Features

The product API supports query-based operations such as:

```text
?page=1&limit=10
```

along with product filtering and sorting capabilities.

---

## 🔐 Authentication

Protected endpoints use JWT authentication.

Include the token in the request header:

```http
Authorization: Bearer <your_token>
```

Administrative operations require the appropriate user role.

---

## 🤖 AI Architecture

The project includes a dedicated AI layer designed to support intelligent e-commerce functionality.

The architecture can be extended to provide:

* Semantic product search
* Product similarity
* Personalized recommendations
* AI-powered product discovery
* Embedding-based retrieval

The separation of AI services from the main API layer allows future AI models or vector databases to be integrated without restructuring the entire application.

---

## ⚡ Redis Caching

Redis is included as a caching layer to improve API performance and reduce unnecessary database queries.

The architecture allows frequently accessed data such as product listings and search results to be cached.

---

## 🧪 Testing

The repository contains a dedicated testing structure.

Run the project's available tests using the npm scripts defined in the backend/frontend packages.

API endpoints can also be tested using tools such as:

* Postman
* PowerShell
* REST clients

---

## 🐳 Docker

The project includes Docker support for running the application in a containerized environment.

Build and start the services using:

```bash
docker compose up --build
```

To stop the services:

```bash
docker compose down
```

---

## 🔄 CI/CD

GitHub Actions is configured to automate project checks.

The CI pipeline is intended to help verify:

* Dependency installation
* Application build
* Automated tests
* Code integration

This provides a foundation for future automated deployment.

---

## 🛡️ Security Practices

The project follows several security-oriented practices:

* JWT authentication
* Protected routes
* Role-based authorization
* Environment variables for secrets
* Helmet security middleware
* CORS configuration
* Request logging
* Compression
* Separation of configuration from source code

**Never commit `.env` files containing real credentials.**

---

## 📈 Future Roadmap

### Phase 1 — Core Platform

* [x] REST API architecture
* [x] Product management
* [x] Authentication
* [x] Pagination
* [x] Filtering and sorting

### Phase 2 — Performance

* [ ] Complete Redis caching integration
* [ ] Database query optimization
* [ ] Performance benchmarking

### Phase 3 — AI

* [ ] Production embedding pipeline
* [ ] Vector database integration
* [ ] Semantic product search
* [ ] AI product recommendations
* [ ] Personalized shopping experience

### Phase 4 — E-Commerce

* [ ] Shopping cart
* [ ] Order management
* [ ] Payment gateway
* [ ] Inventory management
* [ ] Order tracking

### Phase 5 — Production

* [ ] Production deployment
* [ ] Monitoring and logging
* [ ] Advanced analytics
* [ ] Performance testing
* [ ] Automated deployment

---

## 📚 Documentation

Additional project documentation is available in:

```text
docs/
```

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the available tests
5. Commit your changes
6. Open a pull request

---

## 📄 License

This project is currently intended for educational and portfolio purposes.

---

## 👨‍💻 Author

**Arafath**

GitHub: [CodeWithArafath](https://github.com/CodeWithArafath)

---

⭐ If you find this project interesting, consider starring the repository.
