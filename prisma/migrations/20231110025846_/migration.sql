/*
  Warnings:

  - You are about to drop the column `link` on the `MusicSpot` table. All the data in the column will be lost.
  - Added the required column `spotifyID` to the `MusicSpot` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MusicSpot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "spotifyID" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL
);
INSERT INTO "new_MusicSpot" ("id", "lat", "lng") SELECT "id", "lat", "lng" FROM "MusicSpot";
DROP TABLE "MusicSpot";
ALTER TABLE "new_MusicSpot" RENAME TO "MusicSpot";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
