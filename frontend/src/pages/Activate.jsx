import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Activate() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Live password checks
  const hasMinLen = password.length >= 12;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const matches = password === passwordConfirm && password !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasMinLen || !hasUpper || !hasNumber || !hasSpecial) {
      setError("Wachtwoord voldoet niet aan alle eisen.");
      return;
    }
    if (!matches) {
      setError("Wachtwoorden komen niet overeen.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          password_confirmation: passwordConfirm,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        // Save user & token in localStorage to complete autologin!
        localStorage.setItem("w12_token", data.token);
        localStorage.setItem("w12_user", JSON.stringify(data.user));
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setError(data.message || "Activering mislukt.");
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
        <div className="card animate-slide" style={{ width: "100%", maxWidth: "520px" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "8px", textAlign: "center" }}>Account Activeren 🔑</h2>
          <p style={{ color: "var(--text)", textAlign: "center", marginBottom: "28px" }}>
            Stel een sterk wachtwoord in om je registratie bij Windkracht-12 te voltooien.
          </p>

          {success ? (
            <div style={{ background: "#d1fae5", border: "1px solid #10b981", color: "#065f46", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎉</div>
              <h4 style={{ margin: "0 0 8px" }}>Activering voltooid!</h4>
              <p style={{ fontSize: "14px" }}>
                Je bent succesvol geregistreerd en automatisch ingelogd. We sturen je nu door naar je dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", borderRadius: "8px", padding: "12px", fontSize: "14px", marginBottom: "16px", textAlign: "left" }}>
                  ⚠️ {error}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Kies Wachtwoord</label>
                <input
                  type="password"
                  required
                  placeholder="Minimaal 12 tekens..."
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bevestig Wachtwoord</label>
                <input
                  type="password"
                  required
                  placeholder="Herhaal je gekozen wachtwoord..."
                  className="form-control"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Password Requirements Checkbox List */}
              <div style={{ background: "var(--slate-50)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", margin: "20px 0", textAlign: "left" }}>
                <h4 style={{ fontSize: "14px", margin: "0 0 10px", color: "var(--text-title)" }}>Wachtwoord Eisen:</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: hasMinLen ? "#10b981" : "var(--slate-400)", fontWeight: hasMinLen ? "600" : "normal" }}>
                    <span>{hasMinLen ? "✓" : "○"}</span> Minimaal 12 tekens ({password.length}/12)
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: hasUpper ? "#10b981" : "var(--slate-400)", fontWeight: hasUpper ? "600" : "normal" }}>
                    <span>{hasUpper ? "✓" : "○"}</span> Minimaal 1 hoofdletter
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: hasNumber ? "#10b981" : "var(--slate-400)", fontWeight: hasNumber ? "600" : "normal" }}>
                    <span>{hasNumber ? "✓" : "○"}</span> Minimaal 1 cijfer
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: hasSpecial ? "#10b981" : "var(--slate-400)", fontWeight: hasSpecial ? "600" : "normal" }}>
                    <span>{hasSpecial ? "✓" : "○"}</span> Minimaal 1 leesteken (bijv. @, #, $, !, ?)
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: matches ? "#10b981" : "var(--slate-400)", fontWeight: matches ? "600" : "normal" }}>
                    <span>{matches ? "✓" : "○"}</span> Wachtwoorden komen overeen
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !hasMinLen || !hasUpper || !hasNumber || !hasSpecial || !matches}
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "8px" }}
              >
                {loading ? "Activeren..." : "Wachtwoord opslaan & Inloggen"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default Activate;
