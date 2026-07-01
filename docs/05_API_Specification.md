# FlowPilot AI

# 05 - System Architecture Specification

**Version:** 1.0.0
**Status:** Draft
**Author:** Satyam Diwaker
**Last Updated:** June 30, 2026

---

# 1. Purpose

This document defines the complete software architecture for FlowPilot AI Version 1.

It specifies:

* Repository structure
* Application architecture
* Service boundaries
* Module organization
* Communication flow
* Deployment architecture
* Scalability strategy

This document serves as the implementation blueprint for all developers.

---

# 2. Architectural Goals

The architecture must satisfy the following goals:

* Modular
* Scalable
* Maintainable
* Cloud Native
* Docker First
* AI Provider Agnostic
* Easy to Extend
* Production Ready

---

# 3. Architectural Style

FlowPilot AI follows a **Modular Monolith** architecture for Version 1.

Reasons:

* Faster MVP development.
* Lower operational complexity.
* Easier debugging.
* Single deployment unit.
* Straightforward Docker deployment.

Future versions may evolve into microservices if scaling requirements justify the added complexity.

---

# 4. High-Level System Architecture

```
                   Browser
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
 React Frontend              Static Assets
        │
        ▼
      Nginx
        │
        ▼
    FastAPI Backend
        │
        ├───────────────┐
        │               │
        ▼               ▼
   Authentication    AI Agent Engine
        │               │
        │        ┌──────┴───────┐
        │        │              │
        ▼        ▼              ▼
 PostgreSQL  Tool Registry   Memory Manager
        │        │              │
        │        ▼              ▼
        │    Tool SDK      Qdrant Vector DB
        │        │
        │        ▼
        │  File Processing
        │
        ▼
      Redis

Object Storage
     │
     ▼
 MinIO (Dev)
 AWS S3 (Prod)
```

---

# 5. Repository Structure

```
flowpilot-ai/

├── frontend/
│
├── backend/
│
├── infrastructure/
│
├── docker/
│
├── docs/
│
├── scripts/
│
├── .github/
│
├── docker-compose.yml
│
├── Makefile
│
├── README.md
│
└── LICENSE
```

---

# 6. Frontend Architecture

```
frontend/

src/

components/

pages/

layouts/

hooks/

services/

contexts/

types/

utils/

assets/

styles/

routes/
```

Responsibilities:

* UI Rendering
* API Communication
* Authentication State
* File Upload
* Chat Interface
* Dashboard
* Settings

---

# 7. Backend Architecture

```
backend/

app/

api/

agent/

tools/

auth/

database/

models/

schemas/

repositories/

services/

memory/

storage/

config/

middleware/

core/

utils/

logs/

tests/

main.py
```

Responsibilities:

* REST APIs
* AI Agent
* Authentication
* Business Logic
* Tool Execution
* Database Access

---

# 8. API Layer

The API layer exposes all HTTP endpoints.

Responsibilities:

* Request validation
* Authentication
* Response serialization
* Error handling
* Rate limiting

No business logic shall reside in API controllers.

---

# 9. Service Layer

The Service Layer contains application business logic.

Responsibilities:

* User management
* Conversation management
* File management
* Tool execution orchestration
* Memory updates

Services communicate with repositories but never directly with HTTP requests.

---

# 10. Repository Layer

Responsibilities:

* Database queries
* CRUD operations
* Transactions

Repositories isolate SQL from business logic.

---

# 11. AI Agent Layer

Modules:

```
agent/

planner/

context_builder/

tool_router/

executor/

validator/

response_composer/

state/

prompts/
```

Responsibilities:

* Planning
* Tool Routing
* Workflow Execution
* State Management
* Prompt Management

---

# 12. Tool SDK

Folder Structure

```
tools/

base/

pdf/

ocr/

summary/

email/

registry/

shared/
```

Each tool implements the standard Tool interface.

The Tool Registry discovers and registers tools during startup.

---

# 13. Memory Layer

Components:

```
memory/

conversation/

long_term/

retrieval/

embeddings/
```

Responsibilities:

