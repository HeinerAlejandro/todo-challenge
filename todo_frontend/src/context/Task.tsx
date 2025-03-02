import React, { createContext, useState, useEffect, useContext } from "react";
import { getTasks } from "../api/tasks";
import { Task, TaskFilters } from "../models/task.model";

interface TaskContextType {
  tasks: Task[];
  filters: TaskFilters;
  updateTask: (updatedTask: Task) => void;
  removeTask: (id: number) => void;
  addTask: (task: Task) => void;
  stablishFilters: (newFilters: TaskFilters) => void;
}

export const TaskContext = createContext<TaskContextType | null>(null);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTaskContext debe estar dentro de un TaskProvider");
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<TaskFilters>({
    title__icontains: "",
    description__icontains: "",
    completed__exact: "",
    priority__exact: "",
    tags: [],
    created_at__gte: "",
    finish_at__lte: "",
    completed: undefined
  })

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getTasks(filters);
      setTasks(data);
    };
    fetchTasks();
  }, [filters]);

  const addTask = (task: Task) => {
    setTasks((prevTasks) => [task, ...prevTasks]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const removeTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const stablishFilters = (newFilters: TaskFilters) => {
    setFilters({...filters, ...newFilters})
  }

  return <TaskContext.Provider value={{ tasks, updateTask, removeTask, addTask, filters, stablishFilters }}>{children}</TaskContext.Provider>;
};