import React from "react";
import { Container } from "@mui/material";
import RegisterPage from "../components/Auth/Register";

const LoginPage: React.FC = () => {
  return (
    <Container>
      <RegisterPage />
    </Container>
  );
};

export default LoginPage;