# AI E-Commerce Engine 🚀

![Node.js](https://img.shields.io/badge/Node.js-20-green)
![React](https://img.shields.io/badge/React-Vite-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green)
![Redis](https://img.shields.io/badge/Redis-Cache-red)
![Docker](https://img.shields.io/badge/Docker-Supported-blue)
![AI](https://img.shields.io/badge/AI-Recommendations-purple)

A full-stack e-commerce platform built with MERN architecture featuring authentication, product management, caching, and AI-powered search architecture.

---

# Features

## Authentication
- JWT based login
- Role based access
- Protected APIs

## Product Management
- Create products
- Update products
- Delete products
- Search products
- Filtering
- Pagination

## Performance
- Redis caching layer
- Optimized API structure

## AI Capabilities
- Product embeddings architecture
- Semantic search module
- Recommendation engine

---

# Tech Stack

## Frontend
- React
- Vite
- Axios
- Tailwind CSS

## Backend
- Node.js
- Express.js
- JWT
- REST APIs

## Database
- MongoDB
- Mongoose

## Infrastructure
- Docker
- Redis
- GitHub Actions CI

---

# Architecture

            User

             |

          React

             |

        Express API

             |

    ----------------

    |              |

 MongoDB        Redis

    |

 AI Layer
---

# API Examples


## Login

POST

/api/auth/login


## Products

GET

/api/products


POST

/api/products


PUT

/api/products/:id


DELETE

/api/products/:id


---

# Project Structure

client/
React application

server/
controllers
routes
models
middleware
services
ai

docs/
API documentation
AI documentation

docker-compose.yml


---

# Running Project


Backend:


cd server
npm install
npm run dev



Frontend:


cd client
npm install
npm run dev



---

# Future Improvements

- Real vector database integration
- Cloud deployment
- AI shopping assistant
- Advanced analytics
- Payment integration

