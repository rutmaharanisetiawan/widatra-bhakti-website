import { Router } from "express";
import {
  listCsrPrograms,
  getCsrProgram,
  showAdminCsrProgram,
  createCsrProgram,
  updateCsrProgram,
  deleteCsrProgram,
  setCsrProgramStatus,
} from "../controllers/csrProgramController.js";
import { authenticateToken, optionalAuthenticateToken } from "../middleware/auth.js";
import { requireAccess } from "../policies/access.js";

const router = Router();

// Public routes (with optional auth for ?all=1)
router.get("/", optionalAuthenticateToken, listCsrPrograms);
router.get("/:slug", getCsrProgram);

// Admin routes
router.post("/", authenticateToken, requireAccess("articles"), createCsrProgram);
router.put("/:slug", authenticateToken, requireAccess("articles"), updateCsrProgram);
router.delete("/:slug", authenticateToken, requireAccess("articles"), deleteCsrProgram);
router.patch("/:slug/status", authenticateToken, requireAccess("articles"), setCsrProgramStatus);

export default router;
