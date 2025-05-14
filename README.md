# Taskify - Todo App

A beautiful, modern todo application with a React frontend, FastAPI backend, and PostgreSQL database.


# steps to deploy helmchart in kubernetes
1. helm dependency update react-fastapi-todos-chart/
2. helm install todos ./react-fastapi-todos-chart --set auth.postgresPassword=postgres
3. helm upgrade todos ./react-fastapi-todos-chart --set auth.postgresPassword=postgres
4. kubectl port-forward svc/todos-react-frontend-chart-service 3000:80
5. kubectl port-forward svc/todos-fastapi-backend-chart-service 30002:8000
6. Check application on http://localhost:3000/

## Features

- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Filter tasks by status (all, active, completed)
- Clean, responsive UI that works on all devices
- Data persistence with PostgreSQL

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Python FastAPI
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Python 3.8+ (for local development)

### Running with Docker

The easiest way to run the application is using Docker Compose:

```bash
# Start all services
docker-compose up

# Access the application at http://localhost:3000
```

This will start:
- PostgreSQL database on port 5432
- FastAPI backend on port 8000
- React frontend on port 3000

### Development Setup

#### Backend (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up PostgreSQL (locally or using Docker):
   ```bash
   # Using Docker
   docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=todos -p 5432:5432 postgres:15
   ```

5. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

#### Frontend (React)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

Once the backend is running, you can access the auto-generated API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
├── backend/                 # FastAPI backend
│   ├── __init__.py
│   ├── database.py          # Database connection
│   ├── main.py              # Main FastAPI application
│   ├── models.py            # SQLAlchemy models
│   ├── requirements.txt     # Python dependencies
│   └── schemas.py           # Pydantic schemas
├── src/                     # React frontend
│   ├── components/          # React components
│   ├── context/             # React context providers
│   ├── services/            # API service functions
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main App component
│   └── main.tsx             # Application entry point
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile.backend       # Backend Docker configuration
└── Dockerfile.frontend      # Frontend Docker configuration
```
