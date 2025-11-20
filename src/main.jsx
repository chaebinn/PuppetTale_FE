import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { PuppetProvider } from "./context/PuppetContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PuppetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PuppetProvider>
  </StrictMode>
);
