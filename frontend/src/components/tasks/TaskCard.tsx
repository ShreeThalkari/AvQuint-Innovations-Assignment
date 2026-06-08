import { useState } from "react";
import { Check, Circle, Pencil, Trash2, Calendar } from "lucide-react";
import type { Task } from "../../types";

interface TaskCardProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const [toggling, setToggling] = useState(false);
  const isCompleted = task.status === "completed";

  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  async function handleToggle() {
    setToggling(true);
    await onToggle(task);
    setToggling(false);
  }

  return (
    <div
      className={`
        group relative flex gap-3.5 p-4 rounded-xl border transition-all duration-200
        ${isCompleted
          ? "bg-zinc-900/50 border-zinc-800"
          : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20"
        }
      `}
    >
      {/* Status toggle button */}
      <button
        onClick={handleToggle}
        disabled={toggling}
        title={isCompleted ? "Mark as pending" : "Mark as completed"}
        className={`
          mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
          transition-all duration-200 cursor-pointer
          ${toggling ? "opacity-50" : ""}
          ${isCompleted
            ? "bg-emerald-500 border-emerald-500 text-white"
            : "border-zinc-600 hover:border-violet-400"
          }
        `}
      >
        {isCompleted && <Check size={11} strokeWidth={3} />}
        {!isCompleted && <Circle size={11} className="opacity-0 group-hover:opacity-100 text-violet-400" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className={`text-sm font-medium leading-snug transition-colors ${
            isCompleted ? "line-through text-zinc-500" : "text-zinc-100"
          }`}
        >
          {task.title}
        </h3>

        {task.description && (
          <p
            className={`mt-1 text-xs leading-relaxed line-clamp-2 ${
              isCompleted ? "text-zinc-600" : "text-zinc-500"
            }`}
          >
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-2.5">
          {/* Status badge */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              isCompleted
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-amber-500/10 text-amber-400"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? "bg-emerald-400" : "bg-amber-400"}`} />
            {isCompleted ? "Completed" : "Pending"}
          </span>

          {/* Date */}
          <span className="flex items-center gap-1 text-xs text-zinc-600">
            <Calendar size={11} />
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Action buttons — visible on hover */}
      <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          title="Edit task"
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onDelete(task)}
          title="Delete task"
          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
