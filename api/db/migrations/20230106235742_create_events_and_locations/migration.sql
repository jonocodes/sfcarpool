-- CreateTable
CREATE TABLE "Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "label" TEXT,
    "date" DATETIME NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "passenger" BOOLEAN NOT NULL DEFAULT true,
    "likelihood" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "locationId" INTEGER NOT NULL,
    CONSTRAINT "Event_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
