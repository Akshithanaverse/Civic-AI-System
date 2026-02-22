import express from "express";
import {
  getAssignedIssues,
  createIssue,
  getAllIssues,
  assignIssue,
  updateIssueStatus,
  getMyIssues
} from "../controllers/issue.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import multer from "multer";

const router = express.Router();

// Multer config to handle image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Citizen creates issue with optional image
router.post(
  "/",
  protect,
  authorizeRoles("citizen"),
  upload.single("image"),
  createIssue
);

// Admin views all issues
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllIssues
);

// Admin assigns crew
router.put(
  "/:id/assign",
  protect,
  authorizeRoles("admin"),
  assignIssue
);

// Crew updates status
router.put(
  "/:id/status",
  protect,
  authorizeRoles("crew"),
  updateIssueStatus
);

router.get("/my", protect, getMyIssues);

router.get(
  "/assigned",
  protect,
  authorizeRoles("crew"),
  getAssignedIssues
);

export default router;