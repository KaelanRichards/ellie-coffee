/*
  Warnings:

  - You are about to drop the column `data` on the `RoastProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RoastProfile" DROP COLUMN "data",
ADD COLUMN     "airflowSettings" JSONB,
ADD COLUMN     "chargeTemperature" INTEGER,
ADD COLUMN     "coolingStarted" INTEGER,
ADD COLUMN     "drumSpeed" INTEGER,
ADD COLUMN     "dryingPhaseEnd" INTEGER,
ADD COLUMN     "firstCrackEnd" INTEGER,
ADD COLUMN     "heatSettings" JSONB;

-- CreateTable
CREATE TABLE "TemperatureReading" (
    "id" TEXT NOT NULL,
    "roastProfileId" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemperatureReading_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TemperatureReading" ADD CONSTRAINT "TemperatureReading_roastProfileId_fkey" FOREIGN KEY ("roastProfileId") REFERENCES "RoastProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
