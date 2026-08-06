# Demo


## Application Flow


1. User opens React application

2. User logs in using JWT authentication

3. Dashboard loads protected data

4. Admin manages products

5. AI module provides search/recommendation capability



## Sample Login Response


{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "JWT_TOKEN"
  }
}



## Sample Product Response


{
 "success":true,
 "data":{
   "products":[
     {
       "name":"Smartphone",
       "category":"Electronics"
     }
   ]
 }
}


