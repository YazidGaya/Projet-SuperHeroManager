import express from "express";
import {
  getHeroes,
  getHeroById,
  createHero,
  updateHero,
  deleteHero
} from "../controllers/heroController";

import { authMiddleware } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = express.Router();

// Lecture : accessible par tout le monde
router.get("/", getHeroes);
router.get("/:id", getHeroById);

// Création : accessible aux admins
router.post("/", authMiddleware, roleMiddleware("admin"), upload.single("image"), createHero);

// Modification : accessible aux admins
router.put("/:id", authMiddleware, roleMiddleware("admin"), upload.single("image"), updateHero);

// Suppression : accessible uniquement aux admins
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteHero);

export default router;
