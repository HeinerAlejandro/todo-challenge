import { apiClient } from "./client";

export interface Tag {
  id: number;
  name: string;
}

export const getTags = async (): Promise<Tag[]> => {
  const response = await apiClient.get<{ results: Tag[] }>("/tags/");
  return response.data.results;
};

export const createTag = async (name: string): Promise<Tag> => {
  const response = await apiClient.post<Tag>("/tags/", { name });
  return response.data;
};