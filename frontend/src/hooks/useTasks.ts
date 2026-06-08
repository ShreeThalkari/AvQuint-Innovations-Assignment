import { useState, useEffect, useCallback } from "react";
import { taskService } from "../services/taskService";
import type { Task, TaskFilters, CreateTaskPayload, UpdateTaskPayload } from "../types";
import { toast } from "../utils/toast";

const DEFAULT_FILTERS: TaskFilters = {
  search: "",
  status: "all",
  page: 1,
  limit: 6,
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.getTasks(filters);
      setTasks(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load tasks";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(
    async (payload: CreateTaskPayload): Promise<boolean> => {
      try {
        await taskService.createTask(payload);
        toast.success("Task created!");
        // Go to page 1 to see new task
        setFilters((prev) => ({ ...prev, page: 1 }));
        return true;
      } catch {
        toast.error("Failed to create task");
        return false;
      }
    },
    []
  );

  const updateTask = useCallback(
    async (id: string, payload: UpdateTaskPayload): Promise<boolean> => {
      try {
        const updated = await taskService.updateTask(id, payload);
        setTasks((prev) =>
          prev.map((t) => (t._id === updated._id ? updated : t))
        );
        toast.success("Task updated!");
        return true;
      } catch {
        toast.error("Failed to update task");
        return false;
      }
    },
    []
  );

  const toggleStatus = useCallback(async (task: Task) => {
    try {
      const updated = await taskService.toggleTaskStatus(task);
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
    } catch {
      toast.error("Failed to update status");
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      await taskService.deleteTask(id);
      toast.success("Task deleted");
      setFilters((prev) => ({
        ...prev,
        page: tasks.length === 1 && prev.page > 1 ? prev.page - 1 : prev.page,
      }));
      return true;
    } catch {
      toast.error("Failed to delete task");
      return false;
    }
  }, [tasks.length]);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const setStatus = useCallback((status: TaskFilters["status"]) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return {
    tasks,
    filters,
    total,
    totalPages,
    loading,
    error,
    createTask,
    updateTask,
    toggleStatus,
    deleteTask,
    setSearch,
    setStatus,
    setPage,
    refetch: fetchTasks,
  };
}
