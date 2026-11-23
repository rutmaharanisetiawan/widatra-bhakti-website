import { Router } from "express";
import {
  submitInquiry,
  listInquiries,
  inquiryCounts,
  getInquiry,
  archiveInquiry,
  unarchiveInquiry,
  replyInquiry,
} from "../controllers/contactInquiryController.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireAccess } from "../policies/access.js";

const router = Router();

// Public contact submission
router.post("/", submitInquiry);

// Protected admin endpoints
router.get("/", authenticateToken, requireAccess("contact"), listInquiries);
router.get("/counts", authenticateToken, requireAccess("contact"), inquiryCounts);
router.get("/:id", authenticateToken, requireAccess("contact"), getInquiry);
router.post("/:id/archive", authenticateToken, requireAccess("contact"), archiveInquiry);
router.post("/:id/unarchive", authenticateToken, requireAccess("contact"), unarchiveInquiry);
router.post("/:id/reply", authenticateToken, requireAccess("contact"), replyInquiry);

export default router;
