import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/Auth";
import LoginPage from "./pages/Login";
import TaskList from "./components/Tasks";
import { Container, Typography, Button, Grid2 as Grid, Paper } from "@mui/material";
import { TaskProvider } from "./context/Task";
import TaskForm from "./components/Tasks/TaskForm";
import { TagProvider } from "./context/Tags";
import RegisterPage from "./components/Auth/Register";

const Home: React.FC = () => {
  const { logout } = useContext(AuthContext)!;

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      {/* Header */}
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold">
          TODO List
        </Typography>
        <Button variant="contained" color="secondary" onClick={logout}>
          Cerrar Sesión
        </Button>
      </Grid>

      {/* Contenido */}
      <Grid container spacing={4} sx={{ mt: 3 }}>
        {/* Formulario de tareas */}
        <Grid size={{xs: 12, md: 5}}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: "#f8f9fa" }}>
            <TaskForm />
          </Paper>
        </Grid>

        {/* Lista de tareas */}
        <Grid size={{xs: 12, md: 7}}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: "#ffffff" }}>
            
                <TaskList />

          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useContext(AuthContext)!;
  return token ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TagProvider>
        <TaskProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            </Routes>
          </Router>
        </TaskProvider>
      </TagProvider>
    </AuthProvider>
  );
};

export default App;
