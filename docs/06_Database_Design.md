# FlowPilot AI

# 06 - Database Design Specification (DDS)

**Version:** 1.0.0
**Status:** Draft
**Author:** Satyam Diwaker
**Last Updated:** June 30, 2026

---

# 1. Purpose

This document defines the complete data architecture for FlowPilot AI Version 1.

It includes:

* Relational database schema
* Entity relationships
* Object storage references
* Vector database integration
* Indexing strategy
* Data lifecycle
* Retention policies

---

# 2. Database Technologies

| Component        | Technology                                   |
| ---------------- | -------------------------------------------- |
| Primary Database | PostgreSQL                                   |
| Cache            | Redis                                        |
| Vector Database  | Qdrant                                       |
| Object Storage   | MinIO (Development) / Amazon S3 (Production) |

---

# 3. Data Architecture

```
                PostgreSQL
                     │
      ┌──────────────┼───────────────┐
      │              │               │
      ▼              ▼               ▼
   Users      Conversations     Files
      │              │               │
      │              ▼               ▼
      │          Messages      File Metadata
      │
      ▼
 Memories
      │
      ▼
 Tool Executions

──────────────

Qdrant

Embeddings

Document Chunks

──────────────

MinIO / S3

Uploaded Files

Generated Reports

Exports
```

---

# 4. Core Entities

Version 1 includes the following entities:

* Users
* Sessions
* Conversations
* Messages
* Uploaded Files
* Memories
* Tool Executions
* Audit Logs

---

# 5. Users Table

Purpose

Stores registered users.

Fields

* id (UUID)
* full_name
* email
* password_hash
* role
* is_verified
* is_active
* created_at
* updated_at

Indexes

* email (unique)

---

# 6. Sessions Table

Purpose

Stores active login sessions.

Fields

* id
* user_id
* refresh_token
* expires_at
* created_at

Relationship

Many sessions belong to one user.

---

# 7. Conversations Table

Purpose

Stores chat sessions.

Fields

* id
* user_id
* title
* status
* created_at
* updated_at

Relationship

One user can own many conversations.

---

# 8. Messages Table

Purpose

Stores every message exchanged.

Fields

* id
* conversation_id
* sender_type
* message_type
* content
* token_usage
* created_at

Relationship

Many messages belong to one conversation.

---

# 9. Uploaded Files Table

Purpose

Stores uploaded file metadata.

Fields

* id
* user_id
* conversation_id
* original_filename
* storage_key
* mime_type
* file_size
* upload_status
* created_at

Actual file contents remain in object storage.

---

# 10. Memories Table

Purpose

Stores long-term memory.

Fields

* id
* user_id
* memory_type
* summary
* embedding_id
* importance_score
* created_at

Memory Types

* Preference
* Fact
* Workflow
* Conversation Summary

---

# 11. Tool Executions Table

Purpose

Stores execution history.

Fields

* id
* conversation_id
* tool_name
* status
* execution_time_ms
* started_at
* completed_at
* error_message

---

# 12. Audit Logs Table

Purpose

Stores security and administrative events.

Fields

* id
* user_id
* action
* resource
* ip_address
* timestamp

Audit logs are immutable.

---

# 13. Entity Relationships

```
Users

│

├──── Sessions

├──── Conversations

│        │

│        ├──── Messages

│        │

│        ├──── Uploaded Files

│        │

│        └──── Tool Executions

│

└──── Memories
```

---

# 14. Qdrant Collections

Version 1 requires the following collections:

### document_chunks

Stores embeddings for uploaded documents.

---

### memories

Stores semantic memories.

---

### conversation_context

Stores summarized historical conversations.

---

# 15. Object Storage Layout

```
users/

    user-id/

        uploads/

        exports/

        generated/

```

Naming convention

```
UUID.ext
```

Original filenames are stored only in PostgreSQL.

---

# 16. Redis Keys

Examples

```
session:user_id

conversation:id

rate_limit:user_id

tool_cache:id

temporary_context:id
```

Redis stores temporary data only.

---

# 17. Index Strategy

Indexes

Users

* Email

Messages

* Conversation ID

Files

* User ID

Memories

* User ID

Tool Executions

* Conversation ID

Composite indexes may be introduced based on production query analysis.

---

# 18. Data Lifecycle

User

↓

Conversation

↓

Messages

↓

Tool Execution

↓

Memory Generation

↓

Document Indexing

↓

Long-Term Storage

---

# 19. File Processing Lifecycle

Upload

↓

Validation

↓

Object Storage

↓

Metadata Storage

↓

Chunking

↓

Embedding Generation

↓

Vector Storage

↓

Ready for Search

---

# 20. Memory Lifecycle

Conversation

↓

Summary

↓

Importance Scoring

↓

Embedding Generation

↓

Long-Term Storage

↓

Semantic Retrieval

---

# 21. Deletion Policy

User deletes conversation

↓

Messages removed

↓

Associated embeddings removed

↓

File references removed

↓

Object storage cleaned

↓

Audit event recorded

---

# 22. Backup Strategy

PostgreSQL

Daily backup

Redis

No backup required

Qdrant

Scheduled snapshot

Object Storage

Versioning enabled

---

# 23. Retention Policy

Conversation History

Unlimited (Version 1)

Audit Logs

Minimum one year

Temporary Cache

Automatic expiration

Uploads

Until user deletion

---

# 24. Performance Targets

Database queries

<100 ms average

Conversation loading

<300 ms

File metadata retrieval

<150 ms

Vector retrieval

<500 ms

---

# 25. Security

Database requirements

* Encryption in transit
* Password hashing
* UUID identifiers
* Prepared statements
* Parameterized queries
* Least privilege access

No secrets shall be stored inside application tables.

---

# 26. Future Schema Extensions

Version 2

* Organizations
* Teams
* Roles
* Billing
* API Keys
* Shared Knowledge Bases

Version 3

* Workflow Templates
* Marketplace
* AI Agents
* Scheduled Jobs
* Notifications
* Analytics

---

# 27. Definition of Done

The database design is complete when:

* All relational entities are implemented.
* Relationships enforce referential integrity.
* Object storage references function correctly.
* Embeddings are stored in Qdrant.
* Redis caching is operational.
* Migrations are version controlled.
* Backup and recovery procedures are documented.
