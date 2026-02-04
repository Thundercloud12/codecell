# Role-Based Sign-Up System

## Overview

This system allows users to select their role (ADMIN, CITIZEN, or WORKER) after signing up. Users are then created in the database with the selected role.

## How It Works

### 1. Sign-Up Flow

1. User visits `/sign-up` and creates an account with Clerk
2. After successful sign-up, user is redirected to `/auth/check-role`
3. User selects their role (ADMIN, CITIZEN, or WORKER)
4. Role is saved to Clerk metadata and database user is created
5. User is redirected to their role-specific dashboard

### 2. Sign-In Flow

1. User visits `/sign-in` and enters credentials
2. After successful sign-in:
   - If user already has a role → redirected to role dashboard
   - If user doesn't have a role → redirected to `/auth/check-role`

## API Endpoints

### POST /api/auth/set-role

**Purpose:** Set user role and create database entry

**Request:**

```json
{
  "role": "ADMIN" | "CITIZEN" | "WORKER",
  "userId": "clerk_user_id"
}
```

**Response:**

```json
{
  "success": true,
  "role": "CITIZEN",
  "userId": "database_user_id"
}
```

**What it does:**

1. Updates Clerk user's `publicMetadata.role`
2. Creates/updates user in database with selected role
3. If role is WORKER, creates Worker profile automatically
4. Worker gets auto-generated employee ID like `EMP-1738000000-ABC12`

### GET /api/auth/check-user

**Purpose:** Check if user exists in database

**Response:**

```json
{
  "success": true,
  "exists": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CITIZEN",
    "hasWorkerProfile": false
  }
}
```

## Database Integration

### User Creation Flow

1. **Clerk Sign-Up** → User created in Clerk
2. **Role Selection** → `/api/auth/set-role` called
3. **Database Creation:**

   ```sql
   INSERT INTO User (clerk_user_id, email, name, role)
   VALUES ('clerk_xxx', 'user@example.com', 'John Doe', 'CITIZEN')
   ```

4. **Worker Profile (if WORKER role):**
   ```sql
   INSERT INTO Worker (userId, name, email, employeeId, isActive)
   VALUES (user_id, 'John Doe', 'user@example.com', 'EMP-xxx', true)
   ```

### Schema

```prisma
model User {
  id             String   @id @default(cuid())
  clerk_user_id  String?  @unique
  email          String   @unique
  name           String?
  role           Role     @default(CITIZEN)
  worker         Worker?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model Worker {
  id         String   @id @default(cuid())
  userId     String?  @unique
  user       User?    @relation(fields: [userId], references: [id])
  employeeId String   @unique
  name       String
  email      String
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

enum Role {
  ADMIN
  CITIZEN
  WORKER
}
```

## Role Descriptions

### 🔵 CITIZEN

- **Purpose:** Report potholes in their area
- **Access:** Citizen dashboard, report submission, view own reports
- **Database:** Creates User record only
- **Redirect:** `/citizen`

### 🟠 WORKER

- **Purpose:** Repair potholes and manage work assignments
- **Access:** Worker dashboard, task management, location updates
- **Database:** Creates User + Worker records
- **Redirect:** `/worker`
- **Special:** Auto-generates `employeeId`

### 🟣 ADMIN

- **Purpose:** Manage system, workers, and approve repairs
- **Access:** Full system access, analytics, worker management
- **Database:** Creates User record only
- **Redirect:** `/admin`

## Testing the Flow

1. **Start the development server:**

   ```bash
   cd frontend
   pnpm dev
   ```

2. **Sign up a new user:**
   - Go to http://localhost:3000/sign-up
   - Create account with email/password
   - You'll be redirected to role selection page

3. **Select a role:**
   - Choose CITIZEN, WORKER, or ADMIN
   - Click "Continue with [Role]"
   - You'll be redirected to your dashboard

4. **Verify in database:**
   ```bash
   pnpm prisma studio
   ```

   - Check `User` table for your new user
   - If you selected WORKER, check `Worker` table too

## Troubleshooting

### Users not created in database

**Problem:** Users sign up but don't appear in database

**Solutions:**

1. **Check Prisma connection:**

   ```bash
   cd frontend
   pnpm prisma studio
   ```

   If Prisma Studio doesn't open, check your `DATABASE_URL` in `.env`

2. **Check role selection:**
   - Make sure you complete the role selection step
   - Check browser console for API errors

3. **Check API logs:**
   - Look for `[SET-ROLE]` logs in terminal
   - Should see: "Setting role CITIZEN for user clerk_xxx"

### Role selection page not showing

**Problem:** After sign-up, redirected to dashboard instead of role selection

**Solutions:**

1. **Check redirect URL:**
   - Sign-up page should have `fallbackRedirectUrl="/auth/check-role"`
   - Sign-in page should have `fallbackRedirectUrl="/"`

2. **Check if user already has role:**
   - Existing users with roles skip role selection
   - To reset: delete user from database and Clerk dashboard

### Worker profile not created

**Problem:** Selected WORKER role but no Worker record in database

**Solutions:**

1. **Check database logs:**
   - Look for `[SET-ROLE] Worker profile created` in terminal
   - If error, check `userId` field in Worker table

2. **Manually verify:**
   ```bash
   pnpm prisma studio
   ```

   - Check if Worker record exists with matching `userId`

## Environment Variables Required

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
CLERK_WEBHOOK_SIGNING_SECRET=whsec_xxx

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

## Security Notes

- ✅ Role is stored in Clerk's `publicMetadata` (user-visible but clerk-managed)
- ✅ Backend validates role on every request
- ✅ Middleware enforces role-based access to routes
- ⚠️ **Backend API routes still have NO AUTH** (as requested by user)
- 🔒 Future: Add authentication checks to API routes

## Next Steps

1. **Install dependencies:** `pnpm add @clerk/nextjs svix`
2. **Run migrations:** `pnpm prisma generate && pnpm prisma migrate dev`
3. **Set up Clerk webhook** (optional but recommended)
4. **Add authentication to backend APIs** (when ready)
5. **Test the complete flow** with all three roles
