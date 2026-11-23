import { Router } from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireAccess } from "../policies/access.js";

const router = Router();

router.get("/", listProducts);
router.get("/:code", getProduct);

router.post("/", authenticateToken, requireAccess("content"), createProduct);
router.put("/:code", authenticateToken, requireAccess("content"), updateProduct);
router.delete("/:code", authenticateToken, requireAccess("content"), deleteProduct);

export default router;
