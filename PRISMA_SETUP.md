# Prisma Setup - Trading Journal

## Database Schema

Trading Journal menggunakan PostgreSQL dengan Prisma ORM. Schema database terdiri dari:

### Models

#### TradingPlan
- `id`: Unique identifier
- `name`: Nama trading plan
- `description`: Deskripsi (optional)
- `riskRewardRatio`: Risk reward ratio (default: 2.0 untuk 1:2)
- `maxLossAmount`: Maksimal loss amount (default: $2)
- `isActive`: Status aktif/tidak
- `createdAt`, `updatedAt`: Timestamps

#### Trade
- `id`: Unique identifier
- `symbol`: Trading pair (e.g., "EURUSD")
- `type`: BUY atau SELL
- `status`: PENDING, OPEN, CLOSED, CANCELLED
- `entryPrice`, `entryTime`: Data entry
- `exitPrice`, `exitTime`: Data exit (optional)
- `quantity`: Jumlah lot/unit
- `stopLoss`, `takeProfit`: Level SL dan TP
- `riskAmount`, `rewardAmount`: Jumlah risk dan reward
- `pnl`, `pnlPercentage`: Profit/Loss hasil
- `notes`: Catatan (optional)
- `screenshot`: URL screenshot (optional)
- `tags`: Array tags
- `tradingPlanId`: Foreign key ke TradingPlan

## Setup Instructions

### 1. Database Configuration
Pastikan PostgreSQL berjalan di local dengan:
- Database name: `tradjo`
- Username: `postgres`
- Password: `postgres`
- Port: `5432`

### 2. Environment Variables
File `.env` sudah dikonfigurasi dengan:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tradjo?schema=public"
```

### 3. Available Scripts

```bash
# Generate Prisma Client
bun run db:generate

# Run migrations
bun run db:migrate

# Seed database with sample data
bun run db:seed

# Open Prisma Studio (database GUI)
bun run db:studio

# Reset database (WARNING: deletes all data)
bun run db:reset
```

### 4. Usage in Code

```typescript
import { prisma } from '@/lib/prisma'
import { createTrade, getTrades } from '@/lib/services'

// Create a new trade
const trade = await createTrade({
  symbol: 'EURUSD',
  type: 'BUY',
  entryPrice: 1.0850,
  entryTime: new Date(),
  quantity: 10000,
  stopLoss: 1.0830,
  takeProfit: 1.0890,
  riskAmount: 2.0,
  rewardAmount: 4.0,
  tradingPlanId: 'plan-id'
})

// Get all trades
const trades = await getTrades()
```

## Files Created

- `prisma/schema.prisma` - Database schema
- `src/lib/prisma.ts` - Prisma client configuration
- `src/lib/types.ts` - TypeScript types
- `src/lib/services.ts` - Database service functions
- `src/lib/trading-utils.ts` - Trading calculation utilities
- `prisma/seed.ts` - Sample data seeder

## Sample Data

Database telah di-seed dengan:
- 1 Trading Plan: "Conservative Strategy" (RR 1:2, max loss $2)
- 4 Sample Trades: 3 closed trades (2 wins, 1 loss) + 1 open trade

## Next Steps

1. ✅ Prisma setup complete
2. 🔄 Build UI components for trading journal
3. 🔄 Create forms for adding trades
4. 🔄 Build dashboard with statistics
5. 🔄 Add charts and analytics