import { useState, useCallback } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../hooks/useTasks";
import Navbar from "../components/layout/Navbar";
import TaskList from "../components/tasks/TaskList";
import TaskForm from "../components/tasks/TaskForm";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Pagination from "../components/ui/Pagination";
import Button from "../components/ui/Button";
import type { Task, FilterStatus } from "../types";

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; task: Task }
  | { type: "delete"; task: Task };

const STATUS_TABS: { label: string; value: FilterStatus }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    tasks,
    filters,
    total,
    totalPages,
    loading,
    createTask,
    updateTask,
    toggleStatus,
    deleteTask,
    setSearch,
    setStatus,
    setPage,
  } = useTasks();

  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleCreate = useCallback(
    async (values: { title: string; description: string }) => {
      const success = await createTask(values);
      if (success) setModal({ type: "none" });
      return success;
    },
    [createTask]
  );

  const handleUpdate = useCallback(
    async (values: { title: string; description: string }) => {
      if (modal.type !== "edit") return false;
      const success = await updateTask(modal.task._id, values);
      if (success) setModal({ type: "none" });
      return success;
    },
    [modal, updateTask]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (modal.type !== "delete") return;
    setDeleteLoading(true);
    await deleteTask(modal.task._id);
    setDeleteLoading(false);
    setModal({ type: "none" });
  }, [modal, deleteTask]);

  // ─── Stats for header ────────────────────────────────────────────────────
  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl font-bold text-zinc-100">
              Good to see you, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              {total === 0
                ? "No tasks yet — create one to get started"
                : `${total} task${total !== 1 ? "s" : ""} total · ${pendingCount} pending · ${completedCount} done`}
            </p>
          </div>
          <Button
            leftIcon={<Plus size={16} />}
            onClick={() => setModal({ type: "create" })}
          >
            New Task
          </Button>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search tasks…"
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full h-10 pl-9 pr-3 rounded-lg bg-zinc-900 border border-zinc-800
                text-sm text-zinc-100 placeholder:text-zinc-600
                focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                hover:border-zinc-700 transition-all duration-200
              "
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            <SlidersHorizontal size={14} className="text-zinc-600 ml-1 mr-0.5" />
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatus(tab.value)}
                className={`
                  px-3 h-7 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer
                  ${filters.status === tab.value
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task list */}
        <TaskList
          tasks={tasks}
          loading={loading}
          onToggle={toggleStatus}
          onEdit={(task) => setModal({ type: "edit", task })}
          onDelete={(task) => setModal({ type: "delete", task })}
        />

        {/* Pagination */}
        <Pagination
          page={filters.page}
          totalPages={totalPages}
          total={total}
          limit={filters.limit}
          onPageChange={setPage}
        />
      </main>

      {/* ── Modals ────────────────────────────────────────────────────────── */}

      {/* Create */}
      <Modal
        isOpen={modal.type === "create"}
        onClose={() => setModal({ type: "none" })}
        title="New Task"
      >
        <TaskForm
          onSubmit={handleCreate}
          onCancel={() => setModal({ type: "none" })}
        />
      </Modal>

      {/* Edit */}
      <Modal
        isOpen={modal.type === "edit"}
        onClose={() => setModal({ type: "none" })}
        title="Edit Task"
      >
        {modal.type === "edit" && (
          <TaskForm
            task={modal.task}
            onSubmit={handleUpdate}
            onCancel={() => setModal({ type: "none" })}
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={modal.type === "delete"}
        onClose={() => setModal({ type: "none" })}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={
          modal.type === "delete"
            ? `Are you sure you want to delete "${modal.task.title}"? This cannot be undone.`
            : ""
        }
        loading={deleteLoading}
      />
    </div>
  );
}
