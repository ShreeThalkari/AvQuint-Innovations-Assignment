import { useEffect, useState } from "react";
import { toast, type ToastMessage } from "../../utils/toast";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const DURATION = 3500; // ms before auto-dismiss

const icons = {
  success: <CheckCircle size={18} className="text-emerald-400 shrink-0" />,
  error: <XCircle size={18} className="text-red-400 shrink-0" />,
  info: <Info size={18} className="text-sky-400 shrink-0" />,
};

const barColors = {
  success: "bg-emerald-400",
  error: "bg-red-400",
  info: "bg-sky-400",
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const msg = (e as CustomEvent<ToastMessage>).detail;
      setToasts((prev) => [...prev, msg]);
      setTimeout(() => remove(msg.id), DURATION);
    };
    window.addEventListener(toast.EVENT, handler);
    return () => window.removeEventListener(toast.EVENT, handler);
  }, []);

  const remove = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="relative overflow-hidden bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl"
        >
          {/* Content */}
          <div className="flex items-center gap-3 px-4 py-3">
            {icons[t.type]}
            <p className="text-sm text-zinc-100 flex-1">{t.message}</p>
            <button
              onClick={() => remove(t.id)}
              className="text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          {/* Progress bar */}
          <div
            className={`absolute bottom-0 left-0 h-0.5 ${barColors[t.type]} animate-shrink`}
          />
        </div>
      ))}
    </div>
  );
}
