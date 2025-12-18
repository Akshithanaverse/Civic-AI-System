import express from "express";
import {
  createIssue,
  getAllIssues,
  assignIssue,
  updateIssueStatus
} from "../controllers/issue.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Citizen creates issue
router.post(
  "/",
  protect,
  authorizeRoles("citizen"),
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

export default router;
