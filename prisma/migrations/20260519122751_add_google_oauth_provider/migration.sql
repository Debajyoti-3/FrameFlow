-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('local', 'google');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" "AuthProvider" NOT NULL DEFAULT 'local',
ALTER COLUMN "password" DROP NOT NULL;
