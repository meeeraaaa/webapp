Setup Instructions
Prerequisites
Ensure you have the following installed:

Node.js
PostgreSQL
Prisma CLI
Python 3 and pip for data processing scripts
1. Clone the Repository
bash
Copy code
git clone <repository-url>
2. Set Up Environment Variables
In webapp/backend, create a .env file with your PostgreSQL credentials:

plaintext
Copy code
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
3. Install Dependencies
Navigate to each folder and install dependencies:

bash
Copy code
# Backend
cd webapp/backend
npm install

# Frontend
cd ../frontend
npm install
4. Set Up the Database
From the backend directory, initialize and migrate the database:

bash
Copy code
npx prisma migrate dev --name init
npx prisma db seed  # Optional: Seed data
5. Run the Servers
bash
Copy code
# Backend
cd webapp/backend
npm run dev

# Frontend
cd ../frontend
npm start
The app will be accessible at http://localhost:3000, and the API will be at http://localhost:5000.
