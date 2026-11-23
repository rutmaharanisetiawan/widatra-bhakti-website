import { Router } from "express";
import {
  listMediaAssets,
  uploadMediaAsset,
  renameMediaAsset,
  moveMediaAsset,
  replaceMediaAsset,
  deleteMediaAsset,
} from "../controllers/mediaAssetController.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireAccess } from "../policies/access.js";
import { uploadTo } from "../middleware/upload.js";

const router = Router();
const mediaUploader = uploadTo("media", {
  maxSizeMb: 15,
  allowedExt: ["jpg", "jpeg", "png", "svg", "webp"],
});

// Public read-only catalog
router.get("/", listMediaAssets);

// Protected admin mutations
router.post("/", authenticateToken, requireAccess("content"), mediaUploader.single("file"), uploadMediaAsset);
router.patch("/:id/rename", authenticateToken, requireAccess("content"), renameMediaAsset);
router.patch("/:id/move", authenticateToken, requireAccess("content"), moveMediaAsset);
router.post(
  "/:id/replace",
  authenticateToken,
  requireAccess("content"),
  mediaUploader.single("file"),
  replaceMediaAsset
);
router.delete("/:id", authenticateToken, requireAccess("content"), deleteMediaAsset);

export default router;
