-- CreateIndex
CREATE INDEX "assignments_student_id_status_idx" ON "assignments"("student_id", "status");

-- CreateIndex
CREATE INDEX "enrollment_requests_status_idx" ON "enrollment_requests"("status");

-- CreateIndex
CREATE INDEX "invoices_student_id_status_idx" ON "invoices"("student_id", "status");

-- CreateIndex
CREATE INDEX "invoices_due_date_idx" ON "invoices"("due_date");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_at_idx" ON "notifications"("user_id", "read_at");

-- CreateIndex
CREATE INDEX "session_notes_attendance_status_idx" ON "session_notes"("attendance_status");

-- CreateIndex
CREATE INDEX "sessions_student_id_status_idx" ON "sessions"("student_id", "status");

-- CreateIndex
CREATE INDEX "sessions_start_time_idx" ON "sessions"("start_time");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");
