-- CreateTable
CREATE TABLE "public"."ContactDetails" (
    "id" TEXT NOT NULL,
    "phone1" TEXT,
    "phone2" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactDetails_pkey" PRIMARY KEY ("id")
);
