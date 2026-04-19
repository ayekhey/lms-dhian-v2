-- AlterTable
ALTER TABLE "DiagnosticResult" ADD COLUMN     "answers" JSONB;

-- AlterTable
ALTER TABLE "PostTestResult" ADD COLUMN     "answers" JSONB;
