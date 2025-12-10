import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [heroes, setHeroes] = useState([]);

  // Filtres
  const [search, setSearch] = useState("");
  const [universeFilter, setUniverseFilter] = useState("all");
  const [sortType, setSortType] = useState("none");

  // Charger les héros
  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5500/api/heroes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setHeroes(res.data);
      } catch (err) {
        console.error("Erreur chargement héros :", err);
      }
    };

    fetchHeroes();
  }, []);

  // Déconnexion
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Supprimer un héros
  const deleteHero = async (heroId) => {
    if (!confirm("Voulez-vous vraiment supprimer ce héros ?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5500/api/heroes/${heroId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHeroes(heroes.filter((h) => h._id !== heroId));
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Suppression impossible.");
    }
  };

  /* -----------------------------------------
     🔍 Application des filtres + tri
  ------------------------------------------ */
  const filteredHeroes = heroes
    .filter((h) =>
      (h.nom + " " + (h.alias || ""))
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((h) =>
      universeFilter === "all" ? true : h.univers === universeFilter
    )
    .sort((a, b) => {
      if (sortType === "alpha") return a.nom.localeCompare(b.nom);
      if (sortType === "recent")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortType === "old")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  return (
    <div style={styles.container}>
      <h1>Liste des Super-Héros</h1>

      <p>
        Connecté en tant que : <strong>{user?.username}</strong> ({user?.role})
      </p>

      <button onClick={handleLogout} style={styles.logoutBtn}>
        Se déconnecter
      </button>

      {user?.role === "admin" && (
        <button
          onClick={() => navigate("/add-hero")}
          style={styles.addBtn}
        >
          ➕ Ajouter un héros
        </button>
      )}

      {/* 🔎 Barres de filtres */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Rechercher un héros..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={universeFilter}
          onChange={(e) => setUniverseFilter(e.target.value)}
          style={styles.input}
        >
          <option value="all">Tous</option>
          <option value="Marvel">Marvel</option>
          <option value="DC">DC</option>
          <option value="Autre">Autre</option>
        </select>

        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          style={styles.input}
        >
          <option value="none">Aucun tri</option>
          <option value="alpha">Ordre alphabétique</option>
          <option value="recent">Plus récents</option>
          <option value="old">Plus anciens</option>
        </select>
      </div>

      {/* 🦸 Affichage des héros */}
      <div style={styles.grid}>
        {filteredHeroes.map((hero) => (
          <div key={hero._id} style={styles.card}>
            
            {/* 🔥 Correcteur d'URL des images */}
            <img
              src={
                hero.image?.startsWith("md/")
                  ? `http://localhost:5500/${hero.image}`
                  : `http://localhost:5500${hero.image}` // pour /uploads/...
              }
              alt={hero.nom}
              style={{ width: "150px", borderRadius: "8px" }}
            />

            <h3>{hero.nom}</h3>
            <p><strong>Alias :</strong> {hero.alias}</p>

            {/* Bouton détails */}
            <button
              onClick={() => navigate(`/hero/${hero._id}`)}
              style={styles.detailsBtn}
            >
              Voir détails
            </button>

            {/* Modifier */}
            {user?.role === "admin" && (
              <button
                onClick={() => navigate(`/edit-hero/${hero._id}`)}
                style={styles.editBtn}
              >
                Modifier
              </button>
            )}

            {/* Supprimer */}
            {user?.role === "admin" && (
              <button
                onClick={() => deleteHero(hero._id)}
                style={styles.deleteBtn}
              >
                Supprimer
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px", textAlign: "center" },

  filters: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "20px",
  },

  input: { padding: "8px", borderRadius: "5px" },

  grid: {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },

  card: {
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "8px",
    background: "#fafafa",
  },

  detailsBtn: {
    background: "gray",
    color: "white",
    border: "none",
    padding: "8px",
    marginTop: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    width: "100%",
  },

  editBtn: {
    background: "blue",
    color: "white",
    border: "none",
    padding: "8px",
    marginTop: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    width: "100%",
  },

  deleteBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "8px",
    marginTop: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    width: "100%",
  },

  logoutBtn: {
    padding: "8px 12px",
    cursor: "pointer",
    marginBottom: "20px",
  },

  addBtn: {
    padding: "10px",
    marginBottom: "20px",
    cursor: "pointer",
  },
};

export default Dashboard;
