import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        backgroundColor: "#5a67d8",
        color: "white",
        border: "none",
        padding: "0.5rem 1rem",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "1rem",
      }}
    >
      Logout
    </button>
  );
}

export default LogoutButton;
