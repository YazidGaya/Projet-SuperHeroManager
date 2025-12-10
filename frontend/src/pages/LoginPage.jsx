import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // ⬅️ Import CORRECT ici

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ⬅️ on utilise AuthContext maintenant

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(username, password); // ⬅️ on appelle le contexte

      navigate("/dashboard"); // ⬅️ redirection OK
    } catch (err) {
      console.error(err);
      setError("Identifiants incorrects");
    }
  };

  return (
    <div style={{ marginTop: "120px", textAlign: "center" }}>
      <h2>Connexion</h2>

      <form onSubmit={handleLogin} style={{ width: "300px", margin: "0 auto" }}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Se connecter
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  },
  button: {
    padding: "10px",
    width: "100%",
    cursor: "pointer",
  },
};

export default LoginPage;
