-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoastLog" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "beanType" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoastLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoastProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoastProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GreenBean" (
    "id" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "variety" TEXT NOT NULL,
    "processingMethod" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GreenBean_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CuppingNote" (
    "id" TEXT NOT NULL,
    "roastLogId" TEXT NOT NULL,
    "aroma" INTEGER NOT NULL,
    "flavor" INTEGER NOT NULL,
    "aftertaste" INTEGER NOT NULL,
    "acidity" INTEGER NOT NULL,
    "body" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "overall" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CuppingNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "RoastLog" ADD CONSTRAINT "RoastLog_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "RoastProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoastLog" ADD CONSTRAINT "RoastLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoastProfile" ADD CONSTRAINT "RoastProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuppingNote" ADD CONSTRAINT "CuppingNote_roastLogId_fkey" FOREIGN KEY ("roastLogId") REFERENCES "RoastLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
