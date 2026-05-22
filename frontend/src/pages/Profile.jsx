import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div style={{ padding: "40px", textAlign: "center", color: "var(--text-title)" }}>
      <h2>Je wordt doorgestuurd naar je Dashboard... 🏄‍♂️</h2>
    </div>
  );
}

export default Profile;
