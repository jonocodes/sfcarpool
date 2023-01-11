/*
  Warnings:

  - You are about to drop the column `likelyhood` on the `Event` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "label" TEXT,
    "date" DATETIME NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "passenger" BOOLEAN NOT NULL DEFAULT true,
    "likelihood" INTEGER NOT NULL DEFAULT 95,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "locationId" INTEGER NOT NULL,
    CONSTRAINT "Event_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("active", "createdAt", "date", "end", "id", "label", "locationId", "passenger", "start", "updatedAt") SELECT "active", "createdAt", "date", "end", "id", "label", "locationId", "passenger", "start", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
