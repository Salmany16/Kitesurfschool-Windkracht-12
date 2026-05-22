import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  const token = localStorage.getItem("w12_token");
  const userJson = localStorage.getItem("w12_user");
  const user = userJson ? JSON.parse(userJson) : null;

  // State for interactive wind calculator
  const [bft, setBft] = useState(5);

  const getWindAdvice = (scale) => {
    if (scale <= 2) {
      return {
        status: "Te weinig wind ❌",
        desc: "Minder dan 6 knopen wind. De kite kan helaas niet in de lucht blijven. Perfect om te relaxen op het strand, te suppen of theorie te leren!",
        color: "#94a3b8",
        bg: "rgba(148, 163, 184, 0.1)",
        action: "Geen les mogelijk",
      };
    } else if (scale === 3) {
      return {
        status: "Lichte bries 💨",
        desc: "7 - 10 knopen wind. Geschikt voor lichte kiters en het oefenen met een trainer-kite op het strand. Ideaal om de basisvaardigheden onder de knie te krijgen.",
        color: "#38bdf8",
        bg: "rgba(56, 189, 248, 0.1)",
        action: "Lichte training & Theorie",
      };
    } else if (scale >= 4 && scale <= 6) {
      return {
        status: "Perfecte surfwind ✨",
        desc: "11 - 27 knopen wind. Dit is de gouden standaard voor kitesurfen! Zeer stabiele wind. Lessen voor alle niveaus gaan gegarandeerd door op al onze kustspots.",
        color: "var(--success)",
        bg: "rgba(16, 185, 129, 0.1)",
        action: "Ideale lesomstandigheden!",
      };
    } else if (scale >= 7 && scale <= 9) {
      return {
        status: "Sterke wind / Stormachtig ⚠️",
        desc: "28 - 47 knopen wind. Extreme windkracht! Alleen geschikt voor zeer ervaren kiters en gevorderde cursisten met kleine kites. Beginnerslessen worden verplaatst.",
        color: "var(--warning)",
        bg: "rgba(245, 158, 11, 0.1)",
        action: "Alleen gevorderde lessen",
      };
    } else {
      return {
        status: "EXTREEM! WIND KRACHT 10+ 🚨",
        desc: "Meer dan 48 knopen wind. Levensgevaarlijk! Kitesurfen is ten strengste verboden op alle locaties. Alle geplande lessen worden direct kosteloos geannuleerd wegens veiligheid.",
        color: "var(--danger)",
        bg: "rgba(239, 68, 68, 0.1)",
        action: "Lessen automatisch geannuleerd",
      };
    }
  };

  const currentAdvice = getWindAdvice(bft);

  // Mock wind conditions for spots
  const spotConditions = [
    { name: "Zandvoort", wind: "18 Knopen", direction: "ZW", status: "Perfect (4 Bft)" },
    { name: "Muiderberg", wind: "14 Knopen", direction: "N", status: "Goed (3-4 Bft)" },
    { name: "Wijk aan Zee", wind: "21 Knopen", direction: "WZW", status: "Perfect (5 Bft)" },
    { name: "IJmuiden", wind: "20 Knopen", direction: "W", status: "Perfect (5 Bft)" },
    { name: "Scheveningen", wind: "22 Knopen", direction: "ZW", status: "Perfect (5 Bft)" },
    { name: "Hoek van Holland", wind: "17 Knopen", direction: "Z", status: "Goed (4 Bft)" },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Banner Section */}
      <section style={{
        position: "relative",
        background: "linear-gradient(135deg, #09203f 0%, #537895 100%)",
        color: "white",
        padding: "100px 24px 140px 24px",
        textAlign: "center",
        overflow: "hidden",
      }}>
        {/* Decorative Wave Wave overlay */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          overflow: "hidden",
          lineHeight: 0,
          transform: "rotate(180deg)",
        }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{
            position: "relative",
            display: "block",
            width: "calc(100% + 1.3px)",
            height: "60px",
          }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,70.05,25.24,121.81,42.28,169.65,58,221.39,70.52,321.39,56.44Z" 
              fill="var(--bg)"
            />
          </svg>
        </div>

        <div className="container animate-slide" style={{ maxWidth: "800px", zIndex: 2, position: "relative" }}>
          <span style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(8px)",
            padding: "8px 16px",
            borderRadius: "9999px",
            fontSize: "14px",
            fontWeight: "700",
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "var(--secondary)",
            display: "inline-block",
            marginBottom: "24px",
            border: "1px solid rgba(255,255,255,0.2)"
          }}>
            🌊 Kitesurfschool Windkracht-12
          </span>
          <h1 style={{
            fontSize: "52px",
            lineHeight: "1.15",
            fontWeight: "800",
            marginBottom: "24px",
            fontFamily: "var(--font-heading)",
            color: "white",
            textShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}>
            Bedwing de golven onder professionele begeleiding!
          </h1>
          <p style={{
            fontSize: "19px",
            lineHeight: "1.6",
            opacity: 0.9,
            marginBottom: "40px",
            fontWeight: "400",
            textShadow: "0 2px 6px rgba(0,0,0,0.2)"
          }}>
            Leren kitesurfen op 6 van de beste spots in Nederland met de top-instructeurs van Utrecht. 
            Plan flexibel je lessen in en ga veilig het water op!
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            {user ? (
              <Link to="/dashboard" className="btn btn-secondary" style={{ padding: "16px 36px", fontSize: "16px" }}>
                🏄‍♂️ Ga naar je Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-secondary" style={{ padding: "16px 36px", fontSize: "16px" }}>
                  🚀 Nu Registreren & Boeken
                </Link>
                <Link to="/packages" className="btn btn-outline" style={{ padding: "16px 36px", fontSize: "16px", color: "white", borderColor: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.08)" }}>
                  🔍 Bekijk Pakketten
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Live Wind Tracker Widget */}
      <section style={{ padding: "60px 24px", marginTop: "-50px", position: "relative", zIndex: 10 }}>
        <div className="container">
          <div className="card glass animate-slide" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "24px",
            padding: "24px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}>
            {spotConditions.map((spot, idx) => (
              <div key={idx} style={{
                padding: "16px",
                borderRight: idx < spotConditions.length - 1 ? "1px solid var(--border)" : "none",
                display: "flex",
                flexDirection: "column",
                gap: "4px"
              }}>
                <span style={{ fontWeight: "800", color: "var(--text-title)", fontSize: "16px" }}>{spot.name}</span>
                <span style={{ fontSize: "20px", fontWeight: "800", color: "var(--primary)" }}>{spot.wind}</span>
                <span style={{ fontSize: "12px", color: "var(--slate-400)" }}>Richting: {spot.direction}</span>
                <span className="badge badge-definitief" style={{ fontSize: "10px", marginTop: "6px", alignSelf: "center" }}>
                  {spot.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Guide Section */}
      <section style={{ padding: "60px 24px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "36px", marginBottom: "12px" }}>Hoe het werkt</h2>
          <p style={{ maxWidth: "600px", margin: "0 auto 48px auto", color: "var(--text)" }}>
            In 4 eenvoudige stappen sta je veilig en met vol zelfvertrouwen op de kitesurf plank!
          </p>

          <div className="grid grid-4">
            <div className="card" style={{ padding: "28px", textAlign: "left", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: "800",
              }}>
                1
              </div>
              <h3 style={{ fontSize: "19px", margin: 0 }}>Online Registreren</h3>
              <p style={{ fontSize: "14px", margin: 0, color: "var(--text)" }}>
                Maak simpel een Windkracht-12 account aan. Activeer je account direct via de ontvangen activatiemail.
              </p>
            </div>

            <div className="card" style={{ padding: "28px", textAlign: "left", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "var(--secondary-light)",
                color: "var(--secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: "800",
              }}>
                2
              </div>
              <h3 style={{ fontSize: "19px", margin: 0 }}>Kies Pakket & Spot</h3>
              <p style={{ fontSize: "14px", margin: 0, color: "var(--text)" }}>
                Kies uit privéles of voordeligere duo lespakketten. Selecteer een van onze 6 gecertificeerde spots.
              </p>
            </div>

            <div className="card" style={{ padding: "28px", textAlign: "left", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: "800",
              }}>
                3
              </div>
              <h3 style={{ fontSize: "19px", margin: 0 }}>Plan je Data</h3>
              <p style={{ fontSize: "14px", margin: 0, color: "var(--text)" }}>
                Kies direct de gewenste lesdata in de kalender op je dashboard. Zodra je betaling is voltooid, is je les definitief!
              </p>
            </div>

            <div className="card" style={{ padding: "28px", textAlign: "left", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "var(--secondary-light)",
                color: "var(--secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: "800",
              }}>
                4
              </div>
              <h3 style={{ fontSize: "19px", margin: 0 }}>Het water op!</h3>
              <p style={{ fontSize: "14px", margin: 0, color: "var(--text)" }}>
                Ontmoet je instructeur op de afgesproken spot. Alle kiters en wetsuits zijn inbegrepen. Ready to fly?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Windkracht Calculator Section */}
      <section style={{ padding: "60px 24px", background: "var(--slate-50)" }}>
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: "center" }}>
            
            <div style={{ textAlign: "left" }}>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--primary)", textTransform: "uppercase" }}>
                Veiligheid & Wind limieten
              </span>
              <h2 style={{ fontSize: "36px", marginTop: "8px", marginBottom: "16px" }}>
                Kan er vandaag gekitesurft worden?
              </h2>
              <p style={{ color: "var(--text)", marginBottom: "28px", fontSize: "16px" }}>
                Kitesurfen is een pure wind-sport. Omdat veiligheid onze hoogste prioriteit heeft, hanteren wij strikte windgrenzen. 
                Bij te weinig wind valt de kite neer, en bij stormwinden (windkracht 10+) annuleren we direct de lessen wegens veiligheid.
                <br /><br />
                <b>Probeer onze interactieve wind-regelaar om de adviezen per windkracht te ontdekken!</b>
              </p>

              {/* Slider Input */}
              <div style={{ background: "var(--card-bg)", padding: "24px", borderRadius: "16px", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontWeight: "700", color: "var(--text-title)" }}>Kies windsterkte (Beaufort):</span>
                  <span style={{ fontSize: "24px", fontWeight: "800", color: "var(--primary)" }}>{bft} Bft</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={bft}
                  onChange={(e) => setBft(parseInt(e.target.value))}
                  style={{
                    width: "100%",
                    height: "8px",
                    borderRadius: "4px",
                    background: "var(--slate-200)",
                    outline: "none",
                    cursor: "pointer",
                    accentColor: "var(--primary)"
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--slate-400)", marginTop: "6px" }}>
                  <span>1 Bft (Zwak)</span>
                  <span>5 Bft (Ideaal)</span>
                  <span>9 Bft (Storm)</span>
                  <span>12 Bft (Extreme)</span>
                </div>
              </div>
            </div>

            {/* Calculated Advice Card */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="card glass animate-slide" style={{
                width: "100%",
                maxWidth: "460px",
                borderColor: currentAdvice.color,
                background: "var(--card-bg)",
                padding: "36px",
                textAlign: "left",
                boxShadow: "var(--shadow-lg)",
                borderLeft: `6px solid ${currentAdvice.color}`
              }}>
                <span className="badge" style={{
                  background: currentAdvice.bg,
                  color: currentAdvice.color,
                  marginBottom: "16px",
                  fontSize: "14px",
                  padding: "6px 14px",
                }}>
                  {currentAdvice.status}
                </span>
                
                <h3 style={{ fontSize: "22px", marginBottom: "12px", color: "var(--text-title)" }}>
                  Advies: {currentAdvice.action}
                </h3>
                <p style={{ color: "var(--text)", fontSize: "15px", lineHeight: "1.6", marginBottom: "24px" }}>
                  {currentAdvice.desc}
                </p>

                <div style={{
                  background: "var(--slate-50)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontSize: "13px",
                  color: "var(--slate-700)"
                }}>
                  💡 <b>Veiligheidstip:</b> Windkracht 12 is onze naamgever, maar windkracht 12 is in de praktijk een orkaan! Mocht er zo'n extreme storm zijn, dan blijven we absoluut veilig aan de kant!
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section style={{ padding: "80px 24px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "36px", marginBottom: "12px" }}>Maak kennis met onze instructeurs</h2>
          <p style={{ maxWidth: "600px", margin: "0 auto 48px auto", color: "var(--text)" }}>
            Onze 5 gecertificeerde IKO-instructeurs rijden dagelijks vanuit Utrecht naar de kustspots om jou het kiten bij te brengen.
          </p>

          <div className="grid grid-3" style={{ gap: "32px" }}>
            <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
              <div style={{ fontSize: "48px" }}>🏄‍♂️</div>
              <h3 style={{ fontSize: "20px", margin: 0 }}>Duco Veenstra</h3>
              <span className="badge badge-voorlopig" style={{ fontSize: "11px" }}>Freestyle Expert</span>
              <p style={{ fontSize: "14px", color: "var(--text)", margin: 0 }}>
                "Onze freestyle-expert. Houdt van gigantische sprongen, extreme tricks en zoute zeelucht. Kitesurft al meer dan 10 jaar."
              </p>
            </div>

            <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
              <div style={{ fontSize: "48px" }}>🏄‍♂️</div>
              <h3 style={{ fontSize: "20px", margin: 0 }}>Waldemar van Dongen</h3>
              <span className="badge badge-voorlopig" style={{ fontSize: "11px" }}>Race & Wave Pro</span>
              <p style={{ fontSize: "14px", color: "var(--text)", margin: 0 }}>
                "Oud-wedstrijdkiter op professioneel niveau. Waldemar leert je de perfecte houding, vaartechniek en ultieme startsnelheden."
              </p>
            </div>

            <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
              <div style={{ fontSize: "48px" }}>🏄‍♂️</div>
              <h3 style={{ fontSize: "20px", margin: 0 }}>Ruud Terlingen</h3>
              <span className="badge badge-voorlopig" style={{ fontSize: "11px" }}>Beginners-Coach</span>
              <p style={{ fontSize: "14px", color: "var(--text)", margin: 0 }}>
                "De rust zelve. Met zijn kalme uitstraling en heldere instructie is hij de absolute favoriet voor kinderen en beginners."
              </p>
            </div>

            <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
              <div style={{ fontSize: "48px" }}>🏄‍♀️</div>
              <h3 style={{ fontSize: "20px", margin: 0 }}>Saskia Brink</h3>
              <span className="badge badge-voorlopig" style={{ fontSize: "11px" }}>Noordzee Gids</span>
              <p style={{ fontSize: "14px", color: "var(--text)", margin: 0 }}>
                "Gepassioneerd door wave-riding en wave-kiting. Saskia kent de Nederlandse stromingen en zandbanken als haar broekzak."
              </p>
            </div>

            <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
              <div style={{ fontSize: "48px" }}>🏄‍♂️</div>
              <h3 style={{ fontSize: "20px", margin: 0 }}>Bernie Vredenstein</h3>
              <span className="badge badge-voorlopig" style={{ fontSize: "11px" }}>Materialen Expert</span>
              <p style={{ fontSize: "14px", color: "var(--text)", margin: 0 }}>
                "Technisch genie. Bernie weet alles over de perfecte kite-afstelling, lijndrukken en de nieuwste veiligheidssystemen."
              </p>
            </div>

            <div className="card glass" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", justifyContent: "center", border: "2px dashed var(--border)" }}>
              <div style={{ fontSize: "40px", color: "var(--secondary)" }}>👑</div>
              <h3 style={{ fontSize: "20px", margin: 0 }}>Terence Olieslager</h3>
              <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", color: "var(--slate-400)" }}>Oprichter & Eigenaar</span>
              <p style={{ fontSize: "14px", color: "var(--slate-400)", margin: 0 }}>
                Terence coördineert de school vanuit Utrecht en zorgt dat alle instructeurs met de beste kitespullen klaarstaan op de spots.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: "var(--slate-900)",
        color: "rgba(255,255,255,0.7)",
        padding: "60px 24px 30px 24px",
        borderTop: "1.5px solid var(--border)",
        textAlign: "left",
        fontSize: "14px"
      }}>
        <div className="container">
          <div className="grid grid-3" style={{ gap: "40px", marginBottom: "40px" }}>
            <div>
              <h3 style={{ color: "white", fontSize: "18px", marginBottom: "16px" }}>🌊 Windkracht-12</h3>
              <p style={{ lineHeight: "1.6" }}>
                Al 8 jaar de gezelligste en meest professionele mobiele kitesurfschool van Midden-Nederland. 
                Gevestigd in Utrecht, actief op de beste spots langs de Nederlandse kust.
              </p>
            </div>
            <div>
              <h3 style={{ color: "white", fontSize: "18px", marginBottom: "16px" }}>Spots</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <li><Link to="/locations" style={{ color: "rgba(255,255,255,0.7)" }}>Zandvoort</Link></li>
                <li><Link to="/locations" style={{ color: "rgba(255,255,255,0.7)" }}>Muiderberg</Link></li>
                <li><Link to="/locations" style={{ color: "rgba(255,255,255,0.7)" }}>Wijk aan Zee</Link></li>
                <li><Link to="/locations" style={{ color: "rgba(255,255,255,0.7)" }}>IJmuiden</Link></li>
                <li><Link to="/locations" style={{ color: "rgba(255,255,255,0.7)" }}>Scheveningen</Link></li>
                <li><Link to="/locations" style={{ color: "rgba(255,255,255,0.7)" }}>Hoek van Holland</Link></li>
              </ul>
            </div>
            <div>
              <h3 style={{ color: "white", fontSize: "18px", marginBottom: "16px" }}>Contactgegevens</h3>
              <p style={{ lineHeight: "1.6" }}>
                📍 Utrecht, Nederland (Vertrekpunt)<br />
                📞 +31 (0)30 123 4567<br />
                ✉️ info@windkracht12.nl<br />
                💳 KVK: 12345678 | IKO-School #991
              </p>
            </div>
          </div>

          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "24px",
            textAlign: "center",
            fontSize: "12px",
            color: "rgba(255,255,255,0.4)"
          }}>
            © {new Date().getFullYear()} Kitesurfschool Windkracht-12. Alle rechten voorbehouden.
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;