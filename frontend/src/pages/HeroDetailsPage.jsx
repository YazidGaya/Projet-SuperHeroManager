import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

function HeroDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [hero, setHero] = useState(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`http://localhost:5500/api/heroes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setHero(res.data);
      } catch (err) {
        console.error("Erreur récupération héros :", err);
      }
    };

    fetchHero();
  }, [id]);

  if (!hero) {
    return <h2 style={{ textAlign: "center" }}>Chargement...</h2>;
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        ← Retour
      </button>

      <h1>{hero.nom}</h1>

      <img
        src={`http://localhost:5500/${hero.image}`}
        alt={hero.nom}
        style={styles.image}
      />

      <p><strong>Alias :</strong> {hero.alias}</p>
      <p><strong>Univers :</strong> {hero.univers}</p>
      <p><strong>Origine :</strong> {hero.origine}</p>
      <p><strong>Première apparition :</strong> {hero.premiereApparition}</p>

      <h3>Pouvoirs</h3>
      <ul>
        {hero.pouvoirs.map((p, index) => (
          <li key={index}>{p}</li>
        ))}
      </ul>

      <h3>Description</h3>
      <p>{hero.description}</p>

      {user?.role === "admin" && (
        <button
          onClick={() => navigate(`/edit-hero/${hero._id}`)}
          style={styles.editBtn}
        >
          Modifier le héros
        </button>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "20px", maxWidth: "800px", margin: "auto" },
  image: {
    width: "300px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  backBtn: {
    padding: "8px 12px",
    marginBottom: "15px",
    cursor: "pointer",
  },
  editBtn: {
    background: "blue",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default HeroDetailsPage;
