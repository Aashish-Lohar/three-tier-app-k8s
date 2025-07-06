# Taskify - Todo App

A beautiful, modern todo application with a React frontend, FastAPI backend, and PostgreSQL database.
helllo

# steps to deploy helmchart in kubernetes
1. **Install Istio:**
   ```bash
   curl -L https://istio.io/downloadIstio | sh -
   cd istio-1.26.1
   export PATH=$PWD/bin:$PATH
   ```

2. **Install Istio with the demo profile (no gateways):**
   ```bash
   istioctl install -f samples/bookinfo/demo-profile-no-gateways.yaml -y
   ```

3. **Enable Istio sidecar injection for the default namespace:**
   ```bash
   kubectl label namespace default istio-injection=enabled
   ```

4. **Install Gateway API CRDs if not already present:**
   ```bash
   kubectl get crd gateways.gateway.networking.k8s.io &> /dev/null || \
   { kubectl kustomize "github.com/kubernetes-sigs/gateway-api/config/crd?ref=v1.3.0" | kubectl apply -f -; }
   ```

5. **Update Helm chart dependencies:**
   ```bash
   helm dependency update react-fastapi-todos-chart/
   ```

6. **Install the Helm chart:**
   ```bash
   helm install todos ./react-fastapi-todos-chart
   ```

7. **(Optional) Upgrade the Helm release if needed:**
   ```bash
   helm upgrade todos ./react-fastapi-todos-chart
   ```

8. **Annotate the Istio gateway service:**
   ```bash
   kubectl annotate gateway todos-istio-gateway networking.istio.io/service-type=ClusterIP --namespace=default
   ```

9. **Port-forward the Istio gateway service:**
   ```bash
   kubectl port-forward svc/todos-istio-gateway-istio 8080:80
   ```

10. **Access the application:**  
    Open [http://localhost:8080/](http://localhost:8080/) in your browser.

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
