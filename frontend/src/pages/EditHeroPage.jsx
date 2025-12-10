import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function EditHeroPage() {
  const { user, loading } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  // TOUS LES HOOKS EN HAUT DU COMPONENT
  const [nom, setNom] = useState("");
  const [alias, setAlias] = useState("");
  const [univers, setUnivers] = useState("");
  const [pouvoirs, setPouvoirs] = useState("");
  const [description, setDescription] = useState("");
  const [origine, setOrigine] = useState("");
  const [premiereApparition, setPremiereApparition] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [image, setImage] = useState(null);

  // CHARGEMENT DU HÉROS
  useEffect(() => {
    const loadHero = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5500/api/heroes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const hero = res.data;

        setNom(hero.nom);
        setAlias(hero.alias);
        setUnivers(hero.univers);
        setPouvoirs(hero.pouvoirs.join(";"));
        setDescription(hero.description);
        setOrigine(hero.origine);
        setPremiereApparition(hero.premiereApparition);
        setCurrentImage(hero.image);
      } catch (err) {
        console.error("Erreur de chargement :", err);
      }
    };

    loadHero();
  }, [id]);

  // APRÈS tous les hooks → on peut faire les retours conditionnels

  if (loading) {
    return <p style={{ padding: 20 }}>Chargement...</p>;
  }

  if (user?.role !== "admin") {
    return (
      <div style={{ padding: 20 }}>
        <h2>Accès interdit</h2>
        <p>Seul un administrateur peut modifier un héros.</p>
      </div>
    );
  }

  // FORMULAIRE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("nom", nom);
      formData.append("alias", alias);
      formData.append("univers", univers);
      formData.append("pouvoirs", pouvoirs);
      formData.append("description", description);
      formData.append("origine", origine);
      formData.append("premiereApparition", premiereApparition);
      if (image) formData.append("image", image);

      await axios.put(`http://localhost:5500/api/heroes/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Héros modifié !");
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification du héros.");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Modifier le Héros</h1>

      {currentImage && (
        <img
          src={`http://localhost:5500/${currentImage}`}
          alt="Hero"
          style={{ width: 180, borderRadius: 8, marginBottom: 20 }}
        />
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input value={nom} onChange={(e) => setNom(e.target.value)} style={styles.input} required />
        <input value={alias} onChange={(e) => setAlias(e.target.value)} style={styles.input} />
        <input value={univers} onChange={(e) => setUnivers(e.target.value)} style={styles.input} required />
        <textarea value={pouvoirs} onChange={(e) => setPouvoirs(e.target.value)} style={styles.textarea} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={styles.textarea} />
        <input value={origine} onChange={(e) => setOrigine(e.target.value)} style={styles.input} />
        <input value={premiereApparition} onChange={(e) => setPremiereApparition(e.target.value)} style={styles.input} />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />

        <button type="submit" style={styles.btn}>Modifier</button>
      </form>
    </div>
  );
}

const styles = {
  container: { padding: 30, maxWidth: 600, margin: "auto" },
  form: { display: "flex", flexDirection: "column", gap: 15 },
  input: { padding: 10 },
  textarea: { padding: 10, height: 80 },
  btn: {
    padding: "12px 20px",
    cursor: "pointer",
    background: "orange",
    color: "white",
    border: "none",
    borderRadius: 5,
  },
};

export default EditHeroPage;
