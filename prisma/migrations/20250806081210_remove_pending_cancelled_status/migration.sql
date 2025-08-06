/*
  Warnings:

  - The values [PENDING,CANCELLED] on the enum `TradeStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."TradeStatus_new" AS ENUM ('OPEN', 'CLOSED');
ALTER TABLE "public"."trades" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."trades" ALTER COLUMN "status" TYPE "public"."TradeStatus_new" USING ("status"::text::"public"."TradeStatus_new");
ALTER TYPE "public"."TradeStatus" RENAME TO "TradeStatus_old";
ALTER TYPE "public"."TradeStatus_new" RENAME TO "TradeStatus";
DROP TYPE "public"."TradeStatus_old";
ALTER TABLE "public"."trades" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

-- AlterTable
ALTER TABLE "public"."trades" ALTER COLUMN "status" SET DEFAULT 'OPEN';
