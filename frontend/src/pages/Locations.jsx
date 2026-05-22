import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

function Locations() {
  const [filter, setFilter] = useState("all");
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackSpots = [
    {
      name: "Muiderberg",
      difficulty: "beginner",
      difficultyLabel: "🟢 Uitstekend voor Beginners",
      waterType: "Vlak & Ondiep",
      windDirections: "N, NO, O, NW",
      crowdLevel: "Druk op zonnige dagen",
      description: "Gelegen aan het ondiepe IJmeer. Doordat je hier tot honderden meters ver in het water kunt staan, is Muiderberg de ultieme leslocatie voor beginners en herstarters. Geen golven of sterke getijdenstroming!",
      safetyTips: "Let op de drukte nabij het strand en eventuele recreatieve zwemmers.",
      icon: "🏖️"
    },
    {
      name: "IJmuiden",
      difficulty: "beginner",
      difficultyLabel: "🟡 Ideaal voor Beginners & Intermediates",
      waterType: "Vlak tot Kabbel (binnen de pieren)",
      windDirections: "ZW, W, NW, N",
      crowdLevel: "Gemiddeld",
      description: "IJmuiden biedt door de enorme pieren een uniek en beschut surfgebied. Het water binnen de pieren is relatief vlak, wat ideaal is om boardstarts en bochten te oefenen zonder last te hebben van grote zeegolven.",
      safetyTips: "Blijf op veilige afstand van de havenmonding en de grote pierblokken.",
      icon: "⚓"
    },
    {
      name: "Hoek van Holland",
      difficulty: "intermediate",
      difficultyLabel: "🟡 Geschikt voor Intermediates & Gevorderden",
      waterType: "Choppy water met matige golven",
      windDirections: "Z, ZW, W, NW",
      crowdLevel: "Rustig tot Gemiddeld",
      description: "Een prachtig breed zandstrand met uitstekende surfcondities. Door de ligging kan er met veel windrichtingen veilig gevaren worden. Ideaal voor kiters die de overstap maken naar open zee.",
      safetyTips: "Houd rekening met de vaargeul van de Rotterdamse haven.",
      icon: "🏗️"
    },
    {
      name: "Zandvoort",
      difficulty: "advanced",
      difficultyLabel: "🔴 Alleen voor Gevorderden",
      waterType: "Open zee, Hoge golven & Branding",
      windDirections: "ZW, W, NW, N",
      crowdLevel: "Druk",
      description: "Zandvoort is een legendarische spot met krachtige golven en een stevige branding. De sterke stroming en branding maken deze spot uitsluitend geschikt voor ervaren kiters en gevorderde lessers onder begeleiding.",
      safetyTips: "Sterke getijdenstroming. Vaar nooit alleen op open zee.",
      icon: "🏄‍♂️"
    },
    {
      name: "Wijk aan Zee",
      difficulty: "advanced",
      difficultyLabel: "🔴 Alleen voor Gevorderden",
      waterType: "Ruige zee & Hoge branding",
      windDirections: "ZW, W, NW, N",
      crowdLevel: "Druk (populair onder golfsurfers)",
      description: "Wijk aan Zee staat bekend om de beste en hoogste golven van Nederland. Het is de ultieme speeltuin voor freestyle- en wave-kiters. Niet geschikt voor beginners vanwege de zware branding.",
      safetyTips: "Houd voldoende afstand van de noordpier van IJmuiden.",
      icon: "🏭"
    },
    {
      name: "Scheveningen",
      difficulty: "advanced",
      difficultyLabel: "🔴 Alleen voor Gevorderden",
      waterType: "Ruige zee, Sterke stroming & Branding",
      windDirections: "ZZW, ZW, W, NW, N",
      crowdLevel: "Zeer druk",
      description: "Gelegen naast de havenhoofden. Scheveningen heeft fantastische surfcondities maar vereist uitstekende kiteloop- en boardbeheersing. De sterke stroming langs de kustlijn vormt een extra uitdaging.",
      safetyTips: "Pas op voor de havenhoofden en de sterke stroming langs de kust.",
      icon: "🎡"
    }
  ];

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/locations");
        if (res.ok) {
          const data = await res.json();
          // The database keys map directly to the frontend properties:
          // name, difficulty, difficulty_label -> difficultyLabel, water_type -> waterType, etc.
          const mapped = data.locations.map(loc => ({
            id: loc.id,
            name: loc.name,
            difficulty: loc.difficulty,
            difficultyLabel: loc.difficulty_label,
            waterType: loc.water_type,
            windDirections: loc.wind_directions,
            crowdLevel: loc.crowd_level,
            description: loc.description,
            safetyTips: loc.safety_tips,
            icon: loc.icon
          }));
          setSpots(mapped);
        } else {
          setSpots(fallbackSpots);
        }
      } catch (err) {
        console.error("Fout bij ophalen locaties:", err);
        setSpots(fallbackSpots);
      } finally {
        setLoading(false);
      }
    };
    fetchSpots();
  }, []);

  const filteredSpots = filter === "all" ? spots : spots.filter(s => s.difficulty === filter);


  return (
    <>
      <Navbar />

      {/* Header Banner */}
      <section style={{
        background: "linear-gradient(135deg, #075985 0%, #0369a1 100%)",
        color: "white",
        padding: "60px 24px",
        textAlign: "center",
      }}>
        <div className="container animate-slide">
          <h1 style={{ fontSize: "40px", marginBottom: "12px", color: "white" }}>Onze Kitesurf Spots & Locaties</h1>
          <p style={{ maxWidth: "600px", margin: "0 auto", color: "var(--primary-light)", fontSize: "16px" }}>
            Vanuit onze basis in Utrecht rijden we met onze mobiele trailer naar de beste spots aan de kust, 
            afhankelijk van de windrichting en jouw niveau.
          </p>
        </div>
      </section>

      {/* Spots Filter Controls */}
      <section style={{ padding: "40px 24px 20px 24px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div style={{
            display: "inline-flex",
            background: "var(--slate-50)",
            padding: "6px",
            borderRadius: "14px",
            border: "1px solid var(--border)",
            gap: "8px",
            flexWrap: "wrap",
            justifyContent: "center"
          }}>
            <button
              className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setFilter("all")}
              style={{ padding: "8px 20px" }}
            >
              🌐 Alle Spots ({spots.length})
            </button>
            <button
              className={`btn btn-sm ${filter === "beginner" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setFilter("beginner")}
              style={{ padding: "8px 20px" }}
            >
              🟢 Beginner ({spots.filter(s => s.difficulty === "beginner").length})
            </button>
            <button
              className={`btn btn-sm ${filter === "intermediate" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setFilter("intermediate")}
              style={{ padding: "8px 20px" }}
            >
              🟡 Intermediate ({spots.filter(s => s.difficulty === "intermediate").length})
            </button>
            <button
              className={`btn btn-sm ${filter === "advanced" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setFilter("advanced")}
              style={{ padding: "8px 20px" }}
            >
              🔴 Gevorderd ({spots.filter(s => s.difficulty === "advanced").length})
            </button>
          </div>
        </div>
      </section>

      {/* Spots Grid */}
      <section style={{ padding: "30px 24px 60px 24px" }}>
        <div className="container">
          <div className="grid grid-3" style={{ gap: "32px" }}>
            {loading ? (
              <div style={{ gridColumn: "span 3", textAlign: "center", padding: "40px", fontSize: "18px" }}>Locaties laden... 🏄‍♂️</div>
            ) : filteredSpots.length === 0 ? (
              <div style={{ gridColumn: "span 3", textAlign: "center", padding: "40px", fontSize: "18px" }}>Geen spots gevonden.</div>
            ) : (
              filteredSpots.map((spot, idx) => (
                <div key={idx} className="card glass animate-slide" style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "32px",
                  borderRadius: "20px",
                  boxShadow: "var(--shadow-md)",
                  borderTop: spot.difficulty === "beginner" 
                    ? "6px solid var(--success)" 
                    : spot.difficulty === "intermediate" 
                      ? "6px solid var(--warning)" 
                      : "6px solid var(--danger)"
                }}>
                  
                  {/* Spot Title with Icon */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <span style={{ fontSize: "32px" }}>{spot.icon}</span>
                    <h2 style={{ fontSize: "22px", margin: 0, color: "var(--text-title)" }}>{spot.name}</h2>
                  </div>

                  {/* Difficulty Tag */}
                  <div style={{ marginBottom: "16px" }}>
                    <span className="badge" style={{ 
                      fontSize: "11px", 
                      padding: "4px 10px",
                      backgroundColor: spot.difficulty === "beginner" 
                        ? "rgba(16, 185, 129, 0.12)" 
                        : spot.difficulty === "intermediate" 
                          ? "rgba(245, 158, 11, 0.12)" 
                          : "rgba(239, 68, 68, 0.12)",
                      color: spot.difficulty === "beginner" 
                        ? "var(--success)" 
                        : spot.difficulty === "intermediate" 
                          ? "var(--warning)" 
                          : "var(--danger)"
                    }}>
                      {spot.difficultyLabel}
                    </span>
                  </div>

                  <p style={{ color: "var(--text)", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px", flex: 1 }}>
                    {spot.description}
                  </p>

                  {/* Technical Specs List */}
                  <div style={{ 
                    background: "var(--slate-50)", 
                    border: "1px solid var(--border)", 
                    borderRadius: "12px", 
                    padding: "16px", 
                    fontSize: "13px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginBottom: "16px"
                  }}>
                    <div>
                      🌊 <b>Watertype:</b> <span style={{ color: "var(--text-title)" }}>{spot.waterType}</span>
                    </div>
                    <div>
                      🧭 <b>Beste windrichting:</b> <span style={{ color: "var(--text-title)" }}>{spot.windDirections}</span>
                    </div>
                    <div>
                      👥 <b>Drukte:</b> <span style={{ color: "var(--text-title)" }}>{spot.crowdLevel}</span>
                    </div>
                  </div>

                  {/* Safety Tips */}
                  <div style={{ 
                    fontSize: "12px", 
                    color: "#991b1b", 
                    background: "#fee2e2", 
                    padding: "10px 14px", 
                    borderRadius: "8px", 
                    border: "1px solid #fca5a5",
                  }}>
                    ⚠️ <b>Veiligheid:</b> {spot.safetyTips}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <section style={{ background: "var(--slate-50)", padding: "50px 24px", textAlign: "center", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <h2 style={{ fontSize: "26px", marginBottom: "12px" }}>Hoe bepalen we de spot van de dag?</h2>
          <p style={{ maxWidth: "700px", margin: "0 auto 24px auto", color: "var(--text)", fontSize: "15px", lineHeight: "1.6" }}>
            Elke ochtend inspecteert ons instructeurs-team de windvoorspellingen (snelheid en richting) en de golfhoogtes. 
            Rond 08:00 uur nemen we contact op met alle ingeplande cursisten om de definitieve spot en het ontmoetingspunt af te spreken. 
            Zo garanderen we altijd de veiligste en leukste kitesurfsessie!
          </p>
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

export default Locations;
