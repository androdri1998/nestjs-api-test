-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bookmarks" (
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "link" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bookmarks" ("createdAt", "description", "id", "link", "title", "updatedAt", "userId") SELECT "createdAt", "description", "id", "link", "title", "updatedAt", "userId" FROM "bookmarks";
DROP TABLE "bookmarks";
ALTER TABLE "new_bookmarks" RENAME TO "bookmarks";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
