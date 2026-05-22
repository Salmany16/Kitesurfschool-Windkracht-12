import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Gallery() {
  const token = localStorage.getItem("w12_token");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackPhotos = [
    {
      id: 1,
      title: "Adembenemende Big Air",
      spot: "Zandvoort",
      kiter: "Waldemar van Dongen (Instructeur)",
      wind: "28 Knopen - ZW (7 Bft)",
      gear: "Duotone Rebel 9m + Jaime Board",
      description: "Waldemar laat zien hoe je met sterke wind de golven als schans gebruikt om metershoog boven de branding van Zandvoort uit te stijgen.",
      imgUrl: "/gallery_hero.png" // Generated premium image!
    },
    {
      id: 2,
      title: "Eerste Waterstart Succes",
      spot: "Muiderberg",
      kiter: "Lars de Wit (Cursist)",
      wind: "14 Knopen - N (4 Bft)",
      gear: "Core XR7 12m + Fusion Board",
      description: "Het ultieme gevoel van triomf! Lars maakt zijn allereerste meters op het board in het ondiepe, spiegelgladde water van Muiderberg.",
      imgUrl: null,
      gradient: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
      icon: "🏄‍♂️"
    },
    {
      id: 3,
      title: "Duo Kitesurf Training",
      spot: "IJmuiden",
      kiter: "Anouk & Sophie (Duo Cursisten)",
      wind: "17 Knopen - NW (4-5 Bft)",
      gear: "Cabrinha Switchblade 10m & 12m",
      description: "Samen leren kiten is twee keer zo leuk! Anouk en Sophie trainen hun bodydrag-techniek onder begeleiding van instructeur Saskia.",
      imgUrl: null,
      gradient: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
      icon: "👥"
    },
    {
      id: 4,
      title: "Sunset Wave Gliding",
      spot: "Wijk aan Zee",
      kiter: "Saskia Brink (Instructeur)",
      wind: "22 Knopen - W (5 Bft)",
      gear: "F-One Bandit 8m + Surfboard",
      description: "Saskia surft met een speciaal wave-board over de perfecte golven bij Wijk aan Zee tijdens een magische zonsondergang.",
      imgUrl: null,
      gradient: "linear-gradient(135deg, #b45309 0%, #78350f 100%)",
      icon: "🌅"
    },
    {
      id: 5,
      title: "Techniek & Veiligheidskliniek",
      spot: "Hoek van Holland",
      kiter: "Bernie Vredenstein (Instructeur)",
      wind: "19 Knopen - ZW (5 Bft)",
      gear: "Duotone Neo 11m",
      description: "Veiligheid staat voorop. Bernie legt op het brede strand van Hoek van Holland uit hoe het quick-release veiligheidssysteem werkt.",
      imgUrl: null,
      gradient: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
      icon: "🛡️"
    },
    {
      id: 6,
      title: "Nieuwe Spullen Gear-Check",
      spot: "Utrecht (School Basis)",
      kiter: "Terence Olieslager (Eigenaar)",
      wind: "Geen wind (Strand-werk)",
      gear: "Volledige 2026 Duotone & Core line-up",
      description: "Terence inspecteert onze gloednieuwe materialen. Wij vernieuwen elk seizoen al onze kites en wetsuits om maximale veiligheid te garanderen.",
      imgUrl: null,
      gradient: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
      icon: "📦"
    }
  ];

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/photos");
        if (res.ok) {
          const data = await res.json();
          const mapped = data.photos.map(ph => ({
            id: ph.id,
            title: ph.title,
            spot: ph.spot,
            kiter: ph.kiter,
            wind: ph.wind,
            gear: ph.gear,
            description: ph.description,
            imgUrl: ph.img_url,
            gradient: ph.gradient,
            icon: ph.icon
          }));
          setPhotos(mapped);
        } else {
          setPhotos(fallbackPhotos);
        }
      } catch (err) {
        console.error("Fout bij ophalen fotos:", err);
        setPhotos(fallbackPhotos);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  return (
    <>
      <Navbar />

      {/* Header Banner */}
      <section style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #311042 100%)",
        color: "white",
        padding: "60px 24px",
        textAlign: "center",
      }}>
        <div className="container animate-slide">
          <h1 style={{ fontSize: "40px", marginBottom: "12px", color: "white" }}>Fotogalerij Windkracht-12</h1>
          <p style={{ maxWidth: "600px", margin: "0 auto", color: "#c084fc", fontSize: "16px" }}>
            Bekijk de vetste actieshots, leerzame lesmomenten en sfeerimpressies van onze instructeurs and cursisten op het water!
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section style={{ padding: "60px 24px" }}>
        <div className="container">
          <div className="grid grid-3" style={{ gap: "32px" }}>
            {loading ? (
              <div style={{ gridColumn: "span 3", textAlign: "center", padding: "40px", fontSize: "18px" }}>Foto's laden... 🏄‍♂️</div>
            ) : photos.length === 0 ? (
              <div style={{ gridColumn: "span 3", textAlign: "center", padding: "40px", fontSize: "18px" }}>Geen foto's gevonden.</div>
            ) : (
              photos.map((photo) => (
              <div
                key={photo.id}
                className="card glass animate-slide"
                onClick={() => setSelectedPhoto(photo)}
                style={{
                  padding: "0",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-md)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  transition: "var(--transition)"
                }}
              >
                
                {/* Photo Header Visual */}
                {photo.imgUrl ? (
                  <div style={{ position: "relative", height: "240px", overflow: "hidden" }}>
                    <img 
                      src={photo.imgUrl} 
                      alt={photo.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "var(--transition)"
                      }}
                      className="gallery-image"
                    />
                    <div style={{
                      position: "absolute",
                      bottom: "12px",
                      left: "12px",
                      background: "rgba(0,0,0,0.6)",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}>
                      📸 Actie Foto
                    </div>
                  </div>
                ) : (
                  <div style={{
                    height: "240px",
                    background: photo.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "64px",
                    position: "relative"
                  }}>
                    {photo.icon}
                    <div style={{
                      position: "absolute",
                      bottom: "12px",
                      left: "12px",
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(4px)",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      border: "1px solid rgba(255,255,255,0.2)"
                    }}>
                      🎨 Momentopname
                    </div>
                  </div>
                )}

                {/* Photo Content Detail */}
                <div style={{ padding: "24px", textAlign: "left" }}>
                  <span style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "800", textTransform: "uppercase" }}>
                    📍 {photo.spot}
                  </span>
                  <h3 style={{ fontSize: "20px", marginTop: "4px", marginBottom: "8px", color: "var(--text-title)" }}>
                    {photo.title}
                  </h3>
                  <p style={{ color: "var(--text)", fontSize: "14px", lineHeight: "1.5", margin: 0, height: "66px", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {photo.description}
                  </p>
                  
                  <div style={{ 
                    borderTop: "1px solid var(--border)", 
                    marginTop: "16px", 
                    paddingTop: "12px", 
                    display: "flex", 
                    justifyContent: "space-between", 
                    fontSize: "12px",
                    color: "var(--slate-400)",
                    fontWeight: "600"
                  }}>
                    <span>🪁 {photo.gear.split(" + ")[0]}</span>
                    <span>💨 {photo.wind.split(" - ")[0]}</span>
                  </div>
                </div>

              </div>
            )))}
          </div>
        </div>
      </section>

      {/* Lightbox / Zoom Modal */}
      {selectedPhoto && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "24px"
        }} onClick={() => setSelectedPhoto(null)}>
          <div className="card glass animate-slide" style={{
            maxWidth: "680px",
            width: "100%",
            padding: 0,
            borderRadius: "24px",
            overflow: "hidden",
            background: "var(--card-bg)"
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Visual Top Header */}
            {selectedPhoto.imgUrl ? (
              <div style={{ height: "320px", width: "100%" }}>
                <img 
                  src={selectedPhoto.imgUrl} 
                  alt={selectedPhoto.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ) : (
              <div style={{
                height: "220px",
                background: selectedPhoto.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "72px"
              }}>
                {selectedPhoto.icon}
              </div>
            )}

            {/* Modal Content */}
            <div style={{ padding: "32px", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div>
                  <span style={{ fontSize: "13px", color: "var(--primary)", fontWeight: "800", textTransform: "uppercase" }}>
                    📍 Spot: {selectedPhoto.spot}
                  </span>
                  <h2 style={{ fontSize: "24px", margin: "4px 0 0 0", color: "var(--text-title)" }}>
                    {selectedPhoto.title}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedPhoto(null)}
                  className="btn btn-outline btn-sm"
                  style={{ borderRadius: "50%", width: "32px", height: "32px", padding: 0, display: "flex", alignItems: "center", justifyItems: "center" }}
                >
                  ✕
                </button>
              </div>

              <p style={{ color: "var(--text)", fontSize: "15px", lineHeight: "1.6", marginBottom: "24px" }}>
                {selectedPhoto.description}
              </p>

              {/* Data Specs Grid */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr", 
                gap: "16px",
                background: "var(--slate-50)", 
                border: "1px solid var(--border)", 
                borderRadius: "16px", 
                padding: "20px",
                fontSize: "14px",
                color: "var(--slate-700)",
                marginBottom: "28px"
              }}>
                <div>
                  👤 <b>Kiter:</b> {selectedPhoto.kiter}
                </div>
                <div>
                  💨 <b>Windconditie:</b> {selectedPhoto.wind}
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  🪁 <b>Uitrusting & Kitespullen:</b> {selectedPhoto.gear}
                </div>
              </div>

              {/* Action Redirect */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button onClick={() => setSelectedPhoto(null)} className="btn btn-outline">
                  Sluiten
                </button>
                {token ? (
                  <Link to="/dashboard" className="btn btn-primary">
                    🏄‍♂️ Direct Les Inplannen
                  </Link>
                ) : (
                  <Link to="/register" className="btn btn-primary">
                    🚀 Dit Wil Ik Ook! Boek Nu
                  </Link>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

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

export default Gallery;
