import { Request, Response, NextFunction } from "express";

// Ce middleware vérifie que l'utilisateur connecté a un rôle donné (ex: admin).
export const roleMiddleware = (requiredRole: "admin" | "editor") => {
  return (req: Request, res: Response, next: NextFunction) => {
    
    // req.user est défini par authMiddleware (après vérification du token JWT)
    const user = (req as any).user;

    // Vérifie que l'utilisateur existe et qu'il a un rôle
    if (!user || !user.role) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // Vérifie si l'utilisateur a les permissions nécessaires
    if (user.role !== requiredRole) {
      return res.status(403).json({ message: "Accès interdit : rôle insuffisant" });
    }

    next(); // L'utilisateur a le bon rôle → on continue
  };
};
