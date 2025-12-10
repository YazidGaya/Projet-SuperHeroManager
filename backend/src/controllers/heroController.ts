import { Request, Response } from "express";
import { Hero } from "../models/Hero";
import fs from "fs";
import path from "path";

/* ============================================================
   🔍 Récupérer TOUS les héros
   ============================================================ */
export const getHeroes = async (req: Request, res: Response) => {
  try {
    const heroes = await Hero.find();
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

/* ============================================================
   🔍 Récupérer un héros par ID
   ============================================================ */
export const getHeroById = async (req: Request, res: Response) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) return res.status(404).json({ message: "Héros non trouvé" });

    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

/* ============================================================
   ➕ Créer un héros (avec upload d'image)
   ============================================================ */
export const createHero = async (req: Request, res: Response) => {
  try {
    const { nom, alias, univers, pouvoirs, description, origine, premiereApparition } = req.body;

    // 🔥 Correction : conversion des pouvoirs (string "A;B;C" → tableau)
    let parsedPowers: string[] = [];

    if (typeof pouvoirs === "string") {
      parsedPowers = pouvoirs.split(";");
    } else if (Array.isArray(pouvoirs)) {
      parsedPowers = pouvoirs;
    }

    const newHero = await Hero.create({
      nom,
      alias,
      univers,
      pouvoirs: parsedPowers,
      description,
      origine,
      premiereApparition,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    res.status(201).json(newHero);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création", error });
  }
};

/* ============================================================
   ✏️ Modifier un héros (avec changement d'image)
   ============================================================ */
export const updateHero = async (req: Request, res: Response) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) return res.status(404).json({ message: "Héros non trouvé" });

    // 🔥 Si nouvelle image → supprimer l'ancienne
    if (req.file && hero.image) {
      const oldImagePath = path.join("uploads", hero.image.replace("/uploads/", ""));
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    // 🔥 Conversion des pouvoirs
    let parsedPowers = hero.pouvoirs;
    if (typeof req.body.pouvoirs === "string") {
      parsedPowers = req.body.pouvoirs.split(";");
    }

    const updatedHero = await Hero.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        pouvoirs: parsedPowers,
        image: req.file ? `/uploads/${req.file.filename}` : hero.image
      },
      { new: true }
    );

    res.json(updatedHero);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la modification", error });
  }
};

/* ============================================================
   🗑️ Supprimer un héros (avec suppression de l'image associée)
   ============================================================ */
export const deleteHero = async (req: Request, res: Response) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) return res.status(404).json({ message: "Héros non trouvé" });

    // 🔥 Supprimer l'image associée
    if (hero.image) {
      const filePath = path.join("uploads", hero.image.replace("/uploads/", ""));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await hero.deleteOne();
    res.json({ message: "Héros supprimé" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression", error });
  }
};
