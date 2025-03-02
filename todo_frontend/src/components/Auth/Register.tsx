import { useState } from "react";
import { TextField, Button, Link, Typography, Alert, Container, Paper } from "@mui/material";
import { login, register } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { User } from "../../models/auth.model";

interface RegisterErrors {
  error: string[];
  password: string[];
  username: string[];
  email: string[];
  first_name: string[];
  last_name: string[];
}

const DefaultErrors = {
  error: [],
  password: [],
  username: [],
  email: [],
  first_name: [],
  last_name: [],
};

const RegisterPage: React.FC = () => {
  const [userForm, setUserForm] = useState<User>({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
  });

  const [errors, setErrors] = useState<RegisterErrors>(DefaultErrors);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getIsDisabled = () => {
    const allFieldFilleds = Object.values(userForm).reduce(
      (prev, current) => prev && current !== "",
      true
    );
    return !allFieldFilleds || userForm.password !== userForm.password2;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name !== "password")
        setUserForm((prev) => ({ ...prev, [name]: value }));
    else {
        setUserForm((prev) => ({ ...prev, ["password"]: value, ["password2"]: value }));
    }
    
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors(DefaultErrors);

    const validationErrors: RegisterErrors = { ...DefaultErrors };

    if (!userForm.username) validationErrors.username.push("El usuario es obligatorio.");
    if (!userForm.email) validationErrors.email.push("El correo electrónico es obligatorio.");
    if (!userForm.password) validationErrors.password.push("La contraseña es obligatoria.");
    if (!userForm.first_name) validationErrors.first_name.push("El nombre es obligatorio.");
    if (!userForm.last_name) validationErrors.last_name.push("El apellido es obligatorio.");

    if (Object.values(validationErrors).some((fieldErrors) => fieldErrors.length > 0)) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const isRegistered = await register(userForm);
      if (isRegistered) {
        await login(userForm.username, userForm.password);
        navigate("/");
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        error: ["Hubo un error al intentar registrarse. Inténtalo de nuevo más tarde."]
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Registro de Usuario
        </Typography>

        {/* Mostrar errores generales y específicos */}
        {errors?.error.length > 0 && <Alert severity="error">{errors.error.join(", ")}</Alert>}
        {errors?.username.length > 0 && <Alert severity="error">{errors.username.join(", ")}</Alert>}
        {errors?.email.length > 0 && <Alert severity="error">{errors.email.join(", ")}</Alert>}
        {errors?.password.length > 0 && <Alert severity="error">{errors.password.join(", ")}</Alert>}
        {errors?.first_name.length > 0 && <Alert severity="error">{errors.first_name.join(", ")}</Alert>}
        {errors?.last_name.length > 0 && <Alert severity="error">{errors.last_name.join(", ")}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Usuario"
            fullWidth
            margin="normal"
            value={userForm.username}
            name="username"
            onChange={onChange}
            required
            error={errors.username.length > 0}
            helperText={errors.username.length > 0 ? errors.username.join(", ") : ""}
          />

          <TextField
            label="Correo Electrónico"
            fullWidth
            margin="normal"
            value={userForm.email}
            name="email"
            onChange={onChange}
            required
            error={errors.email.length > 0}
            helperText={errors.email.length > 0 ? errors.email.join(", ") : ""}
          />

          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={userForm.password}
            name="password"
            onChange={onChange}
            required
            error={errors.password.length > 0}
            helperText={errors.password.length > 0 ? errors.password.join(", ") : ""}
          />

          <TextField
            label="Nombre"
            fullWidth
            margin="normal"
            value={userForm.first_name}
            name="first_name"
            onChange={onChange}
            required
            error={errors.first_name.length > 0}
            helperText={errors.first_name.length > 0 ? errors.first_name.join(", ") : ""}
          />

          <TextField
            label="Apellido"
            fullWidth
            margin="normal"
            value={userForm.last_name}
            name="last_name"
            onChange={onChange}
            required
            error={errors.last_name.length > 0}
            helperText={errors.last_name.length > 0 ? errors.last_name.join(", ") : ""}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={getIsDisabled()}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </Button>
        </form>
        <Link href="/login" underline="hover">
            Inicia Sesion
        </Link>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
