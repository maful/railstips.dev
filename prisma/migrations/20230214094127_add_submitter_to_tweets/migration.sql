-- AlterTable
ALTER TABLE "tweets" ADD COLUMN     "submitter_id" TEXT;

-- CreateIndex
CREATE INDEX "tweets_submitter_id_idx" ON "tweets"("submitter_id");

-- CreateIndex
CREATE INDEX "tweets_category_id_idx" ON "tweets"("category_id");

-- AddForeignKey
ALTER TABLE "tweets" ADD CONSTRAINT "tweets_submitter_id_fkey" FOREIGN KEY ("submitter_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
