import { LogOut, CheckSquare } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <CheckSquare size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold text-zinc-100 tracking-tight">
            Taskly
          </span>
        </div>

        {/* User + logout */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs text-zinc-500">
            {user?.email}
          </span>
          <div className="w-7 h-7 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <span className="text-xs font-semibold text-violet-400">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            leftIcon={<LogOut size={14} />}
          >
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
