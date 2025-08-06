# 📊 TradJo - Trading Journal

**TradJo** adalah aplikasi trading journal modern yang dibangun dengan Next.js, Tailwind CSS, dan shadcn/ui. Aplikasi ini dirancang khusus untuk trader yang ingin melacak performa trading mereka dengan risk management yang ketat dan analytics yang comprehensive.

## ✨ Fitur Utama

### 🎯 **Trading Management**
- **Dashboard Overview**: Statistik trading lengkap (P&L, Win Rate, Profit Factor)
- **Trade Tracking**: Pencatatan trades dengan detail entry/exit, stop loss, take profit
- **Risk Management**: Auto-calculation berdasarkan risk-reward ratio (default 1:2)
- **Trading Plans**: Manajemen multiple trading strategies
- **Real-time Statistics**: Perhitungan performa secara otomatis
- **Capital Management**: Tracking modal dan penambahan capital

### 📊 **Interactive Charts & Analytics**
- **Equity Curve**: Area chart untuk tracking pertumbuhan capital over time
- **Monthly P&L Performance**: Bar chart perbandingan performa bulanan
- **Win/Loss Ratio**: Pie chart dengan visual win rate analysis
- **Daily P&L**: Bar chart individual trade performance
- **Responsive Charts**: Optimized untuk desktop dan mobile
- **Real-time Data**: Charts update otomatis dengan data terbaru

### 🎨 **Modern UI/UX**
- **Responsive Design**: Bekerja optimal di desktop dan mobile
- **Dark/Light Theme**: Interface yang nyaman untuk mata
- **Color-coded P&L**: Visual indicators untuk profit (hijau) dan loss (merah)
- **Interactive Components**: Form yang user-friendly dengan validasi
- **Professional Dashboard**: Clean dan intuitive interface

### 📈 **Advanced Analytics**
- Total P&L tracking dengan visual trends
- Win rate calculation dan historical analysis
- Average win/loss analysis dengan charts
- Profit factor metrics dan performance indicators
- Maximum drawdown monitoring
- Monthly performance comparison
- Equity curve analysis

## 🚀 Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org) dengan App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **Database**: PostgreSQL dengan [Prisma ORM](https://prisma.io)
- **Charts**: [Recharts](https://recharts.org) untuk interactive data visualization
- **Date Handling**: [date-fns](https://date-fns.org) untuk date formatting dan manipulation
- **Icons**: [Lucide React](https://lucide.dev)
- **Runtime**: [Bun](https://bun.sh) untuk fast JavaScript runtime
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
# Menggunakan Bun (recommended)
bun install

# Atau menggunakan npm
npm install
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
bunx prisma generate

# Push schema ke database
bunx prisma db push

# Seed dengan sample data
bunx prisma db seed
```

## 🏃‍♂️ Getting Started

### Development Server
```bash
# Menggunakan Bun (recommended)
bun dev

# Atau menggunakan npm
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat aplikasi.

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` / `npm run dev` | Menjalankan development server |
| `bun run build` / `npm run build` | Build aplikasi untuk production |
| `bun start` / `npm run start` | Menjalankan production server |
| `bun run lint` / `npm run lint` | Linting code dengan ESLint |
| `bunx prisma generate` | Generate Prisma client |
| `bunx prisma db push` | Push schema ke database |
| `bunx prisma db seed` | Seed database dengan sample data |
| `bunx prisma studio` | Buka Prisma Studio (database GUI) |
| `bunx prisma db reset` | Reset database (⚠️ hapus semua data) |

## 📁 Project Structure

```
tradjo/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API routes
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Homepage
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── trading-stats.tsx
│   │   ├── trades-table.tsx
│   │   ├── trading-charts.tsx    # Interactive charts component
│   │   ├── add-trade-form.tsx
│   │   ├── capital-management.tsx
│   │   └── trading-plan-card.tsx
│   └── lib/                 # Utilities & services
│       ├── prisma.ts        # Prisma client
│       ├── services.ts      # Database services
│       ├── trading-utils.ts # Trading calculations
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

## 📊 Charts & Analytics Features

### **Interactive Data Visualization**
- **Equity Curve Chart**: 
  - Area chart menampilkan pertumbuhan capital dari waktu ke waktu
  - Visualisasi trend performa trading secara keseluruhan
  - Identifikasi periode profit dan drawdown

- **Monthly P&L Performance**:
  - Bar chart perbandingan profit/loss per bulan
  - Color-coded: hijau untuk profit, merah untuk loss
  - Analisis seasonality dan konsistensi performa

- **Win/Loss Ratio Analysis**:
  - Pie chart dengan breakdown win vs loss trades
  - Statistik win rate percentage
  - Visual representation trading consistency

- **Daily P&L Breakdown**:
  - Bar chart individual trade performance
  - Quick identification profitable vs unprofitable trades
  - Pattern recognition untuk improvement

### **Chart Features**
- **Responsive Design**: Optimal di semua device sizes
- **Interactive Tooltips**: Detailed information on hover
- **Real-time Updates**: Charts update otomatis dengan data baru
- **Professional Styling**: Clean dan modern visualization
- **Export Ready**: Charts siap untuk reporting dan analysis

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
bun run build

# Start production server
bun start
```

## 📸 Screenshots & Demo

### 🏠 **Dashboard Overview**
- Real-time trading statistics dan performance metrics
- Clean dan intuitive interface dengan color-coded P&L
- Quick access ke semua fitur utama

### 📊 **Interactive Charts**
- **Equity Curve**: Visual tracking pertumbuhan capital
- **Monthly Performance**: Bar chart perbandingan bulanan
- **Win/Loss Analysis**: Pie chart dengan statistics
- **Daily P&L**: Individual trade performance

### 📋 **Trade Management**
- Comprehensive trade tracking dengan detail lengkap
- Easy add/edit/close trades dengan form validation
- Real-time P&L calculation dan status updates

### 📱 **Responsive Design**
- Optimal experience di desktop, tablet, dan mobile
- Touch-friendly interface untuk mobile trading
- Consistent design across all devices

> **Live Demo**: Jalankan `bun dev` dan buka `http://localhost:3000` untuk melihat aplikasi secara langsung dengan sample data yang sudah tersedia.

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
