import { Router } from "express";
import {
  listApplications,
  myApplications,
  getApplication,
  submitApplication,
  updateApplicationStatus,
  scheduleInterview,
  updateInterview,
  cancelInterview,
  addHrNote,
} from "../controllers/applicationController.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireAccess } from "../policies/access.js";
import { uploadTo } from "../middleware/upload.js";

const router = Router();
const cvUploader = uploadTo("applications", {
  maxSizeMb: 10,
  allowedExt: ["pdf", "doc", "docx"],
});

// All application routes require authentication
router.use(authenticateToken);

router.get("/mine", myApplications);
router.get("/", requireAccess("hr"), listApplications);
router.get("/:id", getApplication);
router.post("/", cvUploader.single("cv"), submitApplication);
router.patch("/:id/status", requireAccess("hr"), updateApplicationStatus);
router.post("/:id/interview", requireAccess("hr"), scheduleInterview);
router.put("/:id/interview", requireAccess("hr"), updateInterview);
router.post("/:id/interview/cancel", requireAccess("hr"), cancelInterview);
router.post("/:id/notes", requireAccess("hr"), addHrNote);

export default router;
