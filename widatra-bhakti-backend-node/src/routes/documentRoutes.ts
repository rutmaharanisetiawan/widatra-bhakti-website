import { Router } from "express";
import { listDocuments, uploadDocument, deleteDocument } from "../controllers/documentController.js";
import { authenticateToken } from "../middleware/auth.js";
import { uploadTo } from "../middleware/upload.js";

const router = Router();
const docUploader = uploadTo("documents", { maxSizeMb: 20 });

router.use(authenticateToken);
router.get("/", listDocuments);
router.post("/", docUploader.single("file"), uploadDocument);
router.delete("/:id", deleteDocument);

export default router;
