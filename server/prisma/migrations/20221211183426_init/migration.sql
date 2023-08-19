-- CreateTable
CREATE TABLE "auth_entry" (
    "id" TEXT NOT NULL,
    "auth_code" TEXT NOT NULL,
    "code_challenge" TEXT NOT NULL,
    "token" TEXT,
    "created_ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_entry_auth_code_key" ON "auth_entry"("auth_code");
