import { createContext, useCallback, useContext, useMemo, useState } from "react";

const TrainingPlanContext = createContext();

export const TrainingPlanProvider = ({ children }) => {
    const defaultTrainingPlan = useMemo(() => ({
        name: "",
        note: "",
        trainingDays: []
    }), []);

    const [trainingPlan, setTrainingPlan] = useState(defaultTrainingPlan);

    const resetTrainingPlan = useCallback(() => {
        setTrainingPlan(defaultTrainingPlan);
    }, [defaultTrainingPlan]);

    return (
        <TrainingPlanContext.Provider 
            value={{ trainingPlan, setTrainingPlan, resetTrainingPlan }}
        >
            {children}
        </TrainingPlanContext.Provider>
    );
};

export function useTrainingPlan() {
  return useContext(TrainingPlanContext);
}