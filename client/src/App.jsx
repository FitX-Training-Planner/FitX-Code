import { useEffect, useRef, useState } from "react";
import CodeConfirmation from "./components/pages/CodeConfirmation";
import CreateConfig from "./components/pages/CreateConfig";
import CreateTrainer from "./components/pages/CreateTrainer";
import Login from "./components/pages/Login";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import api from "./api/axios";
import useRequest from "./hooks/useRequest";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./slices/user/userSlice";
import ClientHome from "./components/pages/ClientHome";
import TrainerHome from "./components/pages/TrainerHome";
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
import TrainerPayments from "./components/pages/TrainerPayments";
import CreatePaymentPlan from "./components/pages/CreatePaymentPlan";
import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();

  const user = useSelector(state => state.user);

  const navigate = useNavigate();

  const location = useLocation();
  
  const { request: getUserRequest } = useRequest();

  const hasRun = useRef(false);

  const [canRender, setCanRender] = useState(false);
  
  useEffect(() => {
    const excludedPaths = [
      "/login",
      "/create-config",
      "/code-confirmation",
      "/create-trainer",
      "/recover-password"
    ];

    const shouldSkip = excludedPaths.includes(location.pathname);

    if (shouldSkip) setCanRender(true);
    
    if (!shouldSkip && !hasRun.current) {
      hasRun.current = true;
      
      const getUser = () => {
        return api.get("/users/me");
      };

      const handleOnGetUserSuccess = (data) => {
        dispatch(setUser(data));

        setCanRender(true);
      };

      const handleOnGetUserError = (err) => {
        if (err?.response?.status === 404) {
          navigate("/login");
        }
      };

      getUserRequest(
        getUser,
        handleOnGetUserSuccess,
        handleOnGetUserError,
        t("loadingUser"),
        undefined,
        t("errorUser")
      );
    }

    const theme = user.config.isDarkTheme ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", theme);
  }, [dispatch, getUserRequest, location.pathname, navigate, user.config.isDarkTheme, t]);

  useEffect(() => {
    const isEnglish = user.ID ? user.config.isEnglish : navigator.language?.toLowerCase().startsWith("en");

    const lang = isEnglish ? "en" : "pt-BR";

    if (i18n.language !== lang) i18n.changeLanguage(lang);

    document.documentElement.setAttribute("lang", lang);
  }, [user.config.isEnglish, user.ID, i18n]);

  return (
    canRender && (
      <Routes>
        <Route
          exact
          path="/"
          element={user.config.isClient ? (
            <ClientHome />
          ) : (
            <TrainerHome />
          )}
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
          path="/trainers/me/payments"
          element={<TrainerPayments />}
        />

        <Route
          path="/trainers/me/create-payment-plan"
          element={<CreatePaymentPlan />}
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
    )
  );
}

export default App;