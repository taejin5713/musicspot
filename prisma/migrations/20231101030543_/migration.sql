/*
  Warnings:

  - You are about to drop the column `userId` on the `MusicSpot` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MusicSpot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "link" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL
);
INSERT INTO "new_MusicSpot" ("id", "lat", "link", "lng") SELECT "id", "lat", "link", "lng" FROM "MusicSpot";
DROP TABLE "MusicSpot";
ALTER TABLE "new_MusicSpot" RENAME TO "MusicSpot";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
