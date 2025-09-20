-- CreateTable
CREATE TABLE "public"."Appointment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "timeOfBirth" TEXT NOT NULL,
    "placeOfBirth" TEXT NOT NULL,
    "additionalNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
