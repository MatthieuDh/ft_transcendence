-- AlterEnum
ALTER TYPE "TaskStatus" ADD VALUE 'PENDING_EVALUATION';

-- CreateTable
CREATE TABLE "TaskStatusHistory" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "status" "TaskStatus" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedBy" INTEGER,

    CONSTRAINT "TaskStatusHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaskStatusHistory" ADD CONSTRAINT "TaskStatusHistory_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
