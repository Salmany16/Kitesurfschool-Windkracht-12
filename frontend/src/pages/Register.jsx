import { useState } from "react";
import Navbar from "../components/Navbar";

function Register() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setEmail("");
      } else {
        setError(data.message || "Er is een fout opgetreden bij de registratie.");
      }
    } catch (err) {
      setError("Er kan geen verbinding worden gemaakt met de server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div className="card animate-slide" style={{ width: "100%", maxWidth: "480px" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "8px", textAlign: "center" }}>Word een Kiter! 🏄‍♂️</h2>
          <p style={{ color: "var(--text)", textAlign: "center", marginBottom: "28px" }}>
            Registreer je gratis om lessen te boeken en je reserveringen te beheren.
          </p>

          {message ? (
            <div style={{ background: "var(--primary-light)", border: "1px solid var(--primary)", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📬</div>
              <h4 style={{ margin: "0 0 8px", color: "var(--primary)" }}>Activatie-e-mail verzonden!</h4>
              <p style={{ fontSize: "14px", color: "var(--text-title)" }}>
                {message}
              </p>
              <div style={{ marginTop: "16px", background: "var(--slate-100)", borderRadius: "8px", padding: "10px", fontSize: "13px" }}>
                💡 <b>Tip voor testen:</b> Open de pagina <a href="/mailbox" target="_blank" rel="noopener noreferrer"><b>/mailbox</b></a> om de welkomstmail te bekijken en je account te activeren!
              </div>
            </div>
          ) : (
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

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "8px" }}
              >
                {loading ? "Registratie starten..." : "Account aanmaken"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default Register;
