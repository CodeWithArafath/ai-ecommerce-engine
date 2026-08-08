\# Development Setup Guide



\## AI E-Commerce Engine



This guide explains how to install, configure, run, seed, test, and troubleshoot the AI E-Commerce Engine locally.



\---



\## 1. Prerequisites



Install the following software before starting:



| Software | Recommended               |

| -------- | ------------------------- |

| Node.js  | 18+                       |

| npm      | Latest compatible version |

| MongoDB  | Local or MongoDB Atlas    |

| Redis    | Local or hosted           |

| Git      | Latest                    |

| Docker   | Optional                  |



Verify Node.js and npm:



```bash

node --version

npm --version

```



Verify Git:



```bash

git --version

```



\---



\## 2. Clone the Repository



```bash

git clone https://github.com/CodeWithArafath/ai-ecommerce-engine.git

cd ai-ecommerce-engine

```



\---



\## 3. Backend Setup



Navigate to the server:



```bash

cd server

```



Install dependencies:



```bash

npm install

```



\---



\## 4. Environment Configuration



Create a `.env` file inside the `server` directory.



```text

server/

├── .env

├── package.json

└── src/

```



Use `.env.example` as the reference for the required variables.



Example:



```env

PORT=5000



MONGODB\_URI=your\_mongodb\_connection\_string



REDIS\_URL=your\_redis\_connection\_string



JWT\_SECRET=your\_jwt\_secret

```



\### Security



Never commit your `.env` file to GitHub.



Do not place:



\* API keys

\* Database passwords

\* JWT secrets

\* Private tokens



directly in source code.



\---



\## 5. MongoDB Setup



The application uses MongoDB as its primary database.



You can use either:



\### Option A — MongoDB Local



Install MongoDB locally and ensure the MongoDB service is running.



Example connection string:



```text

mongodb://127.0.0.1:27017/ai-ecommerce

```



\### Option B — MongoDB Atlas



Create a MongoDB Atlas cluster and use the connection string provided by Atlas.



Example:



```text

mongodb+srv://<username>:<password>@<cluster>/<database>

```



Place the connection string in:



```env

MONGODB\_URI=your\_connection\_string

```



\---



\## 6. Seed Product Data



The project includes a product generator for development and API testing.



From the `server` directory:



```bash

node src/seed/seedProducts.js

```



The script generates a large product dataset.



\### Important



The seed script clears the existing product collection before inserting the generated products.



Therefore, do not run it against a production database unless you intentionally want to reset the products.



\---



\## 7. Redis Setup



Redis is used as the caching layer.



\### Local Redis



Start your Redis server using the appropriate command for your operating system.



The application should then be configured with:



```env

REDIS\_URL=your\_redis\_connection\_string

```



\### Hosted Redis



A hosted Redis provider can also be used.



Place its connection URL in the environment configuration.



\---



\## 8. Start the Backend



From:



```text

ai-ecommerce-engine/server

```



run:



```bash

npm run dev

```



The development server runs on:



```text

http://localhost:5000

```



\---



\## 9. Frontend Setup



Open a second terminal.



Navigate to:



```bash

cd client

```



Install dependencies:



```bash

npm install

```



Start the development server:



```bash

npm run dev

```



Vite will display the frontend development URL in the terminal.



\---



\## 10. Running Both Applications



You should have two terminals running.



\### Terminal 1 — Backend



```bash

cd server

npm run dev

```



\### Terminal 2 — Frontend



```bash

cd client

npm run dev

```



The frontend communicates with the backend REST API.



\---



\## 11. API Verification



After starting the backend, test the API.



\### Health Check



```powershell

Invoke-RestMethod "http://localhost:5000/api/health"

```



\### Product API



```powershell

Invoke-RestMethod "http://localhost:5000/api/products"

```



\### Pagination



```powershell

Invoke-RestMethod "http://localhost:5000/api/products?page=1\&limit=10"

```



\---



\## 12. Authentication Testing



Register a test user:



```http

POST /api/auth/register

```



