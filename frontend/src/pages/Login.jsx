import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store session credentials
        localStorage.setItem("w12_token", data.token);
        localStorage.setItem("w12_user", JSON.stringify(data.user));
        
        navigate("/dashboard");
      } else {
        setError(data.message || "Ongeldig e-mailadres of wachtwoord.");
      }
    } catch (err) {
      setError("Kan geen verbinding maken met de server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div className="card animate-slide" style={{ width: "100%", maxWidth: "460px" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "8px", textAlign: "center" }}>Welkom terug! 👋</h2>
          <p style={{ color: "var(--text)", textAlign: "center", marginBottom: "28px" }}>
            Log in op je Windkracht-12 account.
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", borderRadius: "8px", padding: "12px", fontSize: "14px", marginBottom: "16px", textAlign: "left" }}>
                ⚠️ {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">E-mailadres</label>
              <input
                type="email"
                required
                placeholder="bijv. email@voorbeeld.nl"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Wachtwoord</label>
              <input
                type="password"
                required
                placeholder="Je wachtwoord..."
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "12px" }}
            >
              {loading ? "Inloggen..." : "Inloggen"}
            </button>

            <div style={{ marginTop: "24px", fontSize: "14px", textAlign: "center", color: "var(--slate-400)" }}>
              Nog geen account? <Link to="/register" style={{ fontWeight: "700", color: "var(--primary)" }}>Registreer nu</Link>
            </div>
            

          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
