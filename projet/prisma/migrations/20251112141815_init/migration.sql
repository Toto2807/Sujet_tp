-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'moderateur', 'user');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "is_ban" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manga" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "author" TEXT,
    "artist" TEXT,
    "tags" TEXT[],
    "cover_url" TEXT,
    "published_at" DATE,

    CONSTRAINT "manga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fav" (
    "id_user" UUID NOT NULL,
    "id_manga" UUID NOT NULL,

    CONSTRAINT "fav_pkey" PRIMARY KEY ("id_user","id_manga")
);

-- CreateTable
CREATE TABLE "history" (
    "user_id" UUID NOT NULL,
    "manga_id" UUID NOT NULL,
    "last_chapter_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "history_pkey" PRIMARY KEY ("user_id","manga_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "manga_title_idx" ON "manga"("title");

-- CreateIndex
CREATE INDEX "fav_manga_idx" ON "fav"("id_manga");

-- CreateIndex
CREATE INDEX "history_user_updated_idx" ON "history"("user_id", "updated_at" DESC);

-- AddForeignKey
ALTER TABLE "fav" ADD CONSTRAINT "fav_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fav" ADD CONSTRAINT "fav_id_manga_fkey" FOREIGN KEY ("id_manga") REFERENCES "manga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_manga_id_fkey" FOREIGN KEY ("manga_id") REFERENCES "manga"("id") ON DELETE CASCADE ON UPDATE CASCADE;
