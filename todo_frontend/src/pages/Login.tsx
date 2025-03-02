import React from "react";
import LoginForm from "../components/Auth/Login";
import { Container } from "@mui/material";

const LoginPage: React.FC = () => {
  return (
    <Container>
      <LoginForm />
    </Container>
  );
};

export default LoginPage;