import { useEffect, useRef } from "react";
import CodeConfirmation from "./components/pages/CodeConfirmation";
import CreateConfig from "./components/pages/CreateConfig";
import CreateTrainer from "./components/pages/CreateTrainer";
import Login from "./components/pages/Login";
import { Routes, Route, useLocation } from "react-router-dom";
import api from "./api/axios";
import useRequest from "./hooks/useRequest";
import { useDispatch } from "react-redux";
import { setUser } from "./slices/user/userSlice";
import Home from "./components/pages/Home";
import RecoverPassword from "./components/pages/RecoverPassword";
import CreateTrainingPlan from "./components/pages/CreateTrainingPlan";
import ModifyTrainingDay from "./components/pages/ModifyTrainingDay";
import ModifyCardioSession from "./components/pages/ModifyCardioSession";
import ModifyExerciseSet from "./components/pages/ModifyTrainingSet";
import ModifyTrainingStep from "./components/pages/ModifyTrainingStep";
import ModifyExercise from "./components/pages/ModifyTrainingExercise";

function App() {
  const dispatch = useDispatch();

  const location = useLocation();
  
  const { request: getUserRequest } = useRequest();

  const hasRun = useRef(false);

  useEffect(() => {
    const excludedPaths = ["/login", "/create-config", "/code-confirmation", "/create-trainer", "/recover-password"];

    if (excludedPaths.includes(location.pathname)) return;

    if (hasRun.current) return;
    hasRun.current = true;

    const postTrainer = () => api.get("/users/me");

    const handleOnPostTrainerSuccess = (data) => {
      dispatch(setUser(data));
    };

    getUserRequest(postTrainer, handleOnPostTrainerSuccess, () => undefined, "Recuperando usuário", "Usuário recuperado!", "Falha ao recuperar usuário!");
  }, [dispatch, getUserRequest, location.pathname]);

  return (
    <Routes>
      <Route
        exact
        path="/"
        element={<Home />}
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
        element={<RecoverPassword />}
      />

      <Route
        path="/trainers/me/create-training-plan"
        element={<CreateTrainingPlan />}
      />

      <Route
        path="/trainers/me/create-training-plan/modify-training-day"
        element={<ModifyTrainingDay />}
      />

      <Route
        path="/trainers/me/create-training-plan/modify-training-day/modify-cardio-session"
        element={<ModifyCardioSession />}
      />

      <Route
        path="/trainers/me/create-training-plan/modify-training-day/modify-training-step"
        element={<ModifyTrainingStep />}
      />

      <Route
        path="/trainers/me/create-training-plan/modify-training-day/modify-training-step/modify-exercise"
        element={<ModifyExercise />}
      />

      <Route
        path="/trainers/me/create-training-plan/modify-training-day/modify-training-step/modify-exercise/modify-set"
        element={<ModifyExerciseSet />}
      />
    </Routes>
  );
}

export default App;