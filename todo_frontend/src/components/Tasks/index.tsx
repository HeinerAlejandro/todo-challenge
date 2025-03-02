import React, { useContext } from "react";
import { TaskContext } from "../../context/Task";
import TaskItem from "./TaskItem";
import { Container, Typography, Paper, Box } from "@mui/material";

import TasksFilters from './TaskFilters'


const TaskList: React.FC = () => {
  const { tasks } = useContext(TaskContext)!;
  return (
    <Container sx={{ marginTop: 4 }}>
  
      <Paper elevation={3} sx={{ padding: 2, borderRadius: 2, boxShadow: 4 }}>
        <TasksFilters />
      </Paper>

      <Paper 
        elevation={3} 
        sx={{ 
          padding: 2, 
          marginTop: 4, 
          borderRadius: 2, 
          boxShadow: 4,
          maxHeight: "60vh",  
          overflowY: "auto",
          bgcolor: "background.paper"
        }}
      >
        <Typography variant="h5" gutterBottom>
          Lista de Tareas
        </Typography>

        {tasks.length === 0 ? (
          <Typography color="text.secondary">No hay tareas aún.</Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default TaskList
