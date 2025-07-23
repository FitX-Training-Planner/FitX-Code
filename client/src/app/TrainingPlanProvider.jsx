import { useCallback, useMemo, useState } from "react";
import TrainingPlanContext from "./TrainingPlanContext";

export const TrainingPlanProvider = ({ 
    children 
}) => {
    const defaultTrainingPlan = useMemo(() => ({
        ID: null,
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
