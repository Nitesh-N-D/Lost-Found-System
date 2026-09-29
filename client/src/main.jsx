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
            background: "#ffffff",
            color: "#202a28",
            border: "1px solid #e5eae4",
            borderRadius: "18px",
            boxShadow: "0 12px 32px rgba(32,53,43,0.12)",
            padding: "14px 16px",
          },
          success: {
            iconTheme: {
              primary: "#173d35",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#fb7185",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>
);
