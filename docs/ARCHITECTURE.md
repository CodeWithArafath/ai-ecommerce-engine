\# System Architecture



\## AI E-Commerce Engine



This document describes the architecture, components, data flow, and design principles used in the AI E-Commerce Engine.



\---



\## 1. High-Level Architecture



The application follows a modular full-stack architecture based on the MERN stack.



```text

&#x20;                        ┌──────────────────────┐

&#x20;                        │      End User        │

&#x20;                        └──────────┬───────────┘

&#x20;                                   │

&#x20;                                   ▼

&#x20;                        ┌──────────────────────┐

&#x20;                        │    React Frontend    │

&#x20;                        │       (Vite)         │

&#x20;                        └──────────┬───────────┘

&#x20;                                   │

&#x20;                             HTTP / REST

&#x20;                                   │

&#x20;                                   ▼

&#x20;                 ┌──────────────────────────────────┐

&#x20;                 │          Express API              │

&#x20;                 │            Node.js                │

&#x20;                 └───────────────┬──────────────────┘

&#x20;                                 │

&#x20;         ┌───────────────────────┼────────────────────────┐

&#x20;         │                       │                        │

&#x20;         ▼                       ▼                        ▼

&#x20;┌─────────────────┐     ┌─────────────────┐      ┌─────────────────┐

&#x20;│ Authentication  │     │ Product Service │      │   AI Services   │

&#x20;│   \& Middleware  │     │    \& APIs       │      │  \& Embeddings   │

&#x20;└─────────────────┘     └────────┬────────┘      └────────┬────────┘

&#x20;                                 │                        │

&#x20;                   ┌─────────────┴─────────────┐          │

&#x20;                   │                           │          │

&#x20;                   ▼                           ▼          ▼

&#x20;            ┌─────────────┐             ┌───────────┐  ┌─────────────┐

&#x20;            │   MongoDB   │             │   Redis   │  │ Vector DB   │

&#x20;            │  Database   │             │   Cache   │  │  (Future)   │

&#x20;            └─────────────┘             └───────────┘  └─────────────┘

```



\---



\## 2. Frontend Architecture



The frontend is implemented using React and Vite.



```text

client/

├── src/

│   ├── components/

│   ├── pages/

│   ├── services/

│   ├── routes/

│   └── ...

├── public/

└── package.json

```



\### Responsibilities



The frontend is responsible for:



\* User interface

\* Product browsing

\* Authentication interaction

\* API communication

\* Admin functionality

\* Displaying API responses

\* Client-side navigation



Axios is used for communication with the backend REST API.



\---



\## 3. Backend Architecture



The backend uses Node.js and Express.



```text

server/

└── src/

&#x20;   ├── ai/

&#x20;   ├── cache/

&#x20;   ├── config/

&#x20;   ├── controllers/

&#x20;   ├── data/

&#x20;   ├── middleware/

&#x20;   ├── models/

&#x20;   ├── routes/

&#x20;   ├── seed/

&#x20;   ├── services/

&#x20;   ├── utils/

&#x20;   ├── app.js

&#x20;   └── server.js

```



The backend follows a modular separation of responsibilities.



\### Controllers



Controllers handle incoming requests and generate responses.



```text

controllers/

```



Examples include:



\* Authentication controller

\* Product controller



\---



\### Routes



Routes define the public API endpoints.



```text

routes/

```



Examples:



```text

/auth

/products

/ai

/health

```



\---



\### Models



Models define database structures using Mongoose.



```text

models/

```



The Product model contains fields such as:



\* Name

\* Description

\* Category

\* Brand

\* Price

\* Stock

\* Images

\* Embedding data



\---



\### Middleware



Middleware handles cross-cutting functionality such as:



\* JWT authentication

\* Authorization

\* Error handling

\* Request processing



\---



\### Services



Business logic that should remain independent from HTTP request handling is organized under:



```text

services/

```



This makes the application easier to extend and test.



\---



\## 4. Authentication Architecture



Authentication uses JWT-based authentication.



```text

&#x20;             User

&#x20;               │

&#x20;               ▼

&#x20;       ┌───────────────┐

&#x20;       │ Login/Register│

&#x20;       └───────┬───────┘

&#x20;               │

&#x20;               ▼

&#x20;       ┌───────────────┐

&#x20;       │ Auth Controller│

&#x20;       └───────┬───────┘

&#x20;               │

&#x20;               ▼

&#x20;       ┌───────────────┐

&#x20;       │ Generate JWT  │

&#x20;       └───────┬───────┘

&#x20;               │

&#x20;               ▼

&#x20;            Client

&#x20;               │

&#x20;      Authorization Header

&#x20;               │

&#x20;               ▼

&#x20;       ┌───────────────┐

&#x20;       │ Auth Middleware│

&#x20;       └───────┬───────┘

&#x20;               │

&#x20;        ┌──────┴──────┐

&#x20;        ▼             ▼

&#x20;      User          Admin

&#x20;     Access         Access

```



Protected requests use:



```http

Authorization: Bearer <JWT\_TOKEN>

```



\---



\## 5. Product Request Flow



A typical product request follows this flow:



```text

Client

&#x20; │

&#x20; ▼

Express Router

&#x20; │

&#x20; ▼

Authentication Middleware

&#x20; │

&#x20; ▼

Product Controller

&#x20; │

&#x20; ▼

Product Model / Service

&#x20; │

&#x20; ├──────────────► Redis Cache

&#x20; │

&#x20; ▼

MongoDB

&#x20; │

&#x20; ▼

Controller Response

&#x20; │

&#x20; ▼

Client

```



