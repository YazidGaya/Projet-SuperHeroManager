// frontend/src/context/AuthProvider.jsx

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContextBase";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ============================================================
     🎯 Fonction pour charger l'utilisateur via /auth/me
     ============================================================ */
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5500/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`, // 🔥 Token envoyé correctement
        },
      });

      setUser(res.data); // utilisateur chargé
    } catch (err) {
      console.error("Erreur AuthContext /auth/me :", err);
      
      // ❗ On NE supprime plus le token ici
      // Cela évite les "Token manquant" qui apparaissaient pour rien
      // localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ============================================================
     🚀 Charger l'utilisateur au montage du provider
     ============================================================ */
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /* ============================================================
     🔐 Login
     ============================================================ */
  const login = async (username, password) => {
    const res = await axios.post("http://localhost:5500/api/auth/login", {
      username,
      password,
    });

    localStorage.setItem("token", res.data.token);
    await loadUser(); // recharge l'utilisateur après connexion
  };

  /* ============================================================
     🚪 Logout
     ============================================================ */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  /* ============================================================
     🧩 Retour du provider
     ============================================================ */
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children} {/* Affiche l'app seulement quand auth OK */}
    </AuthContext.Provider>
  );
}
