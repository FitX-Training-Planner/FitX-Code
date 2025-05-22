import React from "react";
import ReactDOM from "react-dom/client";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import history from "./history";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import "./index.css";
import App from "./App";
import { ConfirmIdentityCallbackProvider } from "./app/ConfirmIdentityCallbackProvider.js";
import { SystemMessageProvider } from "./app/SystemMessageProvider.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>  
    <Provider store={store} >
      <SystemMessageProvider>
        <ConfirmIdentityCallbackProvider>
          <HistoryRouter history={history}>
            <App />
          </HistoryRouter>
        </ConfirmIdentityCallbackProvider>
      </SystemMessageProvider>
    </Provider>
  </React.StrictMode>
);