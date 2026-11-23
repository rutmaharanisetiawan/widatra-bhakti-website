import { Router } from "express";
import {
  listJobPostings,
  getJobPosting,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
  setJobPostingStatus,
  setJobPostingFeatured,
} from "../controllers/jobPostingController.js";
import { authenticateToken, optionalAuthenticateToken } from "../middleware/auth.js";
import { requireAccess } from "../policies/access.js";

const router = Router();

// Public routes (with optional auth for ?all=1)
router.get("/", optionalAuthenticateToken, listJobPostings);
router.get("/:slug", getJobPosting);

// HR / Super Admin routes
router.post("/", authenticateToken, requireAccess("hr"), createJobPosting);
router.put("/:slug", authenticateToken, requireAccess("hr"), updateJobPosting);
router.delete("/:slug", authenticateToken, requireAccess("hr"), deleteJobPosting);
router.patch("/:slug/status", authenticateToken, requireAccess("hr"), setJobPostingStatus);
router.patch("/:slug/featured", authenticateToken, requireAccess("hr"), setJobPostingFeatured);

export default router;
