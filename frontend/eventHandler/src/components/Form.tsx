import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../tokens";
import LoadingIndicator from "./LoadingIndicator";
import "../styles/Form.css";

interface FormProps {
  route: string;
  method: "login" | "register";
}

function Form({ route, method }: FormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!username.trim()) newErrors.username = "Username is required.";
    if (method === "register" && !email.trim()) newErrors.email = "Email is required.";
    if (method === "register" && !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Email is invalid.";
    if (!password) newErrors.password = "Password is required.";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const payload =
        method === "register"
          ? { username, email, password }
          : { username, password };

      const res = await api.post(route, payload);

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/list");
      } else {
        navigate("/login");
      }
    } catch (error: any) {
      if (error.response?.data) {
        alert("Error:\n" + JSON.stringify(error.response.data, null, 2));
      } else {
        alert(error.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container">
      <form onSubmit={handleSubmit} className="form-card">
        <h1 className="form-title">{name}</h1>

        <input
          className={`form-input ${errors.username ? "input-error" : ""}`}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        {errors.username && <p className="error-text">{errors.username}</p>}

        {method === "register" && (
          <>
            <input
              className={`form-input ${errors.email ? "input-error" : ""}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </>
        )}

        <input
          className={`form-input ${errors.password ? "input-error" : ""}`}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        {loading && <LoadingIndicator />}
        <button className="form-button" type="submit" disabled={loading}>
          {name}
        </button>
      </form>
    </div>
  );
}

export default Form;
