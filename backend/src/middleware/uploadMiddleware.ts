import multer from "multer";
import path from "path";

// Dossier où les fichiers seront enregistrés
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Le fichier sera sauvegardé dans /uploads (un dossier à créer si pas présent)
    cb(null, path.join(__dirname, "..", "uploads"));
  },

  filename: (req, file, cb) => {
    // On crée un nom unique pour éviter les collisions
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname)); // On garde l'extension
  }
});

// Filtre pour n'accepter que les images
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accepté
  } else {
    cb(new Error("Format de fichier non autorisé"), false);
  }
};

// On limite la taille du fichier à 5 Mo
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});
