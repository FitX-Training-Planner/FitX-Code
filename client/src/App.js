import { useEffect, useRef } from "react";
import CodeConfirmation from "./components/pages/CodeConfirmation";
import CreateConfig from "./components/pages/CreateConfig";
import CreateTrainer from "./components/pages/CreateTrainer";
import Login from "./components/pages/Login";
import { Routes, Route } from "react-router-dom";
import api from "./api/axios";
import useRequest from "./hooks/useRequest";
import { useDispatch } from "react-redux";
import { setUser } from "./slices/user/userSlice";

function App() {
  const dispatch = useDispatch();
  
  const { request: getUserRequest } = useRequest();

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
      
    hasRun.current = true;
      
    const postTrainer = () => {
      return api.get("/users/me");
    };

    const handleOnPostTrainerSuccess = (data) => {
      dispatch(setUser(data));
    }

    getUserRequest(postTrainer, handleOnPostTrainerSuccess, () => undefined, "Recuperando usuário", "Usuário recuperado!", "Falha ao recuperar usuário!");
  }, [dispatch, getUserRequest]);

  return (
    <Routes>
      <Route
        exact
        path="/"
      />

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