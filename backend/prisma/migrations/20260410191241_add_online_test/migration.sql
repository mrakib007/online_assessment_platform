-- CreateTable
CREATE TABLE "OnlineTest" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "candidates" INTEGER,
    "totalSlots" INTEGER,
    "questionSet" INTEGER,
    "questionType" TEXT,
    "startTime" TEXT,
    "endTime" TEXT,
    "duration" TEXT,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OnlineTest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OnlineTest" ADD CONSTRAINT "OnlineTest_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
