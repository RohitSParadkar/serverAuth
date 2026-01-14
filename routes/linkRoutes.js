const express = require("express");
const { v4: uuidv4 } = require("uuid");
const sqlDb = require("../sql/sqlite");
const TempLink = require("../mongo/TempLink");

const router = express.Router();
const TTL_MS = 10 * 1000;

/**
 * MAIN PAGE
 */
router.post("/create", async (req, res) => {
  const user = req.body.user || "user1";
  const now = Date.now();

  // 1️⃣ Check existing token for user
  sqlDb.get(
    `SELECT * FROM main_links 
     WHERE user = ? AND activated = TRUE`,
    [user],
    async (err, row) => {
      if (row && now - row.created_at < TTL_MS) {
        // Reuse existing token
        return res.json({
          uniqueId: row.unique_id,
          activated: true,
          reused: true
        });
      }

      // Cleanup old token (if exists)
      if (row) {
        sqlDb.run(
          "DELETE FROM main_links WHERE unique_id = ?",
          [row.unique_id]
        );
      }

      // 2️⃣ Create new token
      const uniqueId = uuidv4();

      sqlDb.run(
        `INSERT INTO main_links (user, unique_id, activated, created_at)
         VALUES (?, ?, FALSE, ?)`,
        [user, uniqueId, now],
        async (insertErr) => {
          if (insertErr) {
            return res.status(500).json({ error: "SQLite insert failed" });
          }

          try {
            // 3️⃣ Store in MongoDB
            await TempLink.create({ uniqueId });

            // 4️⃣ Activate SQLite
            sqlDb.run(
              "UPDATE main_links SET activated = TRUE WHERE unique_id = ?",
              [uniqueId]
            );

            // 5️⃣ Start SQLite expiry timer
            setTimeout(() => {
              sqlDb.run(
                "DELETE FROM main_links WHERE unique_id = ?",
                [uniqueId]
              );
            }, TTL_MS);

            res.json({
              uniqueId,
              activated: true,
              reused: false
            });
          } catch {
            return res.status(500).json({ error: "Mongo insert failed" });
          }
        }
      );
    }
  );
});

/**
 * SECOND PAGE VALIDATION
 */
router.get("/validate/:id", async (req, res) => {
  const link = await TempLink.findOne({ uniqueId: req.params.id });

  if (!link || !link.valid) {
    return res.status(401).json({ valid: false });
  }

  res.json({ valid: true });
});

module.exports = router;
