import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get(
  "/me",
  protect,
  authorizeRoles("citizen", "admin", "crew"),
  (req, res) => {
    res.status(200).json({
      message: "Access granted",
      user: req.user
    });
  }
);

export default router;
