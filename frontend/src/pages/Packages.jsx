import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Packages() {
  const token = localStorage.getItem("w12_token");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback packages if the backend is loading or unreachable
  const fallbackPackages = [
    {
      id: 1,
      name: "Privéles 2,5 uur",
      duration_hours: 2.5,
      price: 175.0,
      max_persons: 1,
      lessons_count: 1,
      description: "De ultieme 1-op-1 kitesurfervaring. Alle aandacht van de instructeur is op jou gericht om je techniek vliegensvlug te verbeteren.",
      features: [
        "100% persoonlijke aandacht",
        "Wetsuit, kite en board inbegrepen",
        "Geschikt voor absolute beginners & gevorderden",
        "IKO-gecertificeerde instructeur",
        "Locatie naar keuze"
      ]
    },
    {
      id: 2,
      name: "Losse Duo Kiteles 3,5 uur",
      duration_hours: 3.5,
      price: 135.0,
      max_persons: 2,
      lessons_count: 1,
      description: "Gezellig samen met een vriend, partner of familielid het water op! Een langere les zodat jullie allebei ruim voldoende vaartijd krijgen.",
      features: [
        "Samen leren met je surfmaatje",
        "Extra lange lesduur (3,5 uur)",
        "Volledige uitrusting inbegrepen",
        "Veiligheid voorop met portofoon-begeleiding",
        "Prijs is per persoon"
      ]
    },
    {
      id: 3,
      name: "Kitesurf Duo lespakket 3 lessen (10,5 uur)",
      duration_hours: 10.5,
      price: 375.0,
      max_persons: 2,
      lessons_count: 3,
      description: "Het meest gekozen pakket voor beginners. In drie uitgebreide duolessen leer je zelfstandig de kite te besturen, te bodydraggen en maak je de eerste meters op het board.",
      features: [
        "3 uitgebreide duolessen van 3,5 uur",
        "Flexibel in te plannen over het seizoen",
        "Systematische opbouw volgens IKO-richtlijnen",
        "Inclusief theorie, veiligheid & praktijk",
        "Beste prijs-kwaliteitverhouding"
      ]
    },
    {
      id: 4,
      name: "Kitesurf Duo lespakket 5 lessen (17,5 uur)",
      duration_hours: 17.5,
      price: 675.0,
      max_persons: 2,
      lessons_count: 5,
      description: "Van absolute beginner tot zelfstandige kiter. Met dit complete 5-daagse duotraject garanderen we dat je zelfstandig en veilig de Noordzee op kunt met je eigen spullen.",
      features: [
        "5 volledige duolessen van 3,5 uur",
        "Hoogste slagingspercentage naar zelfstandigheid",
        "Gedetailleerde IKO-certificering aan het eind",
        "Leren varen in verschillende windrichtingen",
        "Inclusief hulp bij aanschaf eigen materiaal"
      ]
    }
  ];

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/metadata");
        if (res.ok) {
          const data = await res.json();
          // Map backend packages to include nice descriptions and feature lists
          const decorated = data.packages.map((pkg) => {
            const fallback = fallbackPackages.find((f) => f.name.toLowerCase().includes(pkg.name.toLowerCase()) || pkg.id === f.id);
            return {
              ...pkg,
              description: fallback ? fallback.description : "Kwalitatieve kitesurflessen onder begeleiding van onze ervaren instructeurs.",
              features: fallback ? fallback.features : ["Inclusief professionele kitespullen & wetsuit", "IKO-gecertificeerde begeleiding", "Flexibele planning"]
            };
          });
          setPackages(decorated);
        } else {
          setPackages(fallbackPackages);
        }
      } catch (err) {
        setPackages(fallbackPackages);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <>
      <Navbar />

      {/* Header Banner */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        padding: "60px 24px",
        textAlign: "center",
      }}>
        <div className="container animate-slide">
          <h1 style={{ fontSize: "40px", marginBottom: "12px", color: "white" }}>Onze Kitesurf Lespakketten</h1>
          <p style={{ maxWidth: "600px", margin: "0 auto", color: "var(--slate-400)", fontSize: "16px" }}>
            Of je nu kiest voor de maximale aandacht van een privéles of de gezelligheid van een duo-les met je beste vriend, 
            bij Windkracht-12 vind je het perfecte lespakket.
          </p>
        </div>
      </section>

      {/* Packages Grid */}
      <section style={{ padding: "60px 24px" }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", fontSize: "18px" }}>Pakketten laden... 🏄‍♂️</div>
          ) : (
            <div className="grid grid-2" style={{ gap: "40px" }}>
              {packages.map((pkg) => (
                <div key={pkg.id} className="card glass animate-slide" style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "40px",
                  borderRadius: "24px",
                  boxShadow: "var(--shadow-lg)",
                  position: "relative",
                  overflow: "hidden",
                  borderLeft: pkg.max_persons > 1 ? "6px solid var(--secondary)" : "6px solid var(--primary)",
                }}>
                  
                  {/* Badge */}
                  <div style={{ position: "absolute", top: "24px", right: "24px" }}>
                    <span className={`badge ${pkg.max_persons === 1 ? 'badge-definitief' : 'badge-voorlopig'}`} style={{ fontSize: "12px", padding: "6px 12px" }}>
                      {pkg.max_persons === 1 ? "🧑 Privé" : "👥 Duo"}
                    </span>
                  </div>

                  <div>
                    <h2 style={{ fontSize: "24px", marginBottom: "8px", color: "var(--text-title)", paddingRight: "80px" }}>
                      {pkg.name}
                    </h2>
                    
                    {/* Price Tag */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "6px", margin: "16px 0 20px 0" }}>
                      <span style={{ fontSize: "36px", fontWeight: "800", color: "var(--text-title)" }}>
                        €{parseFloat(pkg.price).toFixed(2)}
                      </span>
                      <span style={{ color: "var(--slate-400)", fontSize: "14px" }}>
                        {pkg.max_persons > 1 ? "per persoon" : "totaal"}
                      </span>
                    </div>

                    <p style={{ color: "var(--text)", fontSize: "15px", marginBottom: "24px", lineHeight: "1.6" }}>
                      {pkg.description}
                    </p>

                    {/* Lesson Details */}
                    <div style={{ 
                      display: "flex", 
                      gap: "20px", 
                      background: "var(--slate-50)", 
                      padding: "12px 20px", 
                      borderRadius: "12px", 
                      marginBottom: "28px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "var(--slate-700)",
                      border: "1px solid var(--border)"
                    }}>
                      <span>⏱️ <b>{pkg.duration_hours} Uur</b> Totaal</span>
                      <span>📖 <b>{pkg.lessons_count} {pkg.lessons_count === 1 ? 'Les' : 'Lessen'}</b></span>
                    </div>

                    {/* Features List */}
                    <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "var(--text-title)" }}>Wat is inbegrepen:</h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--text)" }}>
                          <span style={{ color: pkg.max_persons > 1 ? "var(--secondary)" : "var(--primary)", fontWeight: "bold" }}>✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Booking CTA Button */}
                  <div>
                    {token ? (
                      <Link to="/dashboard" className={`btn ${pkg.max_persons > 1 ? 'btn-secondary' : 'btn-primary'}`} style={{ width: "100%", justifyContent: "center" }}>
                        🏄‍♂️ Nu inplannen op je Dashboard
                      </Link>
                    ) : (
                      <Link to="/register" className={`btn ${pkg.max_persons > 1 ? 'btn-secondary' : 'btn-primary'}`} style={{ width: "100%", justifyContent: "center" }}>
                        🚀 Registreer & Boek Nu
                      </Link>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quality Standards Banner */}
      <section style={{ background: "var(--slate-50)", padding: "60px 24px", borderTop: "1px solid var(--border)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", marginBottom: "12px" }}>Bij ons ben je in veilige handen</h2>
          <p style={{ maxWidth: "600px", margin: "0 auto 40px auto", color: "var(--text)" }}>
            Al onze lessen voldoen aan de strengste internationale veiligheids- en IKO-kwaliteitseisen.
          </p>
          <div className="grid grid-3" style={{ gap: "24px" }}>
            <div style={{ padding: "20px" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>🛡️</div>
              <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Veiligheid Eerst</h3>
              <p style={{ fontSize: "14px", color: "var(--text)" }}>
                Wij varen uitsluitend met gecertificeerde helmen, impactvesten en moderne safety-systems op onze kites.
              </p>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>📻</div>
              <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Portofoon Begeleiding</h3>
              <p style={{ fontSize: "14px", color: "var(--text)" }}>
                Je staat continu via een radioverbinding in contact met je instructeur. Zo krijg je direct tips in het water!
              </p>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>🌬️</div>
              <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Flexibel Weergarantie</h3>
              <p style={{ fontSize: "14px", color: "var(--text)" }}>
                Te weinig wind of storm? Lessen worden direct kosteloos geannuleerd en je plant direct een nieuwe datum in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: "var(--slate-900)",
        color: "rgba(255,255,255,0.7)",
        padding: "40px 24px",
        textAlign: "center",
        fontSize: "14px",
        borderTop: "1.5px solid var(--border)"
      }}>
        <div className="container">
          <p>© {new Date().getFullYear()} Kitesurfschool Windkracht-12. Alle rechten voorbehouden.</p>
        </div>
      </footer>
    </>
  );
}

export default Packages;