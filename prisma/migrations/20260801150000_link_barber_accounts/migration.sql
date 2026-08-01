ALTER TABLE "Barber" ADD COLUMN "userId" TEXT;
CREATE UNIQUE INDEX "Barber_userId_key" ON "Barber"("userId");
ALTER TABLE "Barber" ADD CONSTRAINT "Barber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
