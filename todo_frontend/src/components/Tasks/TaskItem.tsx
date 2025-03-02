import React, { useState } from "react";
import { Task } from "../../models/task.model";
import { markTaskAsCompleted, deleteTask } from "../../api/tasks";
import { Card, CardContent, Typography, IconButton, Chip, CircularProgress, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTaskContext } from "../../context/Task";
import { Tag } from "../../models/tag.model";

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { updateTask, removeTask } = useTaskContext();
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    
    setLoading(true);
    try {
      const updatedTask = await markTaskAsCompleted(task.id);
      updateTask(updatedTask);
    } catch (error) {
      console.error("Error al marcar la tarea como completada:", error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTask(task.id);
      removeTask(task.id);
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
    setLoading(false);
  };
  
  return (
    <Card sx={{ marginBottom: 2, padding: 1, backgroundColor: task.completed ? "#d3f9d8" : "#ffffff" }}>
      <CardContent>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {task.description}
        </Typography>
        <Typography variant="body2">📅 Creado: {new Date(task.created_at).toLocaleDateString()}</Typography>
        <Typography variant="body2">⏳ Finaliza: {new Date(task.finish_at).toLocaleDateString()}</Typography>
        <Stack spacing={1} direction={"row"} sx={{marginTop: 1}}>
          {
            task.tags_details.map(
              (tag: Tag) => (<Chip sx={{ borderRadius: 1, padding: "5px 10px", ml: 1, marginTop: 1 }} label={tag.name} color={"default"} />)
            )
            
          }
        </Stack>
        <Chip label={`Prioridad: ${task.priority}`} color={task.priority === 1 ? "error" : task.priority === 2 ? "warning" : "success"} sx={{ marginTop: 1 }} />

        <IconButton color="primary" onClick={handleComplete} sx={{ float: "right" }}>
          {loading ? <CircularProgress size={24} /> : task.completed ? <CheckCircleIcon color="success" /> : <CheckCircleIcon />}
        </IconButton>

        <IconButton color="secondary" onClick={handleDelete} disabled={loading} sx={{ float: "right" }}>
          {loading ? <CircularProgress size={24} /> : <DeleteIcon />}
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default TaskItem;
