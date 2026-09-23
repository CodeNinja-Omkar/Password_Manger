import { useState } from "react";
import { Copy, Trash2, Eye, EyeOff } from "lucide-react";

export default function PasswordRow({ entry, onDelete }) {
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="min-w-0 flex-1">
        <p className="text-text truncate">{entry.site}</p>
        <p className="text-text-dim text-sm truncate">{entry.username}</p>
      </div>

      <span className="font-mono text-sm text-text-dim w-32 truncate hidden sm:inline">
        {showPassword ? entry.password : "•".repeat(10)}
      </span>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="btn-icon"
          title={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        <button
          onClick={() => copyToClipboard(entry.password)}
          className="btn-icon"
          title="Copy password"
        >
          <Copy size={16} />
        </button>
        <button
          onClick={() => onDelete(entry.id)}
          className="btn-icon hover:text-danger"
          title="Delete entry"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
