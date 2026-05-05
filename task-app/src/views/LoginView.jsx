import React from "react";
import LoginBrand from "../components/auth/LoginBrand";
import LoginForm from "../components/auth/LoginForm";

export default function LoginView() {
  return (
    <div className="login-page">
      <div className="login-bg-shape login-bg-shape-1" />
      <div className="login-bg-shape login-bg-shape-2" />
      <div className="login-dots" />

      <LoginBrand />
      <div className="login-divider" />
      <LoginForm />
    </div>
  );
}
