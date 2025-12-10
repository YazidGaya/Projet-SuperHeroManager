import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "../config/db";
import { Hero } from "../models/Hero";

dotenv.config();

const run = async () => {
  await connectDB();

  const filePath = path.join(__dirname, "..", "uploads", "SuperHerosComplet.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  // Formatage des données selon ton modèle Hero
  const formatted = data.superheros.map((h: any) => ({
    nom: h.name || "Nom inconnu",
    alias: h.biography?.fullName || "",
    univers:
    h.biography?.publisher?.includes("Marvel") ? "Marvel" :
    h.biography?.publisher?.includes("DC") ? "DC" :
    "Autre",

    pouvoirs: [
      `Intelligence: ${h.powerstats?.intelligence}`,
      `Force: ${h.powerstats?.strength}`,
      `Vitesse: ${h.powerstats?.speed}`,
      `Durabilité: ${h.powerstats?.durability}`,
      `Puissance: ${h.powerstats?.power}`,
      `Combat: ${h.powerstats?.combat}`
    ],
    description: h.biography?.aliases?.join(", ") || "",
    image: h.images?.md || "",
    origine: h.biography?.placeOfBirth || "",
    premiereApparition: h.biography?.firstAppearance || ""
  }));

  await Hero.deleteMany({});
  await Hero.insertMany(formatted);

  console.log("✅ Base de héros importée !");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
