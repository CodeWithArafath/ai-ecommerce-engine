# \# API Documentation

# 

# \## AI E-Commerce Engine API

# 

# Base URL:

# 

# ```text

# http://localhost:5000/api

# ```

# 

# \---

# 

# \## 1. Authentication API

# 

# \### Register User

# 

# \*\*Endpoint\*\*

# 

# ```http

# POST /auth/register

# ```

# 

# \*\*Request Body\*\*

# 

# ```json

# {

# &#x20; "name": "Arafath",

# &#x20; "email": "arafath@example.com",

# &#x20; "password": "your\_password"

# }

# ```

# 

# \*\*Response\*\*

# 

# ```json

# {

# &#x20; "success": true,

# &#x20; "message": "User registered successfully",

# &#x20; "data": {

# &#x20;   "user": {}

# &#x20; }

# }

# ```

# 

# \---

# 

# \### Login User

# 

# \*\*Endpoint\*\*

# 

# ```http

# POST /auth/login

# ```

# 

# \*\*Request Body\*\*

# 

# ```json

# {

# &#x20; "email": "arafath@example.com",

# &#x20; "password": "your\_password"

# }

# ```

# 

# \*\*Response\*\*

# 

# ```json

# {

# &#x20; "success": true,

# &#x20; "message": "Login successful",

# &#x20; "data": {

# &#x20;   "user": {},

# &#x20;   "token": "<JWT\_TOKEN>"

# &#x20; }

# }

# ```

# 

# The returned JWT token should be included when accessing protected endpoints.

# 

# \---

# 

# \## 2. Product API

# 

# \### Get Products

# 

# \*\*Endpoint\*\*

# 

# ```http

# GET /products

# ```

# 

# Returns a paginated list of products.

# 

# \### Query Parameters

# 

# | Parameter  | Description                 | Example       |

# | ---------- | --------------------------- | ------------- |

# | `page`     | Page number                 | `1`           |

# | `limit`    | Number of products per page | `10`          |

# | `category` | Filter by category          | `Electronics` |

# | `brand`    | Filter by brand             | `Samsung`     |

# | `sort`     | Sorting option              | `price`       |

# 

# \*\*Example\*\*

# 

# ```http

# GET /products?page=1\&limit=10

# ```

# 

# \---

# 

# \### Get Single Product

# 

# \*\*Endpoint\*\*

# 

# ```http

# GET /products/:id

# ```

# 

# Example:

# 

# ```http

# GET /products/PRODUCT\_ID

# ```

# 

# \*\*Success Response\*\*

# 

# ```json

# {

# &#x20; "success": true,

# &#x20; "message": "Product fetched successfully",

# &#x20; "data": {

# &#x20;   "product": {}

# &#x20; }

# }

# ```

# 

# \*\*Product Not Found\*\*

# 

# ```json

# {

# &#x20; "success": false,

# &#x20; "message": "Product not found"

# }

# ```

# 

# \---

# 

# \### Create Product

# 

# \*\*Endpoint\*\*

# 

# ```http

# POST /products

# ```

# 

# Requires appropriate authentication/authorization.

# 

# \*\*Request Body\*\*

# 

# ```json

# {

# &#x20; "name": "Samsung Smartphone",

# &#x20; "description": "High quality smartphone",

# &#x20; "category": "Mobiles",

# &#x20; "brand": "Samsung",

# &#x20; "price": 29999,

# &#x20; "stock": 50,

# &#x20; "images": \[

# &#x20;   "https://example.com/product.jpg"

# &#x20; ]

# }

# ```

# 

# \---

# 

# \### Update Product

# 

# \*\*Endpoint\*\*

# 

# ```http

# PUT /products/:id

# ```

# 

# Example:

# 

# ```http

# PUT /products/PRODUCT\_ID

# ```

# 

# \*\*Request Body\*\*

# 

# ```json

# {

# &#x20; "price": 27999,

