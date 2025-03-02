import { apiClient } from "./client";
import { Task } from "../models/task.model";

import { TaskFilters } from "../models/task.model"


export const createTask = async (task: Omit<Task, "id">): Promise<Task> => {
  const response = await apiClient.post<Task>("/tasks/", task);
  return response.data;
}

const getFilters = (TaskFilters: TaskFilters) => {
  return Object.entries(TaskFilters).reduce(
    (prev, current) => {
      if (prev === "")
        return `${current[0]}=${current[1]}`

      return `${prev}&${current[0]}=${current[1]}`
    }, ""
  )
}

export const getTasks = async (TaskFilters: TaskFilters): Promise<Task[]> => {
  const response = await apiClient.get<{ results: Task[] }>(`/tasks/?${getFilters(TaskFilters)}`);
  return response.data.results;
};

export const markTaskAsCompleted = async (id: number): Promise<Task> => {
  const response = await apiClient.post<Task>(`/tasks/${id}/mark-complete/`);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await apiClient.delete(`/tasks/${id}/`);
};
