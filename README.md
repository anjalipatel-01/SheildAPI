# 🛡️ Shield-API

> **A high-octane, security-focused Backend API for safely storing and accessing sensitive resources.**

![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

---

## 📖 Overview

**Shield-API** provides robust infrastructure for storing highly sensitive data. Built with a paranoid focus on security, it allows data to be accessed safely through **JWT-based Authentication** for standard users or via our proprietary machine-to-machine **'Shield Key' System** for external services.

---

## 🔥 Key Technical Features

### 🔐 Authentication & Security
- **JWT Authentication:** Secure, stateful, and short-lived tokens for active application users.
- **Role-Based Access Control (RBAC):** Granular `USER` and `ADMIN` permissions to enforce the principle of least privilege across all endpoints.

### 🔑 The Shield Key System
- **Machine-to-Machine Ready:** Automatically generates high-entropy API keys for secure script and service integration.
- **Zero-Knowledge Storage:** Keys are aggressively hashed using `bcrypt` before storage. Even in the event of a database compromise, all active Shield Keys remain fully protected.

### 🚀 Performance & Protection
- **Distributed Rate Limiting:** Global rate limiting is backed by **Redis** to effectively mitigate Distributed Denial of Service (DDoS) attacks and brute-force attempts.
- **Maximized Uptime:** Optimized caching layers dramatically reduce database workload and latency.

### 🛡️ Data Integrity
- **Strict Payload Validation:** Every incoming request is strictly parsed and validated natively via **Zod**, instantly dropping malformed data.
- **Leak-Proof Error Handling:** A global error interceptor intercepts exceptions and returns sanitized responses, guaranteeing that internal stack-traces and architecture details are never leaked to the client.

### 📋 Accountability
- **Immutable Audit Logging:** Tracks, timestamps, and securely logs all sensitive administrative actions (such as data overrides and purges) to ensure complete accountability.

---

## 🏗️ Architecture Diagram Description

**Request Flow:** `Client ➔ Limiters ➔ Auth ➔ Validation ➔ Controller ➔ Database`

```text
[ External Script ]           [ User / Frontend ]
               |                             |
               v                             v
      +-----------------------------------------------+
      |             Distributed Rate Limiter          | <--- Redis
      +-----------------------------------------------+
               |                             |
      +-----------------------+     +-----------------------+
      |    Shield Key Auth    |     |       JWT Auth        |
      |   (Bcrypt Compare)    |     |   (Token Verify)      |
      +-----------------------+     +-----------------------+
               |                             |
      +-----------------------------------------------+
      |           Zod Payload Validation              |
      +-----------------------------------------------+
               |                             |
      +-----------------------------------------------+
      |             Business Logic / CRUD             |
      +-----------------------------------------------+
               |                             |
      +-----------------------+     +-----------------------+
      |  PostgreSQL Database  | <-> |   Audit Log System    |
      +-----------------------+     +-----------------------+
```

1. **Rate Limiter (Redis):** Every incoming request is evaluated against IP or Token-based buckets within Redis.
2. **Authentication Layer:** Validates either an active JWT or a matching hashed **Shield Key** header. Identifies and assigns User/Admin roles.
3. **Payload Sanitization (Zod):** Validates the data shape and meticulously strips out any unexpected fields.
4. **Controller:** Executes core business logic and processes the authorized request.
5. **Database (Prisma/PostgreSQL):** Safely interacts with encrypted storage and automatically registers the action in the Immutable Audit Log.

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v18+ recommended)
- **PostgreSQL Database**
- **Redis Server**

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd shield-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://user:password@localhost:5432/shield_db"
   REDIS_URL="redis://localhost:6379"
   JWT_SECRET="your_super_secret_jwt_string"
   ```

4. **Initialize the Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   # Optional: Seed the database according to your setup in prisma/seed.js
   npm run prisma:seed 
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

---

## 📡 API Reference

### Public Endpoints
- `POST /api/v1/auth/login` - Authenticate and receive a JWT.
- `POST /api/v1/auth/register` - Create a new standard user account.

### User Endpoints *(Requires JWT)*
- `GET /api/v1/resources` - Fetch owned sensitive resources.
- `POST /api/v1/resources` - Store a new secure resource.
- `GET /api/v1/resources/shield-key` - Access resource via an active Shield Key. *(Alternatively, requires `x-shield-key: <key>` header)*

### Admin Endpoints *(Requires Admin JWT)*
- `GET /api/v1/admin/logs` - View the immutable Audit Log.
- `DELETE /api/v1/admin/purge/:resourceId` - Force-purge specific resources from the system.

---

## 🔒 Security Implementation Details

### Why Hash API Keys?
Our **Shield Key** system generates unique, high-entropy strings for external machines and scripts to interact securely with the API. Rather than storing these strings in plain text—where a single database dump could compromise every connected service—we immediately hash them using `bcrypt`. If the database is ever breached, attackers receive nothing but unusable hashes, perfectly insulating all external integrations.

### Why Redis for Rate Limiting?
Standard in-memory rate limiters (like the default Express rate limiters) break down entirely in horizontally scaled environments. By leveraging **Redis**, our rate-limiter is completely distributed. If we deploy 10 instances of `Shield-API` behind a load balancer, Redis acts as a synchronized, ultra-fast source of truth. It instantly detects and blocks abusive IPs or anomalous traffic bursts across all active nodes simultaneously, guaranteeing infrastructure safety.
