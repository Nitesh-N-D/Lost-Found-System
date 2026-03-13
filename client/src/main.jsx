import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "rgba(15,23,42,0.96)",
            color: "#e5e7eb",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "18px",
            boxShadow: "0 12px 32px rgba(2,6,23,0.28)",
            padding: "14px 16px",
            backdropFilter: "blur(12px)",
          },
          success: {
            iconTheme: {
              primary: "#ffffff",
              secondary: "#0f172a",
            },
          },
          error: {
            iconTheme: {
              primary: "#fb7185",
              secondary: "#0f172a",
            },
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>
);
