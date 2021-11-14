import authRoutes from "./authRoutes";
import eventRoutes from "./eventRoutes";
import express from 'express';
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/event", eventRoutes);

module.exports = router;
