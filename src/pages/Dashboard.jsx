import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProfile, getAdminDashboard } from "../api";

function Dashboard() {
  const [profileData, setProfileData] = useState(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [adminError, setAdminError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // user data localStorage se nikaalo
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // agar login nahi hai to seedha login page pe bhej do
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      navigate("/");
    }
  }, [navigate, user]);

  // profile fetch karna
  async function handleProfileFetch() {
    setLoading(true);
    try {
      const result = await getProfile();
      setProfileData(result.data);
    } catch (err) {
      console.log(err);
      setProfileData({ message: "Error: " + err.message });
    } finally {
      setLoading(false);
    }
  }

  // admin api test karna
  async function handleAdminCheck() {
    setAdminMessage("Loading...");
    setAdminError(false);

    try {
      const result = await getAdminDashboard();

      if (result.ok) {
        setAdminMessage("✅ " + result.data.message);
        setAdminError(false);
      } else {
        setAdminMessage("❌ " + (result.data.message || "Access denied"));
        setAdminError(true);
      }
    } catch (err) {
      setAdminMessage("Error: " + err.message);
      setAdminError(true);
    }
  }

  if (!user) return null;

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <div className="card dashboard-card">
          <h2 className="welcome">
            Welcome, <span>{user.name}</span> 👋
          </h2>
          <p className="role-badge">role: {user.role}</p>

          <div className="info-box">
            <h3>Your Profile Info</h3>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>User ID:</strong> {user.id}
            </p>
          </div>

          {user.role === "admin" && (
            <div className="info-box admin-box">
              <h3>🔐 Admin Panel</h3>
              <p>This section is only visible to admin users.</p>
              <button className="btn" onClick={handleAdminCheck}>
                Test Admin API
              </button>
              {adminMessage && (
                <p
                  className={
                    "message " + (adminError ? "error" : "success")
                  }
                >
                  {adminMessage}
                </p>
              )}
            </div>
          )}

          <div className="info-box">
            <h3>Test Protected Route</h3>
            <button className="btn" onClick={handleProfileFetch} disabled={loading}>
              {loading ? "Loading..." : "Get My Profile"}
            </button>
            {profileData && (
              <pre className="output">
                {JSON.stringify(profileData, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;