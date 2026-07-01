# FlowPilot AI

# 09 - API Specification (OpenAPI First)

**Version:** 1.0.0
**Status:** Draft
**Author:** Satyam Diwaker
**Last Updated:** June 30, 2026

---

# 1. Purpose

This document defines the REST API contract for FlowPilot AI Version 1.

The API follows:

* REST principles
* JSON payloads
* JWT authentication
* OpenAPI compatibility
* Versioned endpoints

Base URL

```
/api/v1
```

---

# 2. Authentication

Authentication Method

```
Bearer JWT
```

Header

```
Authorization: Bearer <access_token>
```

Public Endpoints

* Login
* Register
* Refresh Token
* Health Check

All remaining endpoints require authentication.

---

# 3. Standard Response Format

Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Failure

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# 4. Health

## GET

```
/health
```

Purpose

Health check.

Response

```
200 OK
```

---

# 5. Authentication APIs

## POST

```
/auth/register
```

Creates a new user.

---

## POST

```
/auth/login
```

Authenticates user.

Returns

* Access Token
* Refresh Token

---

## POST

```
/auth/refresh
```

Issues new access token.

---

## POST

```
/auth/logout
```

Invalidates refresh token.

---

## GET

```
/auth/me
```

Returns authenticated user profile.

---

# 6. User APIs

## GET

```
/users/profile
```

Retrieve current profile.

---

## PATCH

```
/users/profile
```

Update profile.

---

## DELETE

```
/users/profile
```

Delete account.

---

# 7. Conversation APIs

## GET

```
/conversations
```

Returns paginated conversation list.

---

## POST

```
/conversations
```

Creates conversation.

---

## GET

```
/conversations/{id}
```

Returns conversation details.

---

## PATCH

```
/conversations/{id}
```

Rename conversation.

---

## DELETE

```
/conversations/{id}
```

Delete conversation.

---

# 8. Message APIs

## GET

```
/conversations/{id}/messages
```

Retrieve message history.

---

## POST

```
/conversations/{id}/messages
```

Submit new user message.

Supports:

* General chat
* Tool execution
* AI planning

Response

Streaming.

---

# 9. Chat Streaming

Endpoint

```
POST /chat/stream
```

Response

Server Sent Events (SSE)

Events

* planner_started
* tool_selected
* tool_started
* tool_completed
* model_generating
* response_chunk
* completed
* error

---

# 10. File APIs

## POST

```
/files/upload
```

Multipart upload.

Supported

* PDF
* DOCX
* TXT
* CSV
* XLSX
* PNG
* JPG

---

## GET

```
/files
```

List uploads.

---

## GET

```
/files/{id}
```

Retrieve metadata.

---

## DELETE

```
/files/{id}
```

Delete upload.

---

# 11. Document APIs

## POST

```
/documents/index
```

Generate embeddings.

---

## POST

```
/documents/search
```

Semantic search.

---

## POST

```
/documents/summary
```

Generate summary.

---

## POST

```
/documents/question
```

Question answering.

---

# 12. Memory APIs

## GET

```
/memory
```

Retrieve stored memories.

---

## POST

```
/memory/search
```

Semantic memory retrieval.

---

## DELETE

```
/memory/{id}
```

Delete memory.

---

# 13. Tool APIs

## GET

```
/tools
```

Returns installed tools.

---

## GET

```
/tools/{tool_name}
```

Returns metadata.

---

## POST

```
/tools/{tool_name}/execute
```

Execute tool manually.

Administrator only.

---

# 14. Dashboard APIs

## GET

```
/dashboard
```

Returns

* Usage
* Recent Conversations
* Uploaded Files
* Tool Statistics

---

# 15. Search APIs

## POST

```
/search
```

Global semantic search.

Searches

* Conversations
* Files
* Memories

---

# 16. Export APIs

## POST

```
/export/chat
```

Export conversation.

Formats

* PDF
* Markdown
* TXT

---

## POST

```
/export/document
```

Export processed document.

---

# 17. Admin APIs

Protected.

Administrator only.

Endpoints

```
GET /admin/users

GET /admin/tools

GET /admin/logs

GET /admin/metrics

GET /admin/health
```

---

# 18. Pagination

Standard Query Parameters

```
page

page_size

sort

order
```

Response

```json
{
  "page": 1,
  "page_size": 20,
  "total": 120
}
```

---

# 19. Error Codes

| Status | Meaning               |
| ------ | --------------------- |
| 200    | Success               |
| 201    | Created               |
| 204    | Deleted               |
| 400    | Bad Request           |
| 401    | Unauthorized          |
| 403    | Forbidden             |
| 404    | Not Found             |
| 409    | Conflict              |
| 413    | Payload Too Large     |
| 422    | Validation Error      |
| 429    | Rate Limited          |
| 500    | Internal Server Error |

---

# 20. Rate Limits

Anonymous

```
30 requests/hour
```

Authenticated

```
300 requests/hour
```

Future

Tier-based limits.

---

# 21. Versioning

Current

```
/api/v1
```

Future

```
/api/v2
```

Breaking changes require new API versions.

---

# 22. OpenAPI Requirements

Every endpoint must define:

* Summary
* Description
* Request Schema
* Response Schema
* Tags
* Security
* Error Responses
* Example Payloads

Swagger documentation must be generated automatically.

---

# 23. Security

Every protected endpoint shall:

* Validate JWT.
* Verify ownership.
* Log access.
* Sanitize inputs.
* Enforce authorization.

Uploads require:

* MIME validation
* Size validation
* Malware scanning (future)

---

# 24. Streaming Specification

Streaming endpoint shall emit structured events.

Example sequence:

```
planner_started

↓

tool_selected

↓

tool_started

↓

tool_completed

↓

llm_started

↓

response_chunk

↓

response_chunk

↓

response_chunk

↓

completed
```

Clients must gracefully handle interruptions.

---

# 25. Future API Extensions

Version 2

* Organizations
* Teams
* Billing
* API Keys
* Notifications

Version 3

* Workflow Builder
* Agent Marketplace
* Scheduled Jobs
* Third-Party Integrations
* Multi-Agent APIs

---

# 26. Definition of Done

The API specification is complete when:

* Every endpoint is documented.
* Request and response contracts are defined.
* Authentication is specified.
* Streaming behavior is documented.
* Pagination is standardized.
* Error responses are consistent.
* OpenAPI documentation can be generated automatically.
