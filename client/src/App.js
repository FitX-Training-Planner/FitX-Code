import CodeConfirmation from "./components/pages/CodeConfirmation";
import CreateConfig from "./components/pages/CreateConfig";
import CreateTrainer from "./components/pages/CreateTrainer";
import Login from "./components/pages/Login";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/create-config"
        element={<CreateConfig />}
      />

      <Route
        path="/create-trainer"
        element={<CreateTrainer />}
      />

      <Route
        path="/code-confirmation"
        element={<CodeConfirmation />}
      />

      <Route
        path="/recover-password"
      />
    </Routes>
  );
}

export default App;