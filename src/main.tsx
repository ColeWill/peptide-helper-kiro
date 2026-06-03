import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PeptideProvider } from "./context/PeptideContext";
import App from "./App";
import "./styles/global.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PeptideProvider>
        <App />
      </PeptideProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