Example request:



```json

{

&#x20; "name": "Test User",

&#x20; "email": "test@example.com",

&#x20; "password": "password123"

}

```



Then login:



```http

POST /api/auth/login

```



The login response returns a JWT token.



Use the token for protected requests:



```http

Authorization: Bearer <JWT\_TOKEN>

```



\---



\## 13. Testing



The repository contains a dedicated testing structure.



Before committing changes, run the test commands defined in the project's package files.



Typical workflow:



```bash

npm test

```



If the project defines separate frontend and backend test scripts, run them from their respective directories.



\---



\## 14. Docker Setup



Docker can be used to run the application in a containerized environment.



Build the containers:



```bash

docker compose build

```



Start the application:



```bash

docker compose up

```



Or build and start in one command:



```bash

docker compose up --build

```



Stop the containers:



```bash

docker compose down

```



\---



\## 15. GitHub Actions



The repository includes a GitHub Actions workflow.



The workflow is located under:



```text

.github/workflows/

```



The CI pipeline helps automate project checks whenever changes are pushed to GitHub.



\---



\## 16. Common Problems



\### Backend does not start



Check:



```bash

node --version

npm --version

```



Then reinstall dependencies:



```bash

rm -rf node\_modules

npm install

```



On Windows PowerShell, you can remove the directory with:



```powershell

Remove-Item -Recurse -Force node\_modules

npm install

```



\---



\### MongoDB connection error



Check:



1\. `MONGODB\_URI` exists in `.env`

2\. MongoDB is running

3\. MongoDB Atlas network access is configured

4\. Username and password are correct

5\. The connection string is valid



\---



\### Redis connection error



Check:



1\. Redis is running

2\. `REDIS\_URL` is correct

3\. The Redis service is reachable



\---



\### Port 5000 already in use



Find the process using port 5000:



```powershell

Get-NetTCPConnection -LocalPort 5000

```



You can then stop the conflicting process or change the application's port.



\---



\### Products are not returned



Check whether the database contains products.



If the development database is intentionally empty, run:



```bash

node src/seed/seedProducts.js

```



Then restart the backend and test:



```powershell

Invoke-RestMethod "http://localhost:5000/api/products"

```



\---



\## 17. Recommended Development Workflow



A typical development cycle is:



```text

1\. Pull latest changes

&#x20;       ↓

2\. Create feature branch

&#x20;       ↓

3\. Implement feature

&#x20;       ↓

4\. Run application

&#x20;       ↓

5\. Test API/frontend

&#x20;       ↓

6\. Run automated tests

&#x20;       ↓

7\. Review changes

&#x20;       ↓

8\. Commit changes

&#x20;       ↓

9\. Push branch

&#x20;       ↓

10\. Open Pull Request

```



\---



\## 18. Useful Commands



\### Backend



```bash

cd server

npm install

npm run dev

```



\### Frontend



```bash

cd client

npm install

npm run dev

```



\### Seed database



```bash

cd server

node src/seed/seedProducts.js

```



\### Git status



```bash

git status

```



\### View recent commits



```bash

git log --oneline -10

```



\### Docker



```bash

docker compose up --build

```



\---



\## 19. Production Considerations



Before production deployment, the following should be completed:



\* Secure production environment variables

\* Production MongoDB configuration

\* Production Redis configuration

\* Strong JWT secret

\* HTTPS

\* Rate limiting

\* Request validation

\* Production logging

\* Monitoring

\* Database backups

\* CI/CD deployment pipeline

\* Production frontend configuration



\---



\## 20. Documentation



Additional documentation:



\* \[Project README](../README.md)

\* \[API Documentation](./API.md)

\* \[System Architecture](./ARCHITECTURE.md)



\---



\## 21. Support



For project issues, check:



1\. The GitHub repository

2\. Existing documentation

3\. Application logs

4\. API responses

5\. GitHub Issues



\---



\## 22. Project Repository



GitHub:



https://github.com/CodeWithArafath/ai-ecommerce-engine



