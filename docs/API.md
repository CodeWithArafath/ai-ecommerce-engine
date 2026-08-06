# API Documentation

## Authentication

### Register User
POST /api/auth/register

Body:
{
 "name":"User",
 "email":"user@test.com",
 "password":"password",
 "role":"admin"
}


### Login
POST /api/auth/login

Returns JWT token.


## Products

### Get Products
GET /api/products

Supports:
- Search
- Category filter
- Pagination
- Sorting


### Create Product
POST /api/products

Authorization:
Bearer JWT Token


### Update Product
PUT /api/products/:id


### Delete Product
DELETE /api/products/:id


## Response Format

{
 "success":true,
 "message":"message",
 "data":{}
}
