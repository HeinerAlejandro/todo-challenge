import React, { useState, useContext } from "react";
import { TextField, Button, Container, Paper, Typography, Alert, Link } from "@mui/material";
import { AuthContext } from "../../context/Auth";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const { login } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Iniciar Sesión
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} margin="normal" required />
          <TextField fullWidth label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" required />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
            Iniciar Sesión
          </Button>
        </form>
        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          ¿No tienes una cuenta?{" "}
          <Link href="/register" underline="hover">
            Regístrate aquí
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginForm;
