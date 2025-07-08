import { useEffect, useRef } from "react";
import CodeConfirmation from "./components/pages/CodeConfirmation";
import CreateConfig from "./components/pages/CreateConfig";
import CreateTrainer from "./components/pages/CreateTrainer";
import Login from "./components/pages/Login";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import api from "./api/axios";
import useRequest from "./hooks/useRequest";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./slices/user/userSlice";
import Home from "./components/pages/Home";
import RecoverPassword from "./components/pages/RecoverPassword";
import CreateTrainingPlan from "./components/pages/CreateTrainingPlan";
import ModifyTrainingDay from "./components/pages/ModifyTrainingDay";
import ModifyCardioSession from "./components/pages/ModifyCardioSession";
import ModifyExerciseSet from "./components/pages/ModifyTrainingSet";
import ModifyTrainingStep from "./components/pages/ModifyTrainingStep";
import ModifyExercise from "./components/pages/ModifyTrainingExercise";
import TrainingPlans from "./components/pages/TrainingPlans";
import ChatBot from "./components/pages/ChatBot";
import TrainingPlan from "./components/pages/TrainingPlan";

function App() {
  const dispatch = useDispatch();

  const user = useSelector(state => state.user);

  const navigate = useNavigate();

  const location = useLocation();
  
  const { request: getUserRequest } = useRequest();

  const hasRun = useRef(false);
  
  useEffect(() => {
    const excludedPaths = ["/login", "/create-config", "/code-confirmation", "/create-trainer", "/recover-password"];

    if (excludedPaths.includes(location.pathname)) return;

    if (hasRun.current) return;

    hasRun.current = true;

    const getUser = () => {
      return api.get("/users/me");
    };

    const handleOnGetUserSuccess = (data) => {
      dispatch(setUser(data));
    };

    const handleOnGetUserError = (err) => {
      if (err?.response?.status === 404) {
        navigate("/login");
      }
    }

    getUserRequest(getUser, handleOnGetUserSuccess, handleOnGetUserError, undefined, undefined, "Falha ao recuperar usuário!");
  }, [dispatch, getUserRequest, location.pathname, navigate]);

  useEffect(() => {
    const theme = user.config.isDarkTheme ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", theme);

    const language = user.config.isEnglish ? "en" : "pt-BR";

    document.documentElement.setAttribute("lang", language);
  }, [user.config.isDarkTheme, user.config.isEnglish]);

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
        path="/trainers/me/training-plans"
        element={<TrainingPlans />}
      />

      <Route
        path="/trainers/me/training-plans/:id"
        element={<TrainingPlan />}
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

      <Route 
        path="/questions-chatbot"
        element={<ChatBot />}
      />
    </Routes>
  );
}

export default App;