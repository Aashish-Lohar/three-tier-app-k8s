# Taskify - Todo App testing for PR check

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

   ---

   ## Logging and Monitoring

   To enable logging and monitoring for your application in Kubernetes, follow these steps:

   ### 1. Create a Monitoring Namespace

   ```bash
   kubectl create namespace monitoring
   ```

   ### 2. Install Loki for Logging

   ```bash
   helm repo add grafana https://grafana.github.io/helm-charts
   helm repo update
   helm upgrade --install loki --namespace monitoring grafana/loki-stack
   ```

   ### 3. Install Prometheus and Kube-Prometheus-Stack for Monitoring

   ```bash
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   helm repo update
   helm install monitoring prometheus-community/kube-prometheus-stack --namespace monitoring
   ```

   - **Default Grafana credentials:**  
      - Username: `admin`  
      - Password: `prom-operator` (or check the secret with `kubectl get secret --namespace monitoring monitoring-grafana -o jsonpath="{.data.admin-password}" | base64 --decode`)

   - **Port-forward Grafana to access the dashboard:**
      ```bash
      kubectl port-forward --namespace monitoring service/monitoring-grafana 3000:80
      ```
      Access Grafana at [http://localhost:3000/](http://localhost:3000/) and log in with the credentials above.

   - **Add Loki as a data source in Grafana:**  
      In Grafana, navigate to **Configuration > Data Sources > Add data source**, select **Loki**, and use the default URL (`http://loki:3100`).
      
      Visualize logs in Grafana
         Use the Explore tab in Grafana.
         Query: {app="fastapi-backend"}

   - **Import the "Kubernetes Logs" dashboard:**  
      Go to **Dashboards > Import**, and enter dashboard ID **18007**.

   - **Access Prometheus and Alertmanager dashboards:**  
      Port-forward as needed:
      ```bash
      kubectl port-forward --namespace monitoring service/monitoring-kube-prometheus-prometheus 9090:9090
      kubectl port-forward --namespace monitoring service/monitoring-kube-prometheus-alertmanager 9093:9093
      ```
      - Prometheus: [http://localhost:9090/](http://localhost:9090/)
      - Alertmanager: [http://localhost:9093/](http://localhost:9093/)

   - Grafana comes with several pre-built dashboards. You can also create custom dashboards using PromQL queries.

   ## Setting Up Alerts and Slack Notifications

   To receive alerts for important metrics and get notified in Slack, follow these steps:

   ### 1. Create a Slack Channel and Webhook

   - Create a dedicated Slack channel (e.g., `#all-prometheus-alerts`) for receiving alerts.
   - Add an **Incoming WebHook** to your Slack channel:
      1. Go to [Slack Incoming WebHooks](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks).
      2. Add the app to your workspace and select your channel.
      3. Copy the generated **Webhook URL** (you'll need this for Alertmanager).

   ### 2. Define Custom Alert Rules

   - Create a file named `custom_alert_rules.yaml` with your Prometheus alert rules. Example:

      ```yaml
      apiVersion: monitoring.coreos.com/v1
      kind: PrometheusRule
      metadata:
         name: main-rules
         namespace: monitoring
         labels:
            app: kube-prometheus-stack
            release: monitoring
      spec:
         groups:
            - name: main.rules
               rules:
                  - alert: HostHighCpuLoad
                     expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) > 10
                     for: 2m
                     labels:
                        severity: warning
                        namespace: monitoring
                     annotations:
                        summary: "Host CPU load high"
                        description: |
                           The CPU load on host {{ $labels.instance }} has exceeded 10% for more than 2 minutes.
                           Current value: {{ $value }}%
                           Namespace: {{ $labels.namespace }}
                           Severity: {{ $labels.severity }}
                  - alert: KubernetesPodCrashLooping
                     expr: kube_pod_container_status_restarts_total > 5
                     for: 0m
                     labels:
                        severity: critical
                        namespace: monitoring
                     annotations:
                        summary: "Kubernetes pod crash looping"
                        description: "Pod {{ $labels.pod }} is crash looping\nValue = {{ $value }}"
                  - alert: MemoryRunningOut
                     expr: (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 < 10
                     for: 5m
                     labels:
                        severity: warning
                        namespace: monitoring
                     annotations:
                        summary: "Memory running out on node"
                        description: "Memory running out on node\nAvailable Memory = {{ humanize $value }}\nTotal Memory = {{ humanize $labels.total_memory }}"
                  - alert: PodsUsingHighMemory
                     expr: sum(kube_pod_container_resource_requests_memory_bytes) / sum(node_memory_MemTotal_bytes) * 100 > 80
                     for: 5m
                     labels:
                        severity: warning
                        namespace: monitoring
                     annotations:
                        summary: "Pods using high memory"
                        description: "Pods using high memory\nPercentage of Total Memory Used by Pods = {{ humanize $value }}"
      ```

   - Apply the alert rules:
      ```bash
      kubectl apply -f custom_alert_rules.yaml
      ```

   ### 3. Store the Slack Webhook URL as a Secret

   - Create a Kubernetes secret with your Slack webhook URL. Example (`alert_manager_config.yaml`):

      ```yaml
      apiVersion: v1
      kind: Secret
      metadata:
         name: slack-webhook-url
         namespace: monitoring
      stringData:
         apiurl: "<YOUR_SLACK_WEBHOOK_URL>"
      ```

   - Apply the secret:
      ```bash
      kubectl apply -f alert_manager_config.yaml
      ```

   ### 4. Configure Alertmanager to Send Alerts to Slack

   - Add an `AlertmanagerConfig` resource to route alerts to Slack:

      ```yaml
      ---
      apiVersion: monitoring.coreos.com/v1alpha1
      kind: AlertmanagerConfig
      metadata:
         name: main-rules-alert-config
         namespace: monitoring
      spec:
         route:
            receiver: 'slack-notifications'
            repeatInterval: 30m
            groupWait: 30s
            groupInterval: 5m
            routes:
               - matchers:
                     - name: alertname
                        value: HostHighCpuLoad
                  repeatInterval: 10m
               - matchers:
                     - name: alertname
                        value: KubernetesPodCrashLooping
                  repeatInterval: 10m
               - matchers:
                     - name: alertname
                        value: MemoryRunningOut
                  repeatInterval: 15m
               - matchers:
                     - name: alertname
                        value: PodsUsingHighMemory
                  repeatInterval: 15m
         receivers:
            - name: 'slack-notifications'
               slackConfigs:
                  - apiURL:
                        key: apiurl
                        name: slack-webhook-url
                     channel: '#all-prometheus-alerts'
                     sendResolved: true
      ```

   - Apply the Alertmanager configuration:
      ```bash
      kubectl apply -f alert_manager_config.yaml
      ```

   ### 5. Verify Alerts

   - Trigger a test alert or wait for a real alert to occur.
   - Check your Slack channel for notifications.

   ---

   By following these steps, you will receive real-time alerts in Slack for critical metrics and issues in your Kubernetes cluster.

   These tools provide centralized logging and monitoring for your Kubernetes workloads, making it easier to observe application health and troubleshoot issues.

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
