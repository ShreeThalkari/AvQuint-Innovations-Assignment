# Task Manager App

A full-stack task manager built with a React + Vite frontend and an Express + TypeScript backend. The backend uses MongoDB through Mongoose and JWT-based authentication.

## Project Structure

```text
.
├── backend/    # Express API, MongoDB models, auth, task routes
└── frontend/   # React app built with Vite
```

## Prerequisites

Install these before setting up the project:

- Node.js 20 or newer
- npm
- MongoDB, either a local MongoDB server or a MongoDB Atlas connection string

## Backend Setup

1. Go to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task-manager
JWT_SECRET=replace-with-a-secure-secret
BASE_URL=http://localhost:5173
```

Use your MongoDB Atlas URI instead of the local `MONGO_URI` if you are using Atlas.

4. Start the backend development server:

```bash
npm run dev
```

The API will run at:

```text
http://localhost:5000
```

## Frontend Setup

1. Open a new terminal and go to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Optional: create a `.env` file in the `frontend` folder if your backend URL is different from the default:

```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:

```bash
npm run dev
```

The app will run at:

```text
http://localhost:5173
```

## Running the Project

Run both servers at the same time in separate terminals:

```bash
# Terminal 1
cd backend
npm run dev
```

```bash
# Terminal 2
cd frontend
npm run dev
```

Then open:

```text
http://localhost:5173
```

## Available Scripts

Backend scripts:

```bash
npm run dev      # Start the backend in development mode
npm run build    # Compile TypeScript to dist/
npm start        # Run the compiled backend from dist/
```

Frontend scripts:

```bash
npm run dev      # Start the Vite development server
npm run build    # Build the frontend for production
```

## Notes

- Make sure MongoDB is running before starting the backend.
- `BASE_URL` in `backend/.env` should match the frontend origin for CORS.
- `VITE_API_URL` should point to the backend API base URL and include `/api`.
- If you can you can directly go to the deployed website: https://avquint-innovations-assignment-1.onrender.com
