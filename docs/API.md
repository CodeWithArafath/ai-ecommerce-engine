# API Documentation

## Authentication

### Register User

POST /api/auth/register

Body:

{
"name":"User",
"email":"user@test.com",
"password":"123456"
}


### Login

POST /api/auth/login

Returns JWT token.


## Products


GET /api/products

Fetch products with:

- search
- category
- pagination
- sorting


POST /api/products

Create product (JWT required)


PUT /api/products/:id

Update product


DELETE /api/products/:id

Delete product

