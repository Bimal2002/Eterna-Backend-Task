# Order Execution Engine

Hey! This is a market order execution system I built for processing trades on Solana DEXs. It compares quotes from Raydium and Meteora, picks the best one, and executes the swap. Everything happens in real-time with WebSocket updates so you can watch your order go through.

## Why I Chose Market Orders

Honestly, market orders are the most straightforward - you submit, they execute immediately at whatever's the best price available. Perfect for showing off the architecture without getting tangled in extra conditions.

If I had to add limit orders tomorrow, I'd just throw in a price check before the order hits the queue. For sniper orders (those token launch things), I'd set up event listeners for migration signals and trigger execution when they fire. The queue and routing logic stays exactly the same.

## What I Used

- **Node.js + TypeScript** - Can't compromise on type safety, honestly
- **Fastify** - Blazing fast server, WebSockets work out of the box
- **BullMQ + Redis** - Rock solid job queue, handles retries beautifully  
- **PostgreSQL + Prisma** - Postgres for persistence, Prisma makes DB work actually pleasant

## How Everything Flows

Pretty simple flow:
1. You POST to `/api/orders/execute` with your order details
2. Server validates it, saves to DB, gives you back an orderId
3. BullMQ worker grabs it from the queue
4. Fetches quotes from Raydium and Meteora (mocked with realistic 200-400ms delays)
5. Picks whoever's cheaper
6. Simulates building the transaction and sending it
7. Your order goes: pending → routing → building → submitted → confirmed/failed
8. Open a WebSocket to `ws://localhost:3000/api/orders/status/:orderId` and watch it all happen live

## Setup & Running Instructions

### Prerequisites
Make sure you have these installed:
- **Node.js 18+** (check with `node --version`)
- **Docker Desktop** (for running Postgres and Redis)
- **Git** (to clone the repo)

### Step-by-Step Setup

**1. Clone the repository**
```bash
git clone <repository-url>
cd order-execution-engine
```

**2. Install dependencies**
```bash
npm install
```

**3. Start the databases**

Make sure Docker Desktop is running, then:
```bash
docker compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379

**4. Run database migrations**

```bash
# Set the database URL (required for migration)
$env:DATABASE_URL='postgresql://postgres:Kgp%401951@127.0.0.1:5432/orders_db'

# Create the database schema
npx prisma migrate dev --name init
```

**5. Start the server**

```bash
npm run dev
```

You should see:
```
Server listening at http://0.0.0.0:3000
Server listening on http://localhost:3000
```

That's it! The server is now running at **http://localhost:3000**

### Quick Verification

**Check if databases are running:**
```bash
docker ps
```
You should see `order-execution-engine-postgres-1` and `order-execution-engine-redis-1`

**Check if server is responding:**
```bash
curl http://localhost:3000/api/orders/execute
```
You should get a validation error (which means the endpoint is working!)

## Testing the API

### Using Postman

**Endpoint 1: Execute Market Order**

```
POST http://localhost:3000/api/orders/execute
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "type": "market",
  "tokenIn": "SOL",
  "tokenOut": "USDC",
  "amount": 1
}
```

**Response:**
```json
{
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending"
}
```

---

**Endpoint 2: WebSocket - Order Status Updates**

```
ws://localhost:3000/api/orders/status/{orderId}
```

Replace `{orderId}` with the ID you got from the execute endpoint.

**How to test in Postman:**
1. Create new WebSocket Request
2. Paste the URL with your orderId
3. Click Connect
4. Watch real-time status updates as the order processes

**Status progression:**
```
pending → routing → building → submitted → confirmed
```

## Running Tests

Execute the test suite:
```bash
npm test
```

The test suite includes:
- **Unit tests** - DEX routing logic, utility functions, queue retry behavior
- **Integration tests** - Complete order flow, concurrent processing, WebSocket lifecycle

All 8 test files should pass. Tests use Vitest as the test runner.

## Project Structure

```
src/
├── config/          # Environment and database setup
├── libs/            # Logger and utility functions  
├── modules/
│   ├── dex/         # Mock DEX router (Raydium & Meteora quotes)
│   └── orders/      # Order handling - controller, queue, worker, websocket
├── app.ts           # Fastify app setup
└── index.ts         # Server entry point

tests/
├── unit/            # Unit tests for core logic
└── integration/     # Integration tests for order flow
```

## Environment Variables

Check your `.env` file:
```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:Kgp%401951@127.0.0.1:5432/orders_db
REDIS_URL=redis://127.0.0.1:6379
BULLMQ_PREFIX=oe:
CONCURRENT_ORDERS=10
```

The system processes up to 10 orders concurrently. Each failed order gets 3 retry attempts with exponential backoff before giving up.

## Troubleshooting

**Docker containers not starting?**
- Make sure Docker Desktop is running
- Try: `docker compose down` then `docker compose up -d`

**Migration fails?**
- Check if Postgres container is running: `docker ps`
- Verify the DATABASE_URL in `.env` file
- Wait a few seconds for Postgres to fully initialize


**Tests failing?**
- Make sure databases are running
- Run `npm install` again
- Check if `.env` file exists with correct configuration

## Project Architecture

This is a mock implementation using simulated DEX responses. In production:
- Replace mock routers with actual Raydium SDK and Meteora SDK
- Implement real transaction signing and submission
- Add proper error handling for network failures
- Use Redis pub/sub instead of polling for WebSocket updates

The queue can handle 10 concurrent orders with 3 retry attempts (exponential backoff). Failed orders persist their failure reason in the database for debugging.

---

**Note:** This was built as a backend engineering assignment demonstrating order execution, queue management, and real-time updates.