This separation allows individual layers to be modified without rewriting the entire application.



\---



\## 6. Product API Architecture



The product API supports:



\* Product listing

\* Pagination

\* Filtering

\* Sorting

\* Product retrieval

\* Product creation

\* Product updates

\* Product deletion



For large datasets, pagination prevents the API from loading the complete product collection into a single response.



Example:



```http

GET /api/products?page=1\&limit=10

```



\---



\## 7. Redis Caching Architecture



Redis is included as a performance layer.



```text

&#x20;              Product Request

&#x20;                     │

&#x20;                     ▼

&#x20;               ┌───────────┐

&#x20;               │   Redis   │

&#x20;               │   Cache   │

&#x20;               └─────┬─────┘

&#x20;                     │

&#x20;              Cache Hit?

&#x20;                /       \\

&#x20;              Yes        No

&#x20;               │          │

&#x20;               ▼          ▼

&#x20;            Return     MongoDB

&#x20;            Cached        │

&#x20;            Data          ▼

&#x20;                       Store in

&#x20;                        Redis

&#x20;                          │

&#x20;                          ▼

&#x20;                        Return

```



The caching layer is intended to reduce repeated database queries for frequently requested resources.



\---



\## 8. AI Architecture



The project contains a dedicated AI layer:



```text

server/src/ai/

```



The architecture is designed to support embedding-based functionality.



\### AI Request Flow



```text

User Query

&#x20;   │

&#x20;   ▼

AI API

&#x20;   │

&#x20;   ▼

Embedding Service

&#x20;   │

&#x20;   ▼

Query Embedding

&#x20;   │

&#x20;   ▼

Semantic Retrieval

&#x20;   │

&#x20;   ▼

Relevant Products

&#x20;   │

&#x20;   ▼

Frontend

```



Potential AI capabilities include:



\* Semantic product search

\* Product similarity

\* Personalized recommendations

\* AI-assisted product discovery



\---



\## 9. Database Architecture



MongoDB is used as the primary application database.



```text

Application

&#x20;    │

&#x20;    ▼

&#x20;Mongoose

&#x20;    │

&#x20;    ▼

&#x20;MongoDB

```



Mongoose provides:



\* Schema definitions

\* Data validation

\* Database interaction

\* Query abstraction



\---



\## 10. Error Handling



The backend uses centralized response and error-handling patterns.



Successful responses follow:



```json

{

&#x20; "success": true,

&#x20; "message": "Operation successful",

&#x20; "data": {}

}

```



Errors follow:



```json

{

&#x20; "success": false,

&#x20; "message": "Error description"

}

```



This provides a predictable API contract for the frontend.



\---



\## 11. Security Architecture



Security-related middleware and practices include:



\* JWT authentication

\* Role-based authorization

\* Helmet

\* CORS configuration

\* Environment variables

\* Protected routes

\* Input validation

\* Secure API response handling



Sensitive configuration values are kept outside source code using environment variables.



\---



\## 12. DevOps Architecture



The project includes containerization and continuous integration.



```text

Developer

&#x20;   │

&#x20;   ▼

&#x20;  Git

&#x20;   │

&#x20;   ▼

&#x20;GitHub Repository

&#x20;   │

&#x20;   ▼

GitHub Actions

&#x20;   │

&#x20;   ├── Install dependencies

&#x20;   ├── Run checks

&#x20;   └── Run tests

&#x20;   │

&#x20;   ▼

&#x20;Docker

&#x20;   │

&#x20;   ▼

Application Containers

```



This provides a foundation for future automated deployment.



\---



\## 13. Design Principles



The project follows several software engineering principles.



\### Separation of Concerns



Routes, controllers, models, services, middleware, and AI functionality are separated into dedicated modules.



\### Modularity



Individual components can be modified or replaced without affecting unrelated parts of the system.



\### Scalability



Pagination, caching, modular services, and containerization provide a foundation for scaling the application.



\### Maintainability



Consistent folder structure and API response formats make the project easier to understand and maintain.



\### Extensibility



The AI architecture allows future integration with:



\* Vector databases

\* Recommendation systems

\* Advanced search

\* Personalized ranking

\* Generative AI services



\---



\## 14. Future Architecture



The planned production architecture can evolve toward:



```text

&#x20;                        ┌────────────────┐

&#x20;                        │ React Frontend │

&#x20;                        └───────┬────────┘

&#x20;                                │

&#x20;                                ▼

&#x20;                        ┌────────────────┐

&#x20;                        │ API Gateway    │

&#x20;                        └───────┬────────┘

&#x20;                                │

&#x20;             ┌──────────────────┼──────────────────┐

&#x20;             │                  │                  │

&#x20;             ▼                  ▼                  ▼

&#x20;      ┌─────────────┐    ┌─────────────┐    ┌─────────────┐

&#x20;      │ Auth        │    │ Product     │    │ AI/Search   │

&#x20;      │ Service     │    │ Service     │    │ Service     │

&#x20;      └──────┬──────┘    └──────┬──────┘    └──────┬──────┘

&#x20;             │                  │                  │

&#x20;             ▼                  ▼                  ▼

&#x20;          MongoDB             Redis             Vector DB

```



This architecture can support increased traffic, independent service scaling, and more advanced AI capabilities.



