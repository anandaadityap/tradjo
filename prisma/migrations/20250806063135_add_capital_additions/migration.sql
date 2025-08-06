-- CreateTable
CREATE TABLE "public"."capital_additions" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tradingPlanId" TEXT NOT NULL,

    CONSTRAINT "capital_additions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."capital_additions" ADD CONSTRAINT "capital_additions_tradingPlanId_fkey" FOREIGN KEY ("tradingPlanId") REFERENCES "public"."trading_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
