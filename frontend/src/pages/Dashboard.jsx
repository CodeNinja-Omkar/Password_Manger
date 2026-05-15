import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import PasswordCard from '../components/PasswordCard.jsx';
import { LogOut, Plus, Shield } from 'lucide-react';

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [site, setSite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const fetchPasswords = async () => {
    try {
      const res = await api.get('/passwords');
      setPasswords(res.data);
    } catch (err) {
      console.error('Failed to fetch passwords:', err);
      setError('Failed to load passwords');
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
    setError('');

    try {
      await api.post('/passwords', { site, username, password });
      setSite('');
      setUsername('');
      setPassword('');
      fetchPasswords();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add password');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/passwords/${id}`);
      setPasswords(passwords.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete password:', err);
      alert('Failed to delete password');
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-10 glass-panel p-4 px-6">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-400" size={28} />
          <h1 className="text-2xl font-bold text-white">Vault</h1>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Add Password Form */}
        <div className="md:col-span-1">
          <div className="glass-panel p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Plus size={20} className="text-blue-400" />
              Add New
            </h2>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-3 py-2 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleAddPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Site / App</label>
                <input 
                  type="text" 
                  className="input-field py-2" 
                  placeholder="e.g. Google, Netflix"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Username / Email</label>
                <input 
                  type="text" 
                  className="input-field py-2" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Password</label>
                <input 
                  type="password" 
                  className="input-field py-2" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary mt-2" disabled={isAdding}>
                {isAdding ? 'Saving...' : 'Save Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Password List */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-white mb-6 px-1">Your Saved Passwords</h2>
          
          {loading ? (
            <div className="text-slate-400 p-4">Loading vault...</div>
          ) : passwords.length === 0 ? (
            <div className="glass-panel p-12 flex flex-col items-center justify-center text-center">
              <Shield className="text-slate-600 mb-4" size={48} />
              <h3 className="text-xl text-slate-300 font-medium mb-2">Your vault is empty</h3>
              <p className="text-slate-500 max-w-sm">Add your first password using the form to securely store your credentials.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {passwords.map((entry) => (
                <PasswordCard 
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
