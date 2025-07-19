import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import { ConfirmIdentityCallbackProvider } from "./app/ConfirmIdentityCallbackProvider.jsx";
import { SystemMessageProvider } from "./app/SystemMessageProvider.jsx";
import { TrainingPlanProvider } from "./app/TrainingPlanProvider.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import "./i18n";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Provider 
        store={store} 
      >
        <SystemMessageProvider>
          <ConfirmIdentityCallbackProvider>
            <TrainingPlanProvider>
              <App />
            </TrainingPlanProvider>
          </ConfirmIdentityCallbackProvider>
        </SystemMessageProvider>
      </Provider>
    </Router>
  </StrictMode>,
);
