import { Router } from "express";
import {
  listTourBookings,
  lookupTourBooking,
  submitTourBooking,
  getTourBooking,
  updateTourStatus,
  addTourNote,
} from "../controllers/tourBookingController.js";
import { authenticateToken, optionalAuthenticateToken } from "../middleware/auth.js";
import { requireAccess } from "../policies/access.js";

const router = Router();

// Public booking and lookup
router.post("/", optionalAuthenticateToken, submitTourBooking);
router.get("/lookup", lookupTourBooking);

// Protected admin / visitor detail routes
router.get("/", authenticateToken, requireAccess("tours"), listTourBookings);
router.get("/:id", authenticateToken, getTourBooking);
router.patch("/:id/status", authenticateToken, requireAccess("tours"), updateTourStatus);
router.post("/:id/status", authenticateToken, requireAccess("tours"), updateTourStatus);
router.post("/:id/notes", authenticateToken, requireAccess("tours"), addTourNote);

export default router;
