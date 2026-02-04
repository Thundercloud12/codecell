# Clerk Authentication Dependencies

## Required npm Packages

Install these Clerk packages:

```bash
pnpm add @clerk/nextjs svix
```

### Package Details:

1. **@clerk/nextjs** - Main Clerk SDK for Next.js
   - Provides ClerkProvider, useUser, UserButton, etc.
   - Middleware support for protected routes
   - Server-side authentication helpers

2. **svix** - Webhook signature verification
   - Used in webhook route to verify Clerk webhook requests
   - Ensures webhook authenticity

## Installation Command

```bash
cd frontend
pnpm add @clerk/nextjs svix
```

## Environment Variables Required

After installing, add these to `.env.local`:

```env
# Get these from https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...

# Clerk URLs (already configured in code)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## Setup Steps After Installation

1. **Install packages** (command above)

2. **Create Clerk account** at https://clerk.com

3. **Create new application** in Clerk dashboard

4. **Copy API keys** to `.env.local`

5. **Set up webhook**:
   - Go to Webhooks in Clerk Dashboard
   - Add endpoint: `https://yourdomain.com/api/webhooks/clerk`
   - Subscribe to: `user.created`, `user.updated`, `user.deleted`
   - Copy signing secret to `.env.local`

6. **Run database migration**:

   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

7. **Start dev server**:
   ```bash
   pnpm dev
   ```

## Testing Webhooks Locally

For local development, use Clerk CLI to forward webhooks:

```bash
# Install Clerk CLI globally
npm install -g @clerk/clerk-cli

# Forward webhooks to local server
clerk listen --webhook-url http://localhost:3000/api/webhooks/clerk
```

## Assigning User Roles

Set roles in Clerk Dashboard:

1. Go to Users
2. Select a user
3. Click Metadata → Public
4. Add: `{ "role": "ADMIN" }` (or "CITIZEN" or "WORKER")

## Current Package Versions

```json
{
  "@clerk/nextjs": "^6.10.0",
  "svix": "^1.40.0"
}
```

Check for latest versions at:

- https://www.npmjs.com/package/@clerk/nextjs
- https://www.npmjs.com/package/svix
