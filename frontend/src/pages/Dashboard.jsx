import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import PasswordRow from "../components/PasswordRow.jsx";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const fetchPasswords = async () => {
    try {
      const res = await api.get("/passwords");
      setPasswords(res.data);
    } catch (err) {
      console.error("Failed to fetch passwords:", err);
      setError("Failed to load passwords");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  const handleAddPassword = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    setError("");

    try {
      await api.post("/passwords", { site, username, password });
      setSite("");
      setUsername("");
      setPassword("");
      fetchPasswords();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add password");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/passwords/${id}`);
      setPasswords(passwords.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete password:", err);
      alert("Failed to delete password");
    }
  };

  return (
    <div className="min-h-screen max-w-5xl mx-auto p-4 md:p-8">
      <header className="flex justify-between items-baseline mb-10 pb-4 border-b border-rule">
        <h1 className="font-display text-2xl text-text">Vault</h1>
        <button
          onClick={logout}
          className="text-text-dim hover:text-text text-sm transition-colors"
        >
          Log out
        </button>
      </header>

      <div className="grid md:grid-cols-[280px_1fr] gap-8">
        <div className="panel p-6 h-fit">
          <h2 className="text-sm text-text-dim mb-5">Add entry</h2>

          {error && (
            <div className="border border-danger/50 text-danger px-3 py-2 text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleAddPassword} className="space-y-4">
            <div>
              <label className="block text-sm text-text-dim mb-1">Site</label>
              <input
                type="text"
                className="input-field"
                placeholder="netflix.com"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-text-dim mb-1">
                Username
              </label>
              <input
                type="text"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-text-dim mb-1">
                Password
              </label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary mt-2"
              disabled={isAdding}
            >
              {isAdding ? "Saving..." : "Save entry"}
            </button>
          </form>
        </div>

        <div>
          {loading ? (
            <p className="text-text-dim text-sm">Loading...</p>
          ) : passwords.length === 0 ? (
            <div className="panel p-10 text-center">
              <p className="text-text mb-1">Nothing saved yet</p>
              <p className="text-text-dim text-sm">
                Entries you add will be listed here.
              </p>
            </div>
          ) : (
            <div className="panel divide-y divide-rule">
              {passwords.map((entry) => (
                <PasswordRow
                  key={entry.id}
                  entry={entry}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
