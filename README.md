# 📊 TradJo - Trading Journal

**TradJo** adalah aplikasi trading journal modern yang dibangun dengan Next.js, Tailwind CSS, dan shadcn/ui. Aplikasi ini dirancang khusus untuk trader yang ingin melacak performa trading mereka dengan risk management yang ketat.

## ✨ Fitur Utama

### 🎯 **Trading Management**
- **Dashboard Overview**: Statistik trading lengkap (P&L, Win Rate, Profit Factor)
- **Trade Tracking**: Pencatatan trades dengan detail entry/exit, stop loss, take profit
- **Risk Management**: Auto-calculation berdasarkan risk-reward ratio (default 1:2)
- **Trading Plans**: Manajemen multiple trading strategies
- **Real-time Statistics**: Perhitungan performa secara otomatis

### 🎨 **Modern UI/UX**
- **Responsive Design**: Bekerja optimal di desktop dan mobile
- **Dark/Light Theme**: Interface yang nyaman untuk mata
- **Color-coded P&L**: Visual indicators untuk profit (hijau) dan loss (merah)
- **Interactive Components**: Form yang user-friendly dengan validasi

### 📈 **Analytics & Reporting**
- Total P&L tracking
- Win rate calculation
- Average win/loss analysis
- Profit factor metrics
- Maximum drawdown monitoring

## 🚀 Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org) dengan App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **Database**: PostgreSQL dengan [Prisma ORM](https://prisma.io)
- **Icons**: [Lucide React](https://lucide.dev)
- **Language**: TypeScript untuk type safety

## 📋 Prerequisites

Sebelum memulai, pastikan Anda memiliki:

- **Node.js** 18+ atau **Bun** runtime
- **PostgreSQL** database (local atau cloud)
- **Git** untuk version control

## 🛠️ Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd tradjo
```

### 2. Install Dependencies
```bash
npm install
# atau
bun install
```

### 3. Database Setup
Ikuti panduan lengkap di **[PRISMA_SETUP.md](./PRISMA_SETUP.md)** untuk:
- Konfigurasi PostgreSQL database
- Setup environment variables
- Menjalankan migrations
- Seeding sample data

### 4. Environment Configuration
Buat file `.env` dengan konfigurasi berikut:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tradjo?schema=public"
```

### 5. Database Migration
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed dengan sample data
npm run db:seed
```

## 🏃‍♂️ Getting Started

### Development Server
```bash
npm run dev
# atau
bun dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat aplikasi.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Menjalankan development server |
| `npm run build` | Build aplikasi untuk production |
| `npm run start` | Menjalankan production server |
| `npm run lint` | Linting code dengan ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Jalankan database migrations |
| `npm run db:seed` | Seed database dengan sample data |
| `npm run db:studio` | Buka Prisma Studio (database GUI) |
| `npm run db:reset` | Reset database (⚠️ hapus semua data) |

## 📁 Project Structure

```
tradjo/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Homepage
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── trading-stats.tsx
│   │   ├── trades-table.tsx
│   │   ├── add-trade-form.tsx
│   │   └── trading-plan-card.tsx
│   └── lib/                 # Utilities & services
│       ├── prisma.ts        # Prisma client
│       ├── services.ts      # Database services
│       ├── types.ts         # TypeScript types
│       └── utils.ts         # Helper functions
├── prisma/                  # Database schema & migrations
├── public/                  # Static assets
└── docs/                    # Documentation
```

## 🎯 Trading Plan Configuration

Aplikasi mendukung trading plan dengan konfigurasi:

- **Risk-Reward Ratio**: Default 1:2 (sesuai strategi konservatif)
- **Maximum Loss**: $2 per trade (risk management ketat)
- **Auto-calculation**: Take profit dihitung otomatis berdasarkan RR ratio
- **Multiple Plans**: Mendukung berbagai strategi trading

## 📊 Sample Data

Aplikasi dilengkapi dengan sample data untuk demo:
- **Trading Plans**: Conservative Strategy & Aggressive Growth
- **Sample Trades**: EURUSD, GBPUSD, BTCUSD dengan berbagai status
- **Statistics**: Perhitungan performa berdasarkan historical data

## 🔧 Customization

### Menambah Trading Plan Baru
```typescript
const newPlan = await createTradingPlan({
  name: "Scalping Strategy",
  description: "Quick trades with tight stops",
  riskRewardRatio: 1.5,
  maxLossAmount: 1.0
})
```

### Menambah Trade Baru
```typescript
const newTrade = await createTrade({
  symbol: "EURUSD",
  type: "BUY",
  entryPrice: 1.0850,
  quantity: 10000,
  stopLoss: 1.0830,
  takeProfit: 1.0890,
  tradingPlanId: "plan-id"
})
```

## 📚 Documentation

- **[PRISMA_SETUP.md](./PRISMA_SETUP.md)** - Panduan lengkap setup database
- **[Next.js Documentation](https://nextjs.org/docs)** - Framework documentation
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Styling framework
- **[shadcn/ui](https://ui.shadcn.com)** - UI component library

## 🚀 Deployment

### Vercel (Recommended)
1. Push code ke GitHub repository
2. Connect repository di [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy otomatis setiap push ke main branch

### Manual Deployment
```bash
# Build aplikasi
npm run build

# Start production server
npm run start
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

Jika mengalami masalah atau memiliki pertanyaan:

1. Check [PRISMA_SETUP.md](./PRISMA_SETUP.md) untuk database issues
2. Review [Issues](../../issues) yang sudah ada
3. Buat issue baru dengan detail yang lengkap

---

**Happy Trading! 📈**
