import React, { createContext, useState, useEffect, useContext } from "react";
import { getTags, createTag } from "../api/tags";

interface Tag {
  id: number;
  name: string;
}

interface TagContextType {
  tags: Tag[];
  addTag: (name: string) => Promise<Tag>;
}

export const TagContext = createContext<TagContextType | null>(null);

export const useTagContext = () => {
  const context = useContext(TagContext);
  if (!context) throw new Error("useTagContext debe estar dentro de un TagProvider");
  return context;
};

export const TagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const data = await getTags();
      setTags(data);
    };
    fetchTags();
  }, []);

  const addTag = async (name: string): Promise<Tag> => {
    const newTag = await createTag(name);
    setTags((prevTags) => [...prevTags, newTag]);
    return newTag;
  };

  return <TagContext.Provider value={{ tags, addTag }}>{children}</TagContext.Provider>;
};
