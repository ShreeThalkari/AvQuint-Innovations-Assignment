import { ClipboardList } from "lucide-react";
import TaskCard from "./TaskCard";
import type { Task } from "../../types";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function SkeletonCard() {
  return (
    <div className="flex gap-3.5 p-4 rounded-xl border border-zinc-800 bg-zinc-900 animate-pulse">
      <div className="mt-0.5 w-5 h-5 rounded-full bg-zinc-800 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-zinc-800 rounded w-2/3" />
        <div className="h-3 bg-zinc-800 rounded w-full" />
        <div className="h-3 bg-zinc-800 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
}

export default function TaskList({ tasks, loading, onToggle, onEdit, onDelete }: TaskListProps) {
  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
          <ClipboardList size={24} className="text-zinc-600" />
        </div>
        <p className="text-sm font-medium text-zinc-400">No tasks found</p>
        <p className="text-xs text-zinc-600 mt-1">
          Create a task or adjust your filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
