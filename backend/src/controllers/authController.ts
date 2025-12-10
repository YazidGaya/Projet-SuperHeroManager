import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;

// ========================= REGISTER =========================
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;

    // Vérifier que l'utilisateur n'existe pas déjà
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }

    // Hash du mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Création utilisateur
    const user = await User.create({
      username,
      passwordHash,
      role: role ?? "editor", // editor par défaut
    });

    // Génération d'un token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ message: "Utilisateur créé", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
};

//LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log("LOGIN BODY =", req.body);
    // Trouver l'utilisateur
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Utilisateur introuvable" });
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    // Génération d'un token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ message: "Connexion réussie", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};

// ========================= ME =========================
export const me = async (req: Request, res: Response) => {
  try {
    // req.user est ajouté par authMiddleware
    const userData = (req as any).user;

    if (!userData) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const user = await User.findById(userData.id).select("-passwordHash");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération du profil" });
  }
};
