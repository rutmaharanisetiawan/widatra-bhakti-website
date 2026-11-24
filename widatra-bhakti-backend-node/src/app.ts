import path from "path";
import fs from "fs";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { STORAGE_ROOT } from "./config/storage.js";
import { authRouter } from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import csrRoutes from "./routes/csrRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import communityEventRoutes from "./routes/communityEventRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import {
  getCompanyProfile,
  updateCompanyProfile,
} from "./controllers/companyProfileController.js";
import {
  getFactoryTourContent,
  updateFactoryTourContent,
} from "./controllers/factoryTourContentController.js";
import { showAdminArticle } from "./controllers/articleController.js";
import { showAdminCsrProgram } from "./controllers/csrProgramController.js";
import { showAdminJobPosting } from "./controllers/jobPostingController.js";
import { authenticateToken } from "./middleware/auth.js";
import { requireAccess } from "./policies/access.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();

// Security and utility middleware
app.use(helmet({ crossOriginResourcePolicy: false }));

const allowedOrigins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all during dev/migration
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Serve shared public uploads statically (identical to Laravel public disk)
app.use("/storage", express.static(STORAGE_ROOT));

// Fallback for seed assets from frontend src/assets
const feAssetsCandidate = path.resolve(STORAGE_ROOT, "../../../../widatra-bhakti-fe/src/assets");
const feAssetsFallback = fs.existsSync(feAssetsCandidate)
  ? feAssetsCandidate
  : path.resolve(process.cwd(), "../widatra-bhakti-fe/src/assets");

if (fs.existsSync(feAssetsFallback)) {
  app.use("/storage/seed", express.static(feAssetsFallback));
}

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "PT Widatra Bhakti Node.js Backend",
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/csr-programs", csrRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/tour-bookings", tourRoutes);
app.use("/api/community-events", communityEventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/contact-inquiries", contactRoutes);
app.use("/api/chat", chatbotRoutes);

// Admin single-item preview endpoints
app.get("/api/admin/articles/:slug", authenticateToken, requireAccess("articles"), showAdminArticle);
app.get("/api/admin/csr-programs/:slug", authenticateToken, requireAccess("articles"), showAdminCsrProgram);
app.get("/api/admin/jobs/:slug", authenticateToken, requireAccess("hr"), showAdminJobPosting);

// Company Profile & Factory Tour Content CMS
app.get("/api/company-profile", getCompanyProfile);
app.put("/api/company-profile", authenticateToken, requireAccess("content"), updateCompanyProfile);

app.get("/api/factory-tour-content", getFactoryTourContent);
app.put("/api/factory-tour-content", authenticateToken, requireAccess("content"), updateFactoryTourContent);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    message: `Endpoint ${req.method} ${req.path} tidak ditemukan.`,
  });
});

// Global error handler (converts Multer, Zod, Prisma, and HttpErrors to Laravel shapes)
app.use(errorHandler);
