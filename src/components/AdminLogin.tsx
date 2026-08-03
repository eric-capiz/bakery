import { useEffect, useId, useRef, useState, FormEvent } from "react";

interface AdminLoginProps {
  onLogin: () => void;
  onClose: () => void;
}

const AdminLogin = ({ onLogin, onClose }: AdminLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const titleId = useId();
  const userRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    userRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        onLogin();
        onClose();
      } else {
        setError(data.error || "Invalid username or password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="br-auth" onClick={onClose} role="presentation">
      <div
        className="br-auth-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="br-auth-close"
          onClick={onClose}
          aria-label="Close"
        >
          Close
        </button>

        <p className="br-kicker">Studio access</p>
        <h2 id={titleId}>Brume admin</h2>
        <p className="br-auth-lede">
          Sign in to manage content, images, and commissions.
        </p>

        <form className="br-auth-form" onSubmit={handleSubmit}>
          <label className="br-auth-field">
            <span>Username</span>
            <input
              ref={userRef}
              type="text"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label className="br-auth-field">
            <span>Password</span>
            <div className="br-auth-password">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {error ? (
            <p className="br-auth-error" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="br-btn br-auth-submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
