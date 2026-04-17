-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "deadlineNotified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "deadlineNotified" BOOLEAN NOT NULL DEFAULT false;
