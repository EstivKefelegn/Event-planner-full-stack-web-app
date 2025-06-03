import { Link } from "react-router-dom";
import "../styles/Home.css"; // Make sure this is imported

function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">Welcome to Event Scheduler</h1>
        <p className="home-subtitle">Plan, repeat, and manage your events with ease.</p>
        <div className="home-buttons">
          <Link to="/login" className="home-button primary">Login</Link>
          <Link to="/register" className="home-button secondary">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
