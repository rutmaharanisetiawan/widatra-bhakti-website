import { Router } from "express";
import {
  listUsers,
  updateUserRole,
  updateUserStatus,
  getAuditLogs,
} from "../controllers/userManagementController.js";
import { authenticateToken } from "../middleware/auth.js";
import { showAdminArticle } from "../controllers/articleController.js";
import { showAdminCsrProgram } from "../controllers/csrProgramController.js";
import { showAdminJobPosting } from "../controllers/jobPostingController.js";
import { requireAccess } from "../policies/access.js";

const router = Router();

router.use(authenticateToken);

// Single item previews
router.get("/articles/:slug", requireAccess("articles"), showAdminArticle);
router.get("/csr-programs/:slug", requireAccess("articles"), showAdminCsrProgram);
router.get("/jobs/:slug", requireAccess("hr"), showAdminJobPosting);

// Super Admin user management & audit logs
router.get("/users", listUsers);
router.patch("/users/:id/role", updateUserRole);
router.patch("/users/:id/status", updateUserStatus);
router.get("/audit-logs", getAuditLogs);

export default router;
