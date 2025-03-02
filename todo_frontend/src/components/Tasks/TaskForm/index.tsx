import { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import TagSelect from "./TagSelect";
import { createTask } from "../../../api/tasks"; 
import { TaskContext } from "../../../context/Task";


const TaskForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(3);
  const [finishAt, setFinishAt] = useState(dayjs().add(1, "day")); // Fecha mínima: mañana
  const [tags, setTags] = useState([]);
  const { addTask } = useContext(TaskContext)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTask = {
      title,
      description,
      priority,
      finish_at: finishAt.toISOString(),
      tags: tags.map((tag) => tag.id),
    };
    
    const task = await createTask(newTask);
    addTask(task)
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority(3);
    setFinishAt(dayjs().add(1, "day"));
    setTags([]);
  };

  return (
    
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, maxWidth: 500, mx: "auto" }}>
        <Typography variant="h6">Nueva Tarea</Typography>

        {/* Campo Título */}
        <TextField
          label="Título"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />


        <TextField
          label="Descripción"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextField
          select
          label="Prioridad"
          fullWidth
          margin="normal"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
        >
          <MenuItem value={1}>Alta</MenuItem>
          <MenuItem value={2}>Media</MenuItem>
          <MenuItem value={3}>Baja</MenuItem>
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Fecha de Finalización"
            value={finishAt}
            minDate={dayjs()}
            sx={{color: "white", mt: 2, width: "100%"}}
            onChange={(date) => setFinishAt(date ?? dayjs().add(1, "day"))}
          />
        </LocalizationProvider>
        <TagSelect selectedTags={tags} setSelectedTags={setTags} />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Guardar Tarea
        </Button>
      </Box>
  );
};

export default TaskForm;
