import "dotenv/config";
import { app } from "./app.js";

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log(`[PT Widatra Bhakti] Node.js Backend running on http://0.0.0.0:${PORT}`);
  console.log(`[Database] Connected to MySQL via Prisma`);
  console.log(`[Auth & RBAC] 8 Roles & Spatie Schema Loaded`);
});
