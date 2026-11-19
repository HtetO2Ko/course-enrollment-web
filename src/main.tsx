import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeContext.ts";
import QueryProvider from "./providers/QueryProvider";
import "./index.css";
import "./i18n";
import "./services/api/interceptors";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </QueryProvider>
  </StrictMode>,
);
