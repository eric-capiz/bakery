import { useState, FormEvent } from "react";

interface AdminLoginProps {
  onLogin: () => void;
  onClose: () => void;
}

const AdminLogin = ({ onLogin, onClose }: AdminLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (username === "admin" && password === "admin") {
      // Store session in localStorage
      localStorage.setItem("adminLoggedIn", "true");
      onLogin();
      onClose();
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="admin-login-overlay" onClick={onClose}>
      <div className="admin-login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="admin-login-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="admin-login-field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="admin-login-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="admin-login-error">{error}</div>}
          <button type="submit" className="admin-login-submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

