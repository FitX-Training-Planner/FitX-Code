import { useContext } from "react";
import TrainingPlanContext from "./TrainingPlanContext";

export function useTrainingPlan() {
  return useContext(TrainingPlanContext);
}
