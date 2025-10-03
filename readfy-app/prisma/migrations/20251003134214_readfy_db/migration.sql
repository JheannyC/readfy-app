-- CreateEnum
CREATE TYPE "public"."StatusEnum" AS ENUM ('Aberto', 'Fechado', 'Finalizado');

-- CreateTable
CREATE TABLE "public"."Book" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "anoPublicacao" INTEGER NOT NULL,
    "paginas" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "avaliacao" INTEGER,
    "imgURL" TEXT,
    "generoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Genre" (
    "id" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Status" (
    "id" SERIAL NOT NULL,
    "statusName" "public"."StatusEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Genre_categoryName_key" ON "public"."Genre"("categoryName");

-- CreateIndex
CREATE UNIQUE INDEX "Status_statusName_key" ON "public"."Status"("statusName");

-- AddForeignKey
ALTER TABLE "public"."Book" ADD CONSTRAINT "Book_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "public"."Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Book" ADD CONSTRAINT "Book_generoId_fkey" FOREIGN KEY ("generoId") REFERENCES "public"."Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
