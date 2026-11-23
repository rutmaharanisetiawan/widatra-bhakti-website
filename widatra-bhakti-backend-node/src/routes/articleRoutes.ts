import { Router } from "express";
import {
  listArticles,
  getArticle,
  getRelatedArticles,
  showAdminArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  setArticleStatus,
} from "../controllers/articleController.js";
import { authenticateToken, optionalAuthenticateToken } from "../middleware/auth.js";
import { requireAccess } from "../policies/access.js";

const router = Router();

// Public routes (with optional auth for ?all=1)
router.get("/", optionalAuthenticateToken, listArticles);
router.get("/:slug/related", getRelatedArticles);
router.get("/:slug", getArticle);

// Admin routes
router.post("/", authenticateToken, requireAccess("articles"), createArticle);
router.put("/:slug", authenticateToken, requireAccess("articles"), updateArticle);
router.delete("/:slug", authenticateToken, requireAccess("articles"), deleteArticle);
router.patch("/:slug/status", authenticateToken, requireAccess("articles"), setArticleStatus);

export default router;