* Store memories
* Retrieve relevant memories
* Update preferences
* Manage embeddings

---

# 14. File Processing Layer

Responsibilities:

* Upload
* Validation
* Parsing
* Metadata extraction
* Storage

Supported formats:

* PDF
* DOCX
* TXT
* CSV
* XLSX
* PNG
* JPG

---

# 15. Database Layer

Primary Database:

PostgreSQL

Primary entities:

* Users
* Sessions
* Conversations
* Messages
* UploadedFiles
* Memories
* ToolExecutions

Database migrations use Alembic.

---

# 16. Vector Search Layer

Technology:

Qdrant

Responsibilities:

* Embedding storage
* Semantic retrieval
* Document indexing

---

# 17. Cache Layer

Technology:

Redis

Responsibilities:

* Session cache
* API cache
* Temporary workflow state
* Rate limiting

---

# 18. Storage Layer

Development:

MinIO

Production:

Amazon S3

Responsibilities:

* Store uploaded files
* Store generated exports
* Store processed artifacts

---

# 19. Configuration Management

Environment variables shall be used for all runtime configuration.

Examples:

* Database URL
* Redis URL
* Qdrant URL
* Storage credentials
* AI provider keys
* JWT secret
* Logging configuration

No secrets shall be committed to version control.

---

# 20. Logging Architecture

Logs shall be categorized into:

* Application Logs
* API Logs
* Agent Logs
* Tool Logs
* Database Logs
* Security Logs

Each request receives a unique Request ID for traceability.

---

# 21. Error Handling Strategy

Errors shall be standardized.

Categories:

* Validation Error
* Authentication Error
* Authorization Error
* Tool Failure
* AI Provider Failure
* Database Failure
* Internal Server Error

Clients always receive a consistent JSON response structure.

---

# 22. Security Architecture

Security measures include:

* JWT Authentication
* Password hashing
* HTTPS
* Input validation
* CORS
* File type validation
* File size limits
* SQL injection protection
* XSS mitigation

---

# 23. Docker Architecture

Containers:

* frontend
* backend
* postgres
* redis
* qdrant
* minio
* nginx

All services communicate over a private Docker network.

Persistent data is stored using Docker volumes.

---

# 24. Deployment Architecture

Development:

```
Developer
     │
Docker Compose
     │
Entire Stack
```

Production:

```
Internet
     │
CloudFront (Future)
     │
Load Balancer
     │
Nginx
     │
Backend
     │
───────────────────────
│ PostgreSQL (RDS)
│ Redis
│ Qdrant
│ S3
───────────────────────
```

---

# 25. CI/CD Architecture

Git Workflow:

```
feature/*
      │
Pull Request
      │
Automated Tests
      │
Docker Build
      │
Main Branch
      │
Deployment
```

Pipeline stages:

* Linting
* Unit Tests
* Integration Tests
* Docker Image Build
* Security Scan
* Deployment

---

# 26. Scalability Strategy

The architecture supports:

* Horizontal backend scaling
* Independent AI workers
* Stateless API servers
* External storage
* External cache
* External vector database

No redesign should be required to support additional tools or AI providers.

---

# 27. Coding Standards

Mandatory principles:

* SOLID
* DRY
* Separation of Concerns
* Dependency Injection
* Type Safety
* Explicit Interfaces

Business logic must never be embedded in API controllers.

---

# 28. Extensibility

Future additions should require only:

1. New Tool implementation.
2. Tool registration.
3. Prompt configuration.

Core planner logic should remain unchanged.

---

# 29. Risks

Potential architectural risks:

* AI provider dependency
* Large file processing latency
* Vector database growth
* Storage costs
* Long-running tool execution

These risks shall be mitigated through monitoring, caching, retries, and modular infrastructure.

---

# 30. Definition of Done

The architecture is considered implemented when:

* Repository structure is established.
* Backend modules are separated by responsibility.
* Frontend follows defined structure.
* Tool SDK supports plug-in style extensions.
* Docker Compose starts the complete platform.
* The application is deployable on AWS without architectural modification.
* All implementation aligns with this specification.
