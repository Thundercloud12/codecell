# Clerk Authentication Setup

This project uses Clerk for authentication with role-based access control.

## Roles

- **ADMIN**: Full system access (admin portal)
- **CITIZEN**: Can report potholes and track submissions (citizen portal)
- **WORKER**: Field workers who repair potholes (worker portal)

## Setup Steps

### 1. Create Clerk Account
1. Go to https://clerk.com/ and sign up
2. Create a new application
3. Copy your API keys to `.env.local`

### 2. Configure Webhook
1. In Clerk Dashboard, go to Webhooks
2. Create a new endpoint: `https://yourdomain.com/api/webhooks/clerk`
3. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
4. Copy the signing secret to `.env.local` as `CLERK_WEBHOOK_SIGNING_SECRET`

### 3. Set User Roles
To assign roles to users, set the role in public metadata:

#### Option A: Clerk Dashboard
1. Go to Users in Clerk Dashboard
2. Select a user
3. Go to Metadata → Public
4. Add: `{ "role": "ADMIN" }` (or "CITIZEN" or "WORKER")

#### Option B: Programmatically (using Clerk API)
```javascript
await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: {
    role: "ADMIN" // or "CITIZEN" or "WORKER"
  }
});
```

## Role-Based Routing

The middleware automatically redirects users based on their role:

- ADMIN users → `/admin`
- CITIZEN users → `/citizen`
- WORKER users → `/worker`

## Worker Profile Linking

When a user signs up with role "WORKER", the webhook automatically:
1. Creates a User record
2. Creates a linked Worker profile
3. Generates a unique employee ID

## Testing Locally

For local development with webhooks:

1. Install Clerk CLI:
```bash
npm install -g @clerk/clerk-cli
```

2. Forward webhooks:
```bash
clerk listen --webhook-url http://localhost:3000/api/webhooks/clerk
```

## Environment Variables

```env
# Clerk Keys (from Dashboard → API Keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## Default User Roles

If no role is set in metadata, users default to **CITIZEN**.

## Migration

After setting up Clerk, run database migrations to add the new fields:

```bash
pnpm db:migrate
```

This adds:
- `clerk_user_id` to User table
- `userId` to Worker table (links Worker to User)
- `WORKER` to Role enum
