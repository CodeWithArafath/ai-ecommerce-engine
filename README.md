# AI E-Commerce Engine 🚀

Production-style AI powered e-commerce platform using MERN architecture.

## Implemented Features

### Backend
- Express REST API
- JWT Authentication
- User roles
- Product CRUD APIs
- Search
- Filtering
- Pagination
- Sorting
- Error handling

### Database
- MongoDB integration
- Mongoose models
- Product schema
- User schema

### Performance
- Redis cache layer
- Cache service architecture

### Frontend
- React + Vite
- Admin dashboard
- Product management
- Protected routes

### AI Roadmap
- Product embeddings
- Semantic search
- Recommendation engine
- AI shopping assistant

## Architecture

React Client
        |
        |
Express API
        |
        |
MongoDB + Redis
        |
        |
AI Recommendation Layer


## API

Authentication

POST /api/auth/register

POST /api/auth/login


Products

GET /api/products

POST /api/products

PUT /api/products/:id

DELETE /api/products/:id


## Setup

Backend:

cd server

npm install

npm run dev


Frontend:

cd client

npm install

npm run dev


## Future Enhancements

- Docker deployment
- CI/CD pipeline
- Vector database
- AI recommendations
- Cloud deployment
