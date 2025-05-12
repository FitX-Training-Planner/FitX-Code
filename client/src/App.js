import CreateConfig from "./components/pages/CreateConfig";
import Login from "./components/pages/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login/>}
        />

        <Route
          path="/create-config"
          element={<CreateConfig/>}
        />

        <Route
          path="/recover-password"
        />
      </Routes>
    </Router>
  );
}

export default App;