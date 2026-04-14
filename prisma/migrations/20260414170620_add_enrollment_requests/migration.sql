-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "enrollment_requests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "location" TEXT,
    "preferred_schedule" TEXT,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'PENDING',
    "admin_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enrollment_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_requests_user_id_key" ON "enrollment_requests"("user_id");

-- AddForeignKey
ALTER TABLE "enrollment_requests" ADD CONSTRAINT "enrollment_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
