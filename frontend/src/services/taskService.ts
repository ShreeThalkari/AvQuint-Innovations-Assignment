import apiClient from "./apiClient";
import type {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  PaginatedResponse,
  TaskFilters,
} from "../types";

export const taskService = {
  getTasks: async (filters: TaskFilters): Promise<PaginatedResponse<Task>> => {
    const params: Record<string, string | number> = {
      page: filters.page,
      limit: filters.limit,
    };
    if (filters.search) params.search = filters.search;
    if (filters.status !== "all") params.status = filters.status;

    const { data } = await apiClient.get<PaginatedResponse<Task>>("/tasks", { params });
    return data;
  },

  createTask: async (payload: CreateTaskPayload): Promise<Task> => {
    const { data } = await apiClient.post<Task>("/tasks", payload);
    return data;
  },

  updateTask: async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
    const { data } = await apiClient.put<Task>(`/tasks/${id}`, payload);
    return data;
  },

  toggleTaskStatus: async (task: Task): Promise<Task> => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    const { data } = await apiClient.put<Task>(`/tasks/${task._id}`, { status: newStatus });
    return data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};
