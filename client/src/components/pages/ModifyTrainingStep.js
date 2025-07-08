import styles from "./CreateTrainingPlan.module.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Title from "../text/Title";
import { useLocation, useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/SystemMessageProvider";
import { useTrainingPlan } from "../../app/TrainingPlanProvider";
import { getNextOrder, removeAndReorder } from "../../utils/generators/generateOrder";
import Stack from "../containers/Stack";
import TrainingStepForm from "../form/forms/TrainingStepForm";
import duplicateObjectInObjectList from "../../utils/generators/duplicate";
import BackButton from "../form/buttons/BackButton";

function ModifyTrainingStep() {
    const location = useLocation();
    
    const navigate = useNavigate();
    
    const hasRun = useRef(false);
    
    const { notify } = useSystemMessage();
    const { confirm } = useSystemMessage();
    
    const { trainingPlan, setTrainingPlan } = useTrainingPlan();
    
    const exerciseDestination = useMemo(() => (
        `/trainers/me/create-training-plan/modify-training-day/modify-training-step/modify-exercise`
    ), []);

    const [step, setStep] = useState({
        ID: null,
        orderInDay: 1,
        exercises: []
    });
    const [trainingDayOrder, setTrainingDayOrder] = useState(null);
    
    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;
    
        const locationStepOrder = location.state?.stepOrder;
        const locationTrainingStep = location.state?.trainingStep;
        const locationTrainingDayOrder = location.state?.orderInPlan;

        if (!(locationTrainingStep || locationStepOrder) || !locationTrainingDayOrder) {
            navigate("/");
            
            notify("As informações do plano de treino não foram encontradas.", "error");

            return;
        }

        setTrainingDayOrder(locationTrainingDayOrder);

        if (trainingPlan.trainingDays.some(trainingDayEl => trainingDayEl.orderInPlan === locationTrainingDayOrder)) {
            const trainingDay = trainingPlan.trainingDays
                .find(trainingDayEl => trainingDayEl.orderInPlan === locationTrainingDayOrder);

            if (trainingDay.trainingSteps.some(trainingStepEl => trainingStepEl.orderInDay === locationStepOrder)) {
                setStep(trainingDay.trainingSteps.find(trainingStepEl => trainingStepEl.orderInDay === locationStepOrder));

                return;
            }
        }

        setStep(prevStep => 
            locationTrainingStep || 
            { ...prevStep, orderInDay: locationStepOrder, ID: locationStepOrder }
        );
    }, [location.state, navigate, notify, trainingPlan.trainingDays]);

    const saveTrainingStep = useCallback(() => {
        setTrainingPlan(prevTrainingPlan => ({ 
            ...prevTrainingPlan, 
            trainingDays: prevTrainingPlan.trainingDays.map(trainingDayEl => (
                trainingDayEl.orderInPlan === trainingDayOrder ?
                { 
                    ...trainingDayEl, 
                    trainingSteps: (
                        trainingDayEl.trainingSteps.some(trainingStepEl => trainingStepEl.orderInDay === step.orderInDay) ?
                        trainingDayEl.trainingSteps.map(trainingStepEl => (
                            trainingStepEl.orderInDay === step.orderInDay ?
                            step :
                            trainingStepEl
                        )) :
                        [...trainingDayEl.trainingSteps, step]
                    )
                } :
                trainingDayEl
            ))
        }));
    }, [setTrainingPlan, step, trainingDayOrder]);

    const addExercise = useCallback(() => {
        if (step.exercises.length >= 4) {
            notify("Você atingiu o limite de 4 exercícios consecutivos para esta etapa de treino.", "error");

            return;
        }

        saveTrainingStep();

        navigate(
            exerciseDestination, 
            { 
                state: { 
                    exerciseOrder: getNextOrder(step.exercises, "orderInStep"), 
                    orderInDay: step.orderInDay, 
                    orderInPlan: trainingDayOrder 
                } 
            }
        )
    }, [exerciseDestination, navigate, notify, saveTrainingStep, step.exercises, step.orderInDay, trainingDayOrder]);

    const duplicateExercise = useCallback((exercise) => {
        duplicateObjectInObjectList(
            exercise, 
            step.exercises, 
            "exercises", 
            4, 
            "Você atingiu o limite de 4 exercícios consecutivos para esta sequência.", 
            notify, 
            "orderInStep", 
            setStep
        )
    }, [notify, step.exercises]);

    const modifyExercise = useCallback(exercise => {
        saveTrainingStep();

        navigate(
            exerciseDestination, 
            { 
                state: { 
                    exercise,
                    orderInDay: step.orderInDay, 
                    orderInPlan: trainingDayOrder 
                } 
            }
        )
    }, [exerciseDestination, navigate, saveTrainingStep, step.orderInDay, trainingDayOrder]);

    const removeExercise = useCallback(async order => {
        const userConfirmed = await confirm("Deseja remover esse exercício da sua sequência?");
        
        if (userConfirmed) {
            setStep(prevTrainingStep => ({
                ...prevTrainingStep,
                exercises: removeAndReorder(prevTrainingStep.exercises, "orderInStep", order)
            }));

            notify("Exercício da sequência removido!", "success");
        }
    }, [confirm, notify]);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        saveTrainingStep();

        const destination = `/trainers/me/create-training-plan/modify-training-day`;

        navigate(destination, { state: { trainingDayOrder } });
    }, [navigate, saveTrainingStep, trainingDayOrder]);

    useEffect(() => {
        document.title = "Modificar Sequência do Treino";
    }, []);

    return (
        <main
            className={styles.training_plan_page}
        >
            <BackButton/>
            
            <Stack
                gap="3em"
            >
                <Stack>
                    <Title
                        headingNumber={1}
                        text="Modificar Sequência do Treino"
                    />

                    <Title
                        text={step.ID && trainingDayOrder ? `Sequência ${step.orderInDay} do Dia ${trainingDayOrder}` : ""}
                        headingNumber={2}
                        varColor="--light-theme-color"
                    />
                </Stack>

                <TrainingStepForm
                    trainingStep={step}
                    setTrainingStep={setStep}
                    handleSubmit={handleOnSubmit}
                    handleAddExercise={addExercise}
                    handleDuplicateExercise={duplicateExercise}
                    handleModifyExercise={modifyExercise}
                    handleRemoveExercise={removeExercise}
                />
            </Stack>
        </main>
    );
}

export default ModifyTrainingStep;