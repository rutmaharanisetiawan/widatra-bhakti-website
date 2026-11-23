import { Router } from "express";
import {
  listCommunityEvents,
  myCommunityEvents,
  getCommunityEvent,
  createCommunityEvent,
  updateCommunityEvent,
  deleteCommunityEvent,
  uploadCommunityEventDocument,
  submitForReview,
  approveCommunityEvent,
  rejectCommunityEvent,
  requestRevisionCommunityEvent,
  adminUpdateCommunityEvent,
  publishCommunityEvent,
} from "../controllers/communityEventController.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireAccess } from "../policies/access.js";
import { uploadTo } from "../middleware/upload.js";

const router = Router();
const docUploader = uploadTo("events", {
  maxSizeMb: 15,
});

router.use(authenticateToken);

router.get("/mine", myCommunityEvents);
router.get("/", requireAccess("events"), listCommunityEvents);
router.get("/:id", getCommunityEvent);
router.post("/", createCommunityEvent);
router.put("/:id", updateCommunityEvent);
router.delete("/:id", deleteCommunityEvent);
router.post("/:id/documents", docUploader.single("file"), uploadCommunityEventDocument);
router.post("/:id/submit", submitForReview);

// Moderator endpoints
router.post("/:id/approve", requireAccess("events"), approveCommunityEvent);
router.post("/:id/reject", requireAccess("events"), rejectCommunityEvent);
router.post("/:id/request-revision", requireAccess("events"), requestRevisionCommunityEvent);
router.put("/:id/admin", requireAccess("events"), adminUpdateCommunityEvent);
router.post("/:id/publish", requireAccess("events"), publishCommunityEvent);

export default router;
