import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function AddHeroPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [alias, setAlias] = useState("");
  const [univers, setUnivers] = useState("");
  const [pouvoirs, setPouvoirs] = useState("");
  const [description, setDescription] = useState("");
  const [origine, setOrigine] = useState("");
  const [premiereApparition, setPremiereApparition] = useState("");
  const [image, setImage] = useState(null);

  // 🔒 Accès seulement pour les admins
  if (user?.role !== "admin") {
    return (
      <div style={{ padding: 20 }}>
        <h2>Accès interdit</h2>
        <p>Vous devez être administrateur pour ajouter un héros.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Veuillez choisir une image !");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("nom", nom);
      formData.append("alias", alias);
      formData.append("univers", univers.trim()); // ✔ univers normalisé
      formData.append("pouvoirs", pouvoirs); // ex: "Force;Vitesse"
      formData.append("description", description);
      formData.append("origine", origine);
      formData.append("premiereApparition", premiereApparition);
      formData.append("image", image);

      await axios.post("http://localhost:5500/api/heroes", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Héros ajouté !");
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout du héros.");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Ajouter un Super-Héros</h1>

      <form onSubmit={handleSubmit} style={styles.form}>

        <input type="text" placeholder="Nom"
          value={nom} onChange={(e) => setNom(e.target.value)}
          style={styles.input} required />

        <input type="text" placeholder="Alias"
          value={alias} onChange={(e) => setAlias(e.target.value)}
          style={styles.input} />

        {/* ✔ LISTE DÉROULANTE POUR UNIVER — CORRIGÉ */}
        <select
          value={univers}
          onChange={(e) => setUnivers(e.target.value)}
          style={styles.input}
          required
        >
          <option value="">Choisir un univers</option>
          <option value="Marvel">Marvel</option>
          <option value="DC">DC</option>
          <option value="Autre">Autre</option>
        </select>

        <textarea placeholder="Pouvoirs (séparés par ;)"
          value={pouvoirs} onChange={(e) => setPouvoirs(e.target.value)}
          style={styles.textarea} />

        <textarea placeholder="Description"
          value={description} onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea} />

        <input type="text" placeholder="Origine"
          value={origine} onChange={(e) => setOrigine(e.target.value)}
          style={styles.input} />

        <input type="text" placeholder="Première apparition"
          value={premiereApparition} onChange={(e) => setPremiereApparition(e.target.value)}
          style={styles.input} />

        <input type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*" style={styles.input} required />

        <button type="submit" style={styles.btn}>Ajouter</button>

      </form>
    </div>
  );
}

const styles = {
  container: { padding: 30, maxWidth: 500, margin: "auto" },
  form: { display: "flex", flexDirection: "column", gap: 15 },
  input: { padding: 10 },
  textarea: { padding: 10, height: 80 },
  btn: {
    padding: "10px 20px",
    cursor: "pointer",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: 5,
  }
};

export default AddHeroPage;
