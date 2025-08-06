-- CreateEnum
CREATE TYPE "public"."TradeType" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "public"."TradeStatus" AS ENUM ('PENDING', 'OPEN', 'CLOSED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."trading_plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "riskRewardRatio" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "maxLossAmount" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trading_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."trades" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "type" "public"."TradeType" NOT NULL,
    "status" "public"."TradeStatus" NOT NULL DEFAULT 'PENDING',
    "entryPrice" DOUBLE PRECISION NOT NULL,
    "entryTime" TIMESTAMP(3) NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "exitPrice" DOUBLE PRECISION,
    "exitTime" TIMESTAMP(3),
    "stopLoss" DOUBLE PRECISION NOT NULL,
    "takeProfit" DOUBLE PRECISION NOT NULL,
    "riskAmount" DOUBLE PRECISION NOT NULL,
    "rewardAmount" DOUBLE PRECISION NOT NULL,
    "pnl" DOUBLE PRECISION,
    "pnlPercentage" DOUBLE PRECISION,
    "notes" TEXT,
    "screenshot" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tradingPlanId" TEXT NOT NULL,

    CONSTRAINT "trades_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."trades" ADD CONSTRAINT "trades_tradingPlanId_fkey" FOREIGN KEY ("tradingPlanId") REFERENCES "public"."trading_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