# &#x20; "stock": 40

# }

# ```

# 

# \---

# 

# \### Delete Product

# 

# \*\*Endpoint\*\*

# 

# ```http

# DELETE /products/:id

# ```

# 

# Example:

# 

# ```http

# DELETE /products/PRODUCT\_ID

# ```

# 

# Requires appropriate authentication/authorization.

# 

# \---

# 

# \## 3. Health API

# 

# \### Health Check

# 

# \*\*Endpoint\*\*

# 

# ```http

# GET /health

# ```

# 

# Used to verify that the backend service is running.

# 

# Example:

# 

# ```json

# {

# &#x20; "success": true

# }

# ```

# 

# \---

# 

# \## 4. AI API

# 

# AI-related functionality is organized under the AI API routes.

# 

# \### AI Endpoint

# 

# ```http

# /api/ai

# ```

# 

# AI functionality is designed to support future features such as:

# 

# \* Semantic product search

# \* Product embeddings

# \* Product similarity

# \* AI-powered recommendations

# \* Personalized product discovery

# 

# Refer to the implementation in:

# 

# ```text

# server/src/ai/

# server/src/routes/aiRoutes.js

# ```

# 

# \---

# 

# \## 5. Authentication Header

# 

# Protected endpoints use JWT authentication.

# 

# Include the token in the request header:

# 

# ```http

# Authorization: Bearer <JWT\_TOKEN>

# ```

# 

# Example using cURL:

# 

# ```bash

# curl -H "Authorization: Bearer YOUR\_TOKEN" \\

# http://localhost:5000/api/products

# ```

# 

# \---

# 

# \## 6. API Response Format

# 

# The API follows a consistent response structure.

# 

# \### Successful Response

# 

# ```json

# {

# &#x20; "success": true,

# &#x20; "message": "Operation successful",

# &#x20; "data": {}

# }

# ```

# 

# \### Error Response

# 

# ```json

# {

# &#x20; "success": false,

# &#x20; "message": "Error description"

# }

# ```

# 

# This standardized format makes API responses easier to consume from the frontend.

# 

# \---

# 

# \## 7. Pagination Response

# 

# Product listing responses include pagination metadata.

# 

# Example:

# 

# ```json

# {

# &#x20; "success": true,

# &#x20; "message": "Products fetched successfully",

# &#x20; "data": {

# &#x20;   "products": \[],

# &#x20;   "pagination": {

# &#x20;     "page": 1,

# &#x20;     "limit": 10,

# &#x20;     "total": 10000,

# &#x20;     "totalPages": 1000,

# &#x20;     "hasNextPage": true,

# &#x20;     "hasPreviousPage": false

# &#x20;   }

# &#x20; }

# }

# ```

# 

# \---

# 

# \## 8. HTTP Status Codes

# 

# | Status Code | Meaning               |

# | ----------- | --------------------- |

# | `200`       | Request successful    |

# | `201`       | Resource created      |

# | `400`       | Bad request           |

# | `401`       | Unauthorized          |

# | `403`       | Forbidden             |

# | `404`       | Resource not found    |

# | `500`       | Internal server error |

# 

# \---

# 

# \## 9. Development Testing

# 

# The API can be tested using:

# 

# \* Postman

# \* PowerShell `Invoke-RestMethod`

# \* cURL

# \* Browser for GET endpoints

# 

# Example:

# 

# ```powershell

# Invoke-RestMethod "http://localhost:5000/api/products?page=1\&limit=10"

# ```

# 

# \---

# 

# \## 10. Related Source Files

# 

# Backend API implementation is organized as follows:

# 

# ```text

# server/src/

# ├── controllers/

# ├── middleware/

# ├── models/

# ├── routes/

# ├── services/

# ├── ai/

# ├── cache/

# └── utils/

# ```

# 

# This separation keeps routing, business logic, data models, middleware, and services modular and maintainable.



