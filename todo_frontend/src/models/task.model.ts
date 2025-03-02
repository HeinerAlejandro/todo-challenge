import { Tag } from "./tag.model";

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 1 | 2 | 3;
  completed: boolean;
  created_at: string;
  finish_at: string;
  tags: number[];
  tags_details: Tag[];
  parent_task?: number;
}

export interface TaskFilters {
  title__icontains?: string,
  description__icontains?: string,
  completed__exact?: string,
  priority__exact?: string,
  tags?: string[],
  created_at__gte?: string,
  finish_at__lte?: string,
  completed: boolean | undefined;
}