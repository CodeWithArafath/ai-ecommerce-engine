# AI E-Commerce Engine 🚀

A high-performance e-commerce platform built with MERN stack, Redis caching, JWT authentication, and AI-powered semantic search.

## Features

### Backend
- REST API with Express.js
- JWT Authentication
- Product CRUD
- Pagination
- Filtering
- Sorting
- Search
- Error Handling

### Performance
- Redis Cache-Aside Pattern
- Reduced MongoDB queries
- Cache invalidation

### AI Features
- Product embeddings
- Semantic search
- Similar product recommendations

### Frontend
- React 19
- Admin Dashboard
- Product Management

## Tech Stack

Frontend:
- React
- Vite
- Axios
- Tailwind CSS

Backend:
- Node.js
- Express.js
- MongoDB
- Redis

AI:
- Vector Search
- Embeddings

## Architecture

User
 |
React Client
 |
Express API
 |
Redis Cache
 |
MongoDB
 |
AI Vector Search


## Installation

Backend:

cd server
npm install
npm run dev


Frontend:

cd client
npm install
npm run dev


## API Endpoints

Authentication:
POST /api/auth/register
POST /api/auth/login

Products:
GET /api/products
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id


## Future Improvements

- MongoDB Vector Search
- Docker Deployment
- CI/CD Pipeline
- Monitoring
