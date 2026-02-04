# 🚀 Quick Start Guide - Pothole Repair Backend

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- pnpm (or npm/yarn)

---

## Setup Steps

### 1. Install Dependencies

```bash
cd frontend
pnpm install
```

### 2. Configure Database

Create `.env` file in `frontend/` directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/pothole_repair_db"
```

Replace with your actual PostgreSQL credentials.

### 3. Generate Prisma Client

```bash
pnpm db:generate
```

This generates the Prisma client from your schema.

### 4. Run Database Migrations

```bash
pnpm db:migrate
```

This creates all tables in your database.

### 5. Seed Test Data (Optional)

```bash
pnpm db:seed
```

This creates:

- 3 test workers
- 1 admin user

### 6. Start Development Server

```bash
pnpm dev
```

Server runs at: `http://localhost:3000`

---

## Verify Installation

### Check Prisma Studio

```bash
pnpm db:studio
```

This opens a GUI at `http://localhost:5555` to view your database.

### Test API Endpoint

```bash
curl http://localhost:3000/api/workers
```

Should return list of workers (if seeded).

---

## Complete Workflow Test

### 1. Create a Worker (if not seeded)

```bash
curl -X POST http://localhost:3000/api/workers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Worker",
    "email": "worker@test.com",
    "phone": "+1234567890",
    "employeeId": "EMP-TEST-001"
  }'
```

Save the worker ID from the response.

### 2. Create Detection & Pothole

First, you need a detection from your ML model. Assuming you have one:

```bash
curl -X POST http://localhost:3000/api/potholes \
  -H "Content-Type: application/json" \
  -d '{
    "detectionId": "YOUR_DETECTION_ID",
    "latitude": 19.0760,
    "longitude": 72.8777,
    "imageUrl": "https://example.com/pothole.jpg"
  }'
```

Save the pothole ID.

### 3. Fetch Road Context

```bash
curl -X POST http://localhost:3000/api/road-info/{POTHOLE_ID}
```

### 4. Calculate Ranking

```bash
curl -X POST http://localhost:3000/api/rank/{POTHOLE_ID}
```

### 5. Create Ticket

```bash
curl -X POST http://localhost:3000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "potholeId": "POTHOLE_ID"
  }'
```

Save the ticket ID.

### 6. Assign to Worker

```bash
curl -X POST http://localhost:3000/api/tickets/{TICKET_ID}/assign \
  -H "Content-Type: application/json" \
  -d '{
    "workerId": "WORKER_ID"
  }'
```

### 7. Update Worker Location

```bash
curl -X POST http://localhost:3000/api/workers/{WORKER_ID}/location \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 19.0750,
    "longitude": 72.8770
  }'
```

### 8. Start Job (Generate Route)

```bash
curl -X POST http://localhost:3000/api/workers/{WORKER_ID}/start-job \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": "TICKET_ID"
  }'
```

You should receive route data with distance, duration, and polyline!

### 9. Upload Proof

```bash
curl -X POST http://localhost:3000/api/tickets/{TICKET_ID}/proof \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrls": ["https://example.com/after1.jpg"],
    "notes": "Repair completed successfully"
  }'
```

### 10. Admin Review

```bash
curl -X POST http://localhost:3000/api/admin/review/{TICKET_ID} \
  -H "Content-Type: application/json" \
  -d '{
    "action": "APPROVE",
    "reviewedBy": "admin-id",
    "reviewNotes": "Work approved"
  }'
```

---

## Available Scripts

| Script             | Description                          |
| ------------------ | ------------------------------------ |
| `pnpm dev`         | Start development server             |
| `pnpm build`       | Build for production                 |
| `pnpm start`       | Start production server              |
| `pnpm db:generate` | Generate Prisma client               |
| `pnpm db:migrate`  | Run database migrations              |
| `pnpm db:seed`     | Seed test data                       |
| `pnpm db:studio`   | Open Prisma Studio GUI               |
| `pnpm db:reset`    | Reset database (⚠️ deletes all data) |

---

## API Documentation

See [BACKEND_API_DOCS.md](../BACKEND_API_DOCS.md) for:

- Complete API reference
- Request/response formats
- Service layer architecture
- Error handling
- Production deployment guide

---

## Project Structure

```
frontend/
├── app/
│   └── api/                    # API Routes
│       ├── potholes/           # Pothole management
│       ├── road-info/[id]/     # Road context
│       ├── rank/[id]/          # Severity ranking
│       ├── tickets/            # Ticket lifecycle
│       │   └── [id]/
│       │       ├── status/     # Status updates
│       │       ├── assign/     # Worker assignment
│       │       └── proof/      # Proof upload
│       ├── workers/            # Worker management
│       │   └── [id]/
│       │       ├── tasks/      # Assigned tasks
│       │       ├── location/   # Location tracking
│       │       └── start-job/  # Job initiation
│       ├── routes/
│       │   └── generate/       # Route generation
│       └── admin/
│           └── review/[ticketId]/ # Admin verification
├── lib/
│   ├── services/               # Business Logic
│   │   ├── road-info.service.ts
│   │   ├── severity-ranking.service.ts
│   │   ├── routing.service.ts
│   │   └── ticket-lifecycle.service.ts
│   ├── generated/prisma/       # Generated Prisma client
│   └── api-helpers.ts          # Response utilities
└── prisma/
    ├── schema.prisma           # Database schema
    └── seed.ts                 # Seed script
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
psql postgresql://username:password@localhost:5432/pothole_repair_db
```

If connection fails:

1. Verify PostgreSQL is running
2. Check credentials in `.env`
3. Ensure database exists: `CREATE DATABASE pothole_repair_db;`

### Prisma Issues

```bash
# Clear Prisma cache and regenerate
rm -rf node_modules/.prisma
pnpm db:generate
```

### External API Issues

**Overpass API not responding:**

- Check internet connection
- Try alternative instances: `https://overpass.kumi.systems/api/interpreter`

**OSRM API not responding:**

- Public instance may be rate-limited
- Consider self-hosting OSRM for production

### Port Already in Use

```bash
# Change port in package.json
"dev": "next dev -p 3001"
```

---

## Next Steps

1. ✅ **Database Setup**: Complete (if you followed steps above)
2. 🔄 **Integration**: Connect your ML detection system
3. 🔐 **Authentication**: Add JWT/session middleware
4. 📱 **Worker App**: Build mobile app using these APIs
5. 🎨 **Admin Dashboard**: Optional web interface for ticket management
6. 🚀 **Deploy**: Deploy to Vercel/Railway/Docker

---

## Production Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Use production database URL
- [ ] Add authentication middleware
- [ ] Implement rate limiting
- [ ] Set up error monitoring (Sentry)
- [ ] Configure CORS properly
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Consider self-hosting OSRM
- [ ] Add API key for admin endpoints
- [ ] Set up logging (Winston/Pino)

---

## Support

- **API Docs**: [BACKEND_API_DOCS.md](../BACKEND_API_DOCS.md)
- **Schema**: [frontend/prisma/schema.prisma](prisma/schema.prisma)
- **Examples**: See curl commands above

---

**Happy Coding! 🚀**
