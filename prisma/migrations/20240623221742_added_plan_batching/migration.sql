-- CreateTable
CREATE TABLE "BatchPlan" (
    "id" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "roastProfileId" TEXT NOT NULL,
    "greenBeanId" TEXT NOT NULL,
    "batchSize" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BatchPlan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BatchPlan" ADD CONSTRAINT "BatchPlan_roastProfileId_fkey" FOREIGN KEY ("roastProfileId") REFERENCES "RoastProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchPlan" ADD CONSTRAINT "BatchPlan_greenBeanId_fkey" FOREIGN KEY ("greenBeanId") REFERENCES "GreenBean"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
