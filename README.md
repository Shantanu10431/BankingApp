# SBI-Style Banking Web Application

An enterprise-grade banking web application built with microservices architecture, featuring real-world fintech system design principles.

## Architecture Overview

This application follows a modular microservices-based backend with separate services for:

1. **Auth Service** - User authentication and authorization
2. **User Service** - User profile and dashboard management
3. **Transaction Service** - Deposit, withdrawal, and transfer operations
4. **Admin Service** - Administrative functions and user management
5. **Audit Logging Service** - Comprehensive audit trail

## Tech Stack

### Frontend
- React.js 19
- React Router DOM
- Axios
- Bootstrap 5 + React-Bootstrap
- Lucide React Icons
- Vite Build Tool

### Backend
- Node.js
- Express.js
- PostgreSQL (Aiven hosted)
- Prisma ORM
- JWT Authentication
- bcrypt
- Helmet (security headers)
- Express Rate Limit
- CORS
- Zod (input validation)

## Project Structure

```
banking-system/
├── prisma/
│   └── schema.prisma       # Database schema
├── server/
│   ├── config/
│   │   └── database.js     # Database configuration
│   ├── middleware/
│   │   ├── auth.js         # JWT authentication
│   │   ├── validation.js   # Input validation
│   │   ├── rateLimiter.js  # Rate limiting
│   │   └── auditLogger.js  # Audit logging
│   ├── services/
│   │   ├── auth/           # Auth microservice
│   │   ├── user/           # User microservice
│   │   ├── transaction/    # Transaction microservice
│   │   ├── admin/          # Admin microservice
│   │   └── audit/          # Audit microservice
│   └── server.js           # Main server entry
├── src/
│   ├── components/
│   │   ├── Auth/           # Login, Register
│   │   ├── Dashboard/      # User dashboard
│   │   ├── Transactions/   # Deposit, Withdraw, Transfer
│   │   ├── Profile/        # User profile
│   │   ├── Admin/          # Admin panels
│   │   └── Layout/         # Layout components
│   ├── context/
│   │   └── AuthContext.jsx # Authentication context
│   ├── services/
│   │   └── api.js          # API service layer
│   └── App.tsx             # Main app component
└── .env                    # Environment variables
```

## Database Schema

### User Model
- id (UUID)
- name (string)
- email (unique)
- password (hashed)
- accountNumber (unique, 12-digit)
- ifscCode (default: SBIN0001234)
- balance (decimal)
- role (USER/ADMIN)
- isFrozen (boolean)
- createdAt, updatedAt

### Transaction Model
- id (UUID)
- amount (decimal)
- type (CREDIT/DEBIT)
- senderId (foreign key)
- receiverId (foreign key)
- referenceId (unique)
- status (SUCCESS/FAILED)
- createdAt

### AuditLog Model
- id (UUID)
- userId (foreign key)
- action (string)
- metadata (JSON)
- ipAddress (string)
- createdAt

## Core Business Rules

1. **Registration**: Auto-generates unique 12-digit account number
2. **Authentication**: JWT-based with role-based access control
3. **Deposit**: Adds amount, creates CREDIT transaction record
4. **Withdraw**: Checks sufficient balance, creates DEBIT record
5. **Transfer**: ACID-compliant transaction with rollback capability
6. **Admin**: Full user management, freeze/unfreeze, audit logs

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT authentication with expiry
- Rate limiting on login (5 attempts per 15 minutes)
- Helmet security headers
- CORS configuration
- Input validation with Zod
- SQL injection prevention via Prisma
- XSS protection
- Account freezing capability

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database (Aiven or local)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
The `.env` file is already configured with the PostgreSQL connection string.

3. **Run database migrations:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. **Start the backend server:**
```bash
node server/server.js
```

5. **Start the frontend development server:**
```bash
npm run dev
```

### Production Build

1. **Build the frontend:**
```bash
npm run build
```

2. **Start production server:**
```bash
NODE_ENV=production node server/server.js
```

## API Endpoints

### Auth Routes (`/api/auth`)
- POST `/register` - User registration
- POST `/login` - User login
- GET `/profile` - Get user profile

### User Routes (`/api/user`)
- GET `/dashboard` - Get dashboard data
- GET `/transactions` - Get user transactions

### Transaction Routes (`/api/transaction`)
- POST `/deposit` - Deposit funds
- POST `/withdraw` - Withdraw funds
- POST `/transfer` - Transfer funds

### Admin Routes (`/api/admin`)
- GET `/users` - Get all users
- PATCH `/users/:userId/freeze` - Freeze/unfreeze account
- DELETE `/users/:userId` - Delete user
- GET `/stats` - Get system statistics
- GET `/audit-logs` - Get audit logs

### Audit Routes (`/api/audit`)
- GET `/my-logs` - Get user's audit logs

## Default Admin Account

To create an admin account, manually update a user's role in the database:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

## Features

### User Features
- ✅ User registration with auto-generated account number
- ✅ Secure login with JWT
- ✅ View account balance and details
- ✅ Deposit funds
- ✅ Withdraw funds with balance check
- ✅ Transfer funds to other accounts
- ✅ Transaction history with pagination
- ✅ Profile management

### Admin Features
- ✅ View all users
- ✅ Freeze/unfreeze user accounts
- ✅ Delete user accounts
- ✅ View system statistics
- ✅ View bank liquidity
- ✅ View audit logs
- ✅ Search and filter users

## Security Considerations

- All financial operations use Prisma transactions for ACID compliance
- Account numbers are 12-digit unique identifiers
- IFSC code defaults to SBIN0001234 (SBI style)
- Rate limiting prevents brute force attacks
- All sensitive operations are logged
- Accounts can be frozen to prevent unauthorized access

## License

This project is for educational purposes only.