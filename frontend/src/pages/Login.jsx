import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/login", { username, password });
      login();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="panel w-full max-w-sm p-8">
        <h1 className="font-display text-3xl text-text mb-1">Vault</h1>
        <p className="text-text-dim text-sm mb-8">
          Enter your credentials to unlock.
        </p>

        {error && (
          <div className="border border-danger/50 text-danger px-3 py-2 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-dim mb-1">Username</label>
            <input
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-text-dim mb-1">Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary mt-6" disabled={loading}>
            {loading ? "Unlocking..." : "Unlock"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-rule text-text-dim text-sm">
          No account yet?{" "}
          <Link
            to="/signup"
            className="text-brass hover:text-brass-dim transition-colors"
          >
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
