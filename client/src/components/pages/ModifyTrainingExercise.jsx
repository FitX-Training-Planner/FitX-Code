import styles from "./CreateTrainingPlan.module.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Title from "../text/Title";
import { useLocation, useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/useSystemMessage";
import { useTrainingPlan } from "../../app/useTrainingPlan";
import { getNextOrder, removeAndReorder } from "../../utils/generators/generateOrder";
import { validateExercise } from "../../utils/validators/formValidator";
import useGets from "../../hooks/useGetRequest";
import getAndSetInitialData from "../../utils/requests/initialData";
import Stack from "../containers/Stack";
import TrainingExerciseForm from "../form/forms/TrainingExerciseForm";
import duplicateObjectInObjectList from "../../utils/generators/duplicate";
import BackButton from "../form/buttons/BackButton";
import { useTranslation } from "react-i18next";

function ModifyExercise() {
    const { t } = useTranslation();

    const location = useLocation();
    
    const navigate = useNavigate();
    
    const hasRun = useRef(false);
    
    const { notify } = useSystemMessage();
    const { confirm } = useSystemMessage();
    
    const { trainingPlan, setTrainingPlan } = useTrainingPlan();
    
    const { getExercises } = useGets();
    const { getExerciseEquipments } = useGets();
    const { getBodyPositions } = useGets();
    const { getPulleyHeights } = useGets();
    const { getPulleyAttachments } = useGets();
    const { getGripTypes } = useGets();
    const { getGripWidths } = useGets();
    const { getLateralities } = useGets();
    
    const setDestination = useMemo(() => (
        `/trainers/me/create-training-plan/modify-training-day/modify-training-step/modify-exercise/modify-set`
    ), []);
    const stepDestination = useMemo(() => (
        `/trainers/me/create-training-plan/modify-training-day/modify-training-step`
    ), []); 

    const [exercise, setExercise] = useState({
        ID: null,
        orderInStep: 1,
        note: "",
        exercise: null,
        exerciseEquipment: null,
        bodyPosition: null,
        pulleyHeight: null,
        pulleyAttachment: null,
        gripType: null,
        gripWidth: null,
        laterality: null,
        sets: []
    });
    const [error, setError] = useState(false);
    const [trainingDayOrder, setTrainingDayOrder] = useState(null);
    const [stepOrder, setStepOrder] = useState(null);
    const [exercises, setExercises] = useState([]);    
    const [exerciseEquipments, setExerciseEquipments] = useState([]);
    const [bodyPositions, setBodyPositions] = useState([]);
    const [pulleyHeights, setPulleyHeights] = useState([]);
    const [pulleyAttachments, setPulleyAttachments] = useState([]);
    const [gripTypes, setGripTypes] = useState([]);
    const [gripWidths, setGripWidths] = useState([]);
    const [lateralities, setLateralities] = useState([]);
    
    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;
    
        const locationExerciseOrder = location.state?.exerciseOrder;
        const locationExercise = location.state?.exercise;
        const locationTrainingDayOrder = location.state?.orderInPlan;
        const locationStepOrder = location.state?.orderInDay;

        if (!(locationExercise || locationExerciseOrder) || !locationTrainingDayOrder || !locationStepOrder) {
            navigate("/");
            
            notify(t("notFoundTrainingPlanInfo"), "error");

            return;
        }

        const fetchData = async () => {
            const exercisesSuccess = await getAndSetInitialData(
                getExercises,
                setExercises,
                { orderInPlan: locationTrainingDayOrder, stepOrder: locationStepOrder },
                navigate,
                stepDestination,
                "exercises"
            );
    
            if (!exercisesSuccess) return;
    
            const exerciseEquipmentsSuccess = await getAndSetInitialData(
                getExerciseEquipments, 
                setExerciseEquipments, 
                { orderInPlan: locationTrainingDayOrder, stepOrder: locationStepOrder },
                navigate,
                stepDestination,
                "exerciseEquipments"
            );

            if (!exerciseEquipmentsSuccess) return;

            const bodyPositionsSuccess = await getAndSetInitialData(
                getBodyPositions,
                setBodyPositions,
                { orderInPlan: locationTrainingDayOrder, stepOrder: locationStepOrder },
                navigate,
                stepDestination,
                "bodyPositions"
            );
    
            if (!bodyPositionsSuccess) return;
    
            const pulleyHeightsSuccess = await getAndSetInitialData(
                getPulleyHeights, 
                setPulleyHeights, 
                { orderInPlan: locationTrainingDayOrder, stepOrder: locationStepOrder },
                navigate,
                stepDestination,
                "pulleyHeights"
            );

            if (!pulleyHeightsSuccess) return;

            const pulleyAttachmentsSuccess = await getAndSetInitialData(
                getPulleyAttachments,
                setPulleyAttachments,
                { orderInPlan: locationTrainingDayOrder, stepOrder: locationStepOrder },
                navigate,
                stepDestination,
                "pulleyAttachments"
            );
    
            if (!pulleyAttachmentsSuccess) return;
    
            const gripTypesSuccess = await getAndSetInitialData(
                getGripTypes, 
                setGripTypes, 
                { orderInPlan: locationTrainingDayOrder, stepOrder: locationStepOrder },
                navigate,
                stepDestination,
                "gripTypes"
            );

            if (!gripTypesSuccess) return;

            const gripWidthsSuccess = await getAndSetInitialData(
                getGripWidths,
                setGripWidths,
                { orderInPlan: locationTrainingDayOrder, stepOrder: locationStepOrder },
                navigate,
                stepDestination,
                "gripWidths"
            );
    
            if (!gripWidthsSuccess) return;
    
            const lateralitiesSuccess = await getAndSetInitialData(
                getLateralities, 
                setLateralities, 
                { orderInPlan: locationTrainingDayOrder, stepOrder: locationStepOrder },
                navigate,
                stepDestination,
                "lateralities"
            );

            if (!lateralitiesSuccess) return;
    
            setStepOrder(locationStepOrder);
    
            setTrainingDayOrder(locationTrainingDayOrder);
            
            if (trainingPlan.trainingDays.some(trainingDayEl => trainingDayEl.orderInPlan === locationTrainingDayOrder)) {
                const trainingDay = trainingPlan.trainingDays
                    .find(trainingDayEl => trainingDayEl.orderInPlan === locationTrainingDayOrder);
    
                if (trainingDay.trainingSteps.some(trainingStepEl => trainingStepEl.orderInDay === locationStepOrder)) {
                    const trainingStep = trainingDay.trainingSteps
                        .find(trainingStepEl => trainingStepEl.orderInDay === locationStepOrder);
    
                    if (trainingStep.exercises.some(exerciseEl => exerciseEl.orderInStep === locationExerciseOrder)) {
                        setExercise(trainingStep.exercises.find(exerciseEl => exerciseEl.orderInStep === locationExerciseOrder));
    
                        return;
                    }
                }
            }
    
            setExercise(prevExercise => 
                locationExercise || 
                { ...prevExercise, orderInStep: locationExerciseOrder, ID: locationExerciseOrder }
            );
        }

        fetchData();
    }, [getBodyPositions, getExerciseEquipments, getExercises, getGripTypes, getGripWidths, getLateralities, getPulleyAttachments, getPulleyHeights, location.state, navigate, notify, stepDestination, trainingPlan.trainingDays, t]);

    const validateAndSaveExercise = useCallback(() => {
        if (!validateExercise(
            error,
            setError,
            exercise.note,
            exercise.exercise?.ID || null,
            exercise.exerciseEquipment?.ID || null,
            exercise.exercise?.isFixed || null
        )) {
            notify(t("alertErrorExercise"), "error");

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
                            exercises: (
                                trainingStepEl.exercises.some(exerciseEl => exerciseEl.orderInStep === exercise.orderInStep) ?
                                trainingStepEl.exercises.map(exerciseEl => (
                                    exerciseEl.orderInStep === exercise.orderInStep ?
                                    exercise :
                                    exerciseEl
                                )) :
                                [...trainingStepEl.exercises, exercise]
                            )
                        } :
                        trainingStepEl
                    ))
                } :
                trainingDayEl
            ))
        }));

        return true;
    }, [error, exercise, notify, setTrainingPlan, stepOrder, trainingDayOrder, t]);

    const addSet = useCallback(() => {
        if (exercise.sets.length >= 10) {
            notify(t("limitAlertSets"), "error");

            return;
        }

        if (!validateAndSaveExercise()) return;

        navigate(
            setDestination, 
            { 
                state: { 
                    setOrder: getNextOrder(exercise.sets, "orderInExercise"), 
                    orderInStep: exercise.orderInStep,
                    orderInDay: stepOrder, 
                    orderInPlan: trainingDayOrder 
                } 
            }
        )
    }, [exercise.sets, exercise.orderInStep, validateAndSaveExercise, navigate, setDestination, stepOrder, trainingDayOrder, notify, t]);

    const duplicateSet = useCallback((set) => {
        duplicateObjectInObjectList(
            set, 
            exercise.sets, 
            "sets", 
            10, 
            t("limitAlertSets"), 
            notify, 
            "orderInExercise", 
            setExercise
        )
    }, [exercise.sets, notify, t]);

    const modifySet = useCallback(set => {
        if (!validateAndSaveExercise()) return;

        navigate(
            setDestination, 
            { 
                state: { 
                    set, 
                    orderInStep: exercise.orderInStep,
                    orderInDay: stepOrder, 
                    orderInPlan: trainingDayOrder 
                } 
            }
        )
    }, [validateAndSaveExercise, navigate, setDestination, exercise.orderInStep, stepOrder, trainingDayOrder]);

    const removeSet = useCallback(async order => {
        const userConfirmed = await confirm(t("removeConfirmSet"));
        
        if (userConfirmed) {
            setExercise(prevExercise => ({
                ...prevExercise,
                sets: removeAndReorder(prevExercise.sets, "orderInExercise", order)
            }));

            notify(t("successRemoveSet"), "success");
        }
    }, [confirm, notify, t]);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        if (!validateAndSaveExercise()) return;

        navigate(stepDestination, { state: { orderInPlan: trainingDayOrder, stepOrder } });
    }, [navigate, stepDestination, stepOrder, trainingDayOrder, validateAndSaveExercise]);

    useEffect(() => {
        document.title = t("modifyExercise");
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
                        text={t("modifyExercise")}
                    />

                    <Title
                        text={
                            exercise.ID && trainingDayOrder && stepOrder
                            ? `${t("exercise")} ${exercise.orderInStep} ${t("ofSequence")} ${stepOrder} ${t("ofDay")} ${trainingDayOrder}` 
                            : ""
                        }
                        headingNumber={2}
                        varColor="--light-theme-color"
                    />
                </Stack>
    
                <TrainingExerciseForm
                    exercise={exercise}
                    setExercise={setExercise}
                    setExerciseError={setError}
                    handleSubmit={handleOnSubmit}
                    handleAddSet={addSet}
                    handleDuplicateSet={duplicateSet}
                    handleModifySet={modifySet}
                    handleRemoveSet={removeSet}
                    exercises={exercises}
                    exerciseEquipments={exerciseEquipments}
                    bodyPositions={bodyPositions}
                    pulleyHeights={pulleyHeights}
                    pulleyAttachments={pulleyAttachments}
                    gripTypes={gripTypes}
                    gripWidths={gripWidths}
                    lateralities={lateralities}
                />
            </Stack>
        </main>
    );
}

export default ModifyExercise;