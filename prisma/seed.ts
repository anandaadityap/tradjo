import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default trading plan
  const defaultPlan = await prisma.tradingPlan.create({
    data: {
      name: 'Conservative Strategy',
      description: 'Risk Reward 1:2 dengan maksimal loss $2',
      riskRewardRatio: 2.0,
      maxLossAmount: 2.0,
      isActive: true,
    },
  })

  console.log('✅ Created trading plan:', defaultPlan.name)

  // Create sample trades
  const sampleTrades = [
    {
      symbol: 'EURUSD',
      type: 'BUY' as const,
      status: 'CLOSED' as const,
      entryPrice: 1.0850,
      entryTime: new Date('2024-01-15T09:30:00Z'),
      exitPrice: 1.0890,
      exitTime: new Date('2024-01-15T11:45:00Z'),
      quantity: 10000,
      stopLoss: 1.0830,
      takeProfit: 1.0890,
      riskAmount: 2.0,
      rewardAmount: 4.0,
      pnl: 4.0,
      pnlPercentage: 0.37,
      notes: 'Good breakout trade',
      tags: ['breakout', 'trend'],
      tradingPlanId: defaultPlan.id,
    },
    {
      symbol: 'GBPUSD',
      type: 'SELL' as const,
      status: 'CLOSED' as const,
      entryPrice: 1.2650,
      entryTime: new Date('2024-01-16T14:20:00Z'),
      exitPrice: 1.2630,
      exitTime: new Date('2024-01-16T16:10:00Z'),
      quantity: 8000,
      stopLoss: 1.2675,
      takeProfit: 1.2600,
      riskAmount: 2.0,
      rewardAmount: 4.0,
      pnl: 1.6,
      pnlPercentage: 1.58,
      notes: 'Resistance rejection',
      tags: ['resistance', 'reversal'],
      tradingPlanId: defaultPlan.id,
    },
    {
      symbol: 'USDJPY',
      type: 'BUY' as const,
      status: 'CLOSED' as const,
      entryPrice: 148.50,
      entryTime: new Date('2024-01-17T08:15:00Z'),
      exitPrice: 148.30,
      exitTime: new Date('2024-01-17T10:30:00Z'),
      quantity: 1000,
      stopLoss: 148.30,
      takeProfit: 148.90,
      riskAmount: 2.0,
      rewardAmount: 4.0,
      pnl: -2.0,
      pnlPercentage: -0.13,
      notes: 'Stop loss hit, news impact',
      tags: ['news', 'stopped'],
      tradingPlanId: defaultPlan.id,
    },
    {
      symbol: 'AUDUSD',
      type: 'BUY' as const,
      status: 'OPEN' as const,
      entryPrice: 0.6750,
      entryTime: new Date('2024-01-18T12:00:00Z'),
      quantity: 15000,
      stopLoss: 0.6730,
      takeProfit: 0.6790,
      riskAmount: 2.0,
      rewardAmount: 4.0,
      notes: 'Support bounce setup',
      tags: ['support', 'pending'],
      tradingPlanId: defaultPlan.id,
    },
  ]

  for (const trade of sampleTrades) {
    const createdTrade = await prisma.trade.create({
      data: trade,
    })
    console.log(`✅ Created trade: ${createdTrade.symbol} ${createdTrade.type}`)
  }

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })