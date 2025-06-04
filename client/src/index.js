import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import "./index.css";
import App from "./App";
import { ConfirmIdentityCallbackProvider } from "./app/ConfirmIdentityCallbackProvider.js";
import { SystemMessageProvider } from "./app/SystemMessageProvider.js";
import { TrainingPlanProvider } from "./app/TrainingPlanProvider.js";
import { BrowserRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>  
    <Router>
      <Provider store={store} >
        <SystemMessageProvider>
          <ConfirmIdentityCallbackProvider>
            <TrainingPlanProvider>
              <App />
            </TrainingPlanProvider>
          </ConfirmIdentityCallbackProvider>
        </SystemMessageProvider>
      </Provider>
    </Router>
  </React.StrictMode>
);