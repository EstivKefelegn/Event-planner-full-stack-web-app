import "../styles/NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1>404</h1>
      <p>Oops! The page you’re looking for doesn’t exist.</p>
      <a href="/list" className="home-link">Go back home</a>
    </div>
  );
};

export default NotFound;
