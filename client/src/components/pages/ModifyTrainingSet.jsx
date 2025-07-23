import styles from "./CreateTrainingPlan.module.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Title from "../text/Title";
import { useLocation, useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/useSystemMessage";
import { useTrainingPlan } from "../../app/useTrainingPlan";
import useGets from "../../hooks/useGetRequest";
import getAndSetInitialData from "../../utils/requests/initialData";
import { validateSet } from "../../utils/validators/formValidator";
import Stack from "../containers/Stack";
import TrainingSetForm from "../form/forms/TrainingSetForm";
import BackButton from "../form/buttons/BackButton";
import { useTranslation } from "react-i18next";

function ModifyExerciseSet() {
    const { t } = useTranslation();

    const location = useLocation();
    
    const navigate = useNavigate();
    
    const hasRun = useRef(false);
    
    const { notify } = useSystemMessage();
    
    const { trainingPlan, setTrainingPlan } = useTrainingPlan();
    
    const { getSetTypes } = useGets();
    const { getTrainingTechniques } = useGets();
    
    const exerciseDestination = useMemo(() => (
        `/trainers/me/create-training-plan/modify-training-day/modify-training-step/modify-exercise`
    ), []); 
    
    const [set, setSet] = useState({
        ID: null,
        orderInExercise: 1,
        minReps: "",
        maxReps: "",
        durationSeconds: "",
        restSeconds: "30",
        setType: null,
        trainingTechnique: null
    });
    const [error, setError] = useState(false);
    const [trainingDayOrder, setTrainingDayOrder] = useState(null);
    const [stepOrder, setStepOrder] = useState(null);
    const [exerciseOrder, setExerciseOrder] = useState(null);
    const [setTypes, setSetTypes] = useState([]);    
    const [trainingTechniques, setTrainingTechniques] = useState([]);

    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;
    
        const locationSetOrder = location.state?.setOrder;
        const locationSet = location.state?.set;
        const locationTrainingDayOrder = location.state?.orderInPlan;
        const locationStepOrder = location.state?.orderInDay;
        const locationExerciseOrder = location.state?.orderInStep

        if (!(locationSet || locationSetOrder) || !locationTrainingDayOrder || !locationStepOrder || !locationExerciseOrder) {
            navigate("/");
            
            notify(t("notFoundTrainingPlanInfo"), "error");

            return;
        }

        const fetchData = async () => {
            const setTypesSuccess = await getAndSetInitialData(
                getSetTypes,
                setSetTypes,
                { orderInPlan: locationTrainingDayOrder, orderInDay: locationStepOrder, exerciseOrder: locationExerciseOrder },
                navigate,
                exerciseDestination,
                "setTypes"
            );
    
            if (!setTypesSuccess) return;
    
            const trainingTechniquesSuccess = await getAndSetInitialData(
                getTrainingTechniques, 
                setTrainingTechniques, 
                { orderInPlan: locationTrainingDayOrder, orderInDay: locationStepOrder, exerciseOrder: locationExerciseOrder },
                navigate,
                exerciseDestination,
                "trainingTechniques"
            );

            if (!trainingTechniquesSuccess) return;

            setExerciseOrder(locationExerciseOrder);
    
            setStepOrder(locationStepOrder);
    
            setTrainingDayOrder(locationTrainingDayOrder);
            
            if (trainingPlan.trainingDays.some(trainingDayEl => trainingDayEl.orderInPlan === locationTrainingDayOrder)) {
                const trainingDay = trainingPlan.trainingDays
                    .find(trainingDayEl => trainingDayEl.orderInPlan === locationTrainingDayOrder);
    
                if (trainingDay.trainingSteps.some(trainingStepEl => trainingStepEl.orderInDay === locationStepOrder)) {
                    const trainingStep = trainingDay.trainingSteps
                        .find(trainingStepEl => trainingStepEl.orderInDay === locationStepOrder);
    
                    if (trainingStep.exercises.some(exerciseEl => exerciseEl.orderInStep === locationExerciseOrder)) {
                        const exercise = trainingStep.exercises
                            .find(exerciseEl => exerciseEl.orderInStep === locationExerciseOrder);
        
                        if (exercise.sets.some(setEl => setEl.orderInExercise === locationSetOrder)) {
                            setSet(exercise.sets.find(setEl => setEl.orderInExercise === locationSetOrder));
        
                            return;
                        }
                    }
                }
            }
    
            setSet(prevSet => 
                locationSet || 
                { ...prevSet, orderInExercise: locationSetOrder, ID: locationSetOrder }
            );
        }

        fetchData();
    }, [exerciseDestination, getSetTypes, getTrainingTechniques, location.state, navigate, notify, trainingPlan.trainingDays, t]);

    const validateAndSaveSet = useCallback(() => {
        if (!validateSet(
            error,
            setError,
            set.minReps,
            set.maxReps,
            set.durationSeconds,
            set.restSeconds,
            set.setType?.ID || null
        )) {
            notify(t("alertErrorSet"), "error");

            return false;
        }
        
        setTrainingPlan(prevTrainingPlan => ({ 
            ...prevTrainingPlan, 
            trainingDays: prevTrainingPlan.trainingDays.map(trainingDayEl => (
                trainingDayEl.orderInPlan === trainingDayOrder ?
                { 
                    ...trainingDayEl, 
                    trainingSteps: trainingDayEl.trainingSteps.map(trainingStepEl => (
                        trainingStepEl.orderInDay === stepOrder ?
                        { 
                            ...trainingStepEl, 
                            exercises: trainingStepEl.exercises.map(exerciseEl => (
                                exerciseEl.orderInStep === exerciseOrder ?
                                { 
                                    ...exerciseEl, 
                                    sets: (
                                        exerciseEl.sets.some(setEl => setEl.orderInExercise === set.orderInExercise) ?
                                        exerciseEl.sets.map(setEl => (
                                            setEl.orderInExercise === set.orderInExercise ?
                                            set :
                                            setEl
                                        )) :
                                        [...exerciseEl.sets, set]
                                    )
                                } :
                                exerciseEl
                            ))
                        } :
                        trainingStepEl
                    ))
                } :
                trainingDayEl
            ))
        }));

        return true;
    }, [error, exerciseOrder, notify, set, setTrainingPlan, stepOrder, trainingDayOrder, t]);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        if (!validateAndSaveSet()) return;

        navigate(exerciseDestination, { state: { orderInPlan: trainingDayOrder, orderInDay: stepOrder, exerciseOrder } });
    }, [exerciseDestination, exerciseOrder, navigate, stepOrder, trainingDayOrder, validateAndSaveSet]);

    useEffect(() => {
        document.title = t("modifySet");
    }, [t]);

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
                        text={t("modifySet")}
                    />

                    <Title
                        text={
                           set.ID && trainingDayOrder && stepOrder && exerciseOrder
                            ? `${t("set")} ${set.orderInExercise} ${t("ofExercise")} ${exerciseOrder} ${t("ofSequence")} ${stepOrder} ${t("ofDay")} ${trainingDayOrder}` 
                            : ""
                        }
                        headingNumber={2}
                        varColor="--light-theme-color"
                    />
                </Stack>
    
                <TrainingSetForm
                    set={set}
                    setSet={setSet}
                    setSetError={setError}
                    handleSubmit={handleOnSubmit}
                    setTypes={setTypes}
                    trainingTechniques={trainingTechniques}
                />
            </Stack>
        </main>
    );
}

export default ModifyExerciseSet;