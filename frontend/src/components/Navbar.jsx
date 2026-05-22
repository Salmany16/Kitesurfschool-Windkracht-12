import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("w12_token");
  const userJson = localStorage.getItem("w12_user");
  const user = userJson ? JSON.parse(userJson) : null;

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/auth/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error(err);
    }
    
    // Clear credentials
    localStorage.removeItem("w12_token");
    localStorage.removeItem("w12_user");
    navigate("/login");
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "owner":
        return "Eigenaar";
      case "instructor":
        return "Instructeur";
      case "customer":
        return "Klant";
      default:
        return "";
    }
  };

  return (
    <header className="navbar glass">
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/" className="navbar-brand">
          🌊 <span>Windkracht-12</span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Link to="/" style={{ fontWeight: "600", color: "var(--text-title)" }}>Home</Link>
          <Link to="/packages" style={{ fontWeight: "600", color: "var(--text-title)" }}>Pakketten</Link>
          <Link to="/locations" style={{ fontWeight: "600", color: "var(--text-title)" }}>Spots</Link>
          <Link to="/gallery" style={{ fontWeight: "600", color: "var(--text-title)" }}>Galerij</Link>
          
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "16px", borderLeft: "1px solid var(--border)", paddingLeft: "16px" }}>
              <Link to="/dashboard" className="btn btn-primary btn-sm">
                Dashboard
              </Link>
              <div style={{ fontSize: "14px", textAlign: "right" }}>
                <span style={{ fontWeight: "700", display: "block", color: "var(--text-title)", lineHeight: 1.1 }}>
                  {user.name || user.email}
                </span>
                <span className="badge badge-voorlopig" style={{ fontSize: "9px", padding: "2px 6px", marginTop: "2px", display: "inline-block" }}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ padding: "6px 12px" }}>
                Uitloggen
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", borderLeft: "1px solid var(--border)", paddingLeft: "16px" }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Inloggen
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Registreren
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
