import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

function VirtualMailbox() {
  const [emails, setEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);

  // Poll for simulated emails every 3 seconds
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/simulated-emails");
        if (res.ok) {
          const data = await res.json();
          setEmails(data.emails);
        }
      } catch (err) {
        console.error("Failed to fetch simulated emails:", err);
      }
    };

    fetchEmails();
    const interval = setInterval(fetchEmails, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleClear = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/simulated-emails/clear", {
        method: "POST",
      });
      if (res.ok) {
        setEmails([]);
        setActiveEmail(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ flex: 1, padding: "40px 24px" }}>
        <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
          
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "20px", marginBottom: "20px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "24px" }}>📧 Mailbox Simulator</h2>
              <p style={{ margin: "4px 0 0", fontSize: "14px", color: "var(--text)" }}>
                Hier kun je alle verstuurde activatiemails en notificaties inzien voor testen.
              </p>
            </div>
            {emails.length > 0 && (
              <button onClick={handleClear} className="btn btn-outline btn-sm" style={{ color: "var(--danger)", borderColor: "var(--danger)" }}>
                Wissen
              </button>
            )}
          </div>

          {/* Content Area */}
          <div>
            {activeEmail ? (
              /* Individual Email View */
              <div>
                <button
                  onClick={() => setActiveEmail(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--primary)",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginBottom: "20px",
                    fontSize: "15px"
                  }}
                >
                  ← Terug naar inbox
                </button>
                <div style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "20px", background: "var(--slate-50)" }}>
                  <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "12px", marginBottom: "16px" }}>
                    <div style={{ fontSize: "14px", color: "var(--text)" }}>
                      <b>Aan:</b> {activeEmail.to_email}
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: "bold", marginTop: "6px", color: "var(--text-title)" }}>
                      {activeEmail.subject}
                    </div>
                  </div>
                  {/* Safe HTML Render of Simulated Email Body */}
                  <div
                    dangerouslySetInnerHTML={{ __html: activeEmail.body }}
                    style={{ fontSize: "15px", lineHeight: "1.6" }}
                  />
                </div>
              </div>
            ) : (
              /* Email List View */
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {emails.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--slate-400)" }}>
                    <div style={{ fontSize: "48px", marginBottom: "12px" }}>✉️</div>
                    Er zijn momenteel geen e-mails.<br />
                    Registreer een account om een mail te ontvangen!
                  </div>
                ) : (
                  emails.map((email) => (
                    <div
                      key={email.id}
                      onClick={() => setActiveEmail(email)}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "16px",
                        cursor: "pointer",
                        background: "var(--card-bg)",
                        transition: "var(--transition)"
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                      onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--slate-400)" }}>
                        <span>Aan: {email.to_email}</span>
                        <span>{new Date(email.created_at || Date.now()).toLocaleTimeString()}</span>
                      </div>
                      <div style={{ fontWeight: "bold", fontSize: "16px", color: "var(--text-title)", marginTop: "6px" }}>
                        {email.subject}
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--text)", marginTop: "4px" }}>
                        Klik om de mail te openen en te activeren...
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default VirtualMailbox;
