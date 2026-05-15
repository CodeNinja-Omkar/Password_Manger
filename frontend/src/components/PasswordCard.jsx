import { useState } from "react";
import { Copy, Trash2, Eye, EyeOff } from "lucide-react";
export default function PasswordCard({ entry, onDelete }) {
  const [showPassword, setShowPassword] = useState(false);
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };
  return (
    <div className="glass-panel p-5 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-white">{entry.site}</h3>
          <p className="text-slate-400 text-sm">{entry.username}</p>
        </div>
        <button
          onClick={() => onDelete(entry.id)}
          className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-full hover:bg-red-500/10"
          title="Delete Password"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <div className="relative flex-1">
          <input
            type={showPassword ? "text" : "password"}
            value={entry.password}
            readOnly
            className="input-field pr-10 bg-slate-900/80 font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <button
          onClick={() => copyToClipboard(entry.password)}
          className="bg-slate-700 hover:bg-slate-600 text-white p-2.5 rounded-lg transition-colors flex-shrink-0"
          title="Copy Password"
        >
          <Copy size={18} />
        </button>
      </div>
    </div>
  );
}
