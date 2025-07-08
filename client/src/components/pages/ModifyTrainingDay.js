import styles from "./CreateTrainingPlan.module.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Title from "../text/Title";
import { useLocation, useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/SystemMessageProvider";
import { useTrainingPlan } from "../../app/TrainingPlanProvider";
import { getNextOrder, removeAndReorder } from "../../utils/generators/generateOrder";
import { validateTrainingDay } from "../../utils/validators/formValidator";
import Stack from "../containers/Stack";
import TrainingDayForm from "../form/forms/TrainingDayForm";
import duplicateObjectInObjectList from "../../utils/generators/duplicate";
import BackButton from "../form/buttons/BackButton";

function ModifyTrainingDay() {
    const location = useLocation();
        
    const navigate = useNavigate();
    
    const hasRun = useRef(false);
    
    const { notify } = useSystemMessage();
    const { confirm } = useSystemMessage();

    const { trainingPlan, setTrainingPlan } = useTrainingPlan();
    
    const cardioSessionDestination = useMemo(() => (
        `/trainers/me/create-training-plan/modify-training-day/modify-cardio-session`
    ), []);
    const trainingStepDestination = useMemo(() => (
        `/trainers/me/create-training-plan/modify-training-day/modify-training-step`
    ), []);
    const defaultTrainingDay = useMemo(() => ({
        ID: null,
        orderInPlan: 1,
        name: "",
        isRestDay: false,
        note: "",
        trainingSteps: [],
        cardioSessions: []
    }), []);
    
    const [trainingDay, setTrainingDay] = useState(defaultTrainingDay);
    const [error, setError] = useState(false);
    
    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;
    
        const locationTrainingDayOrder = location.state?.trainingDayOrder;
        const locationTrainingDay = location.state?.trainingDay;

        if (!(locationTrainingDay || locationTrainingDayOrder)) {
            navigate("/");
            
            notify("As informações do plano de treino não foram encontradas.", "error");

            return;
        }

        if (trainingPlan.trainingDays.some(trainingDayEl => trainingDayEl.orderInPlan === locationTrainingDayOrder)) {
            setTrainingDay(trainingPlan.trainingDays.find(trainingDayEl => trainingDayEl.orderInPlan === locationTrainingDayOrder));

            return;
        }

        setTrainingDay(prevTrainingDay => 
            locationTrainingDay || 
            { ...prevTrainingDay, orderInPlan: locationTrainingDayOrder, ID: locationTrainingDayOrder }
        );
    }, [location.state, navigate, notify, trainingPlan.trainingDays]);

    const handleOnChangeTrainingDayType = useCallback(async () => {
        if (!trainingDay.isRestDay) {
            const userConfirmed = await confirm("Deseja transformar esse dia em descanso?");

            if (userConfirmed) {
                setTrainingDay(prevTrainingDay => ({ 
                    ...prevTrainingDay, 
                    name: "Descanso",
                    isRestDay: true,
                    trainingSteps: []
                }));

                setError(false);  

                return;
            } else {
                return;
            }
        }

        setTrainingDay(prevTrainingDay => ({ 
            ...prevTrainingDay, 
            isRestDay: false,
            name: "",
            trainingSteps: []
        }));

        setError(false);
    }, [confirm, trainingDay.isRestDay]);

    const validateAndSaveTrainingDay = useCallback(() => {
        if (!validateTrainingDay(
            error,
            setError,
            trainingDay.name,
            trainingDay.note
        )) {
            notify("Ainda há erros no formulário de dia de treino!", "error");

            return false;
        }

        setTrainingPlan(prevTrainingPlan => ({ 
            ...prevTrainingPlan, 
            trainingDays: (
                prevTrainingPlan.trainingDays.some(trainingDayEl => trainingDayEl.orderInPlan === trainingDay.orderInPlan) ?
                prevTrainingPlan.trainingDays.map(trainingDayEl => (
                    trainingDayEl.orderInPlan === trainingDay.orderInPlan ?
                    trainingDay :
                    trainingDayEl
                )) :
                [...prevTrainingPlan.trainingDays, trainingDay]
            )
        }));

        return true;
    }, [error, notify, setTrainingPlan, trainingDay]);


    const addCardioSession = useCallback(() => {
        if (trainingDay.cardioSessions.length >= 4) {
            notify("Você atingiu o limite de 4 sessões de cardio para este dia de treino.", "error");

            return;
        }

        if (!validateAndSaveTrainingDay()) return;

        navigate(
            cardioSessionDestination, 
            { state: { cardioSessionID: getNextOrder(trainingDay.cardioSessions, "usedID"), orderInPlan: trainingDay.orderInPlan } }
        )
    }, [cardioSessionDestination, navigate, notify, trainingDay.cardioSessions, trainingDay.orderInPlan, validateAndSaveTrainingDay]);

    const addTrainingStep = useCallback(() => {   
        if (trainingDay.trainingSteps.length >= 12) {
            notify("Você atingiu o limite de 12 exercícios para este dia de treino.", "error");

            return;
        }

        if (!validateAndSaveTrainingDay()) return;
     
        navigate(
            trainingStepDestination, 
            { state: { stepOrder: getNextOrder(trainingDay.trainingSteps, "orderInDay"), orderInPlan: trainingDay.orderInPlan } }
        )
    }, [navigate, notify, trainingDay.orderInPlan, trainingDay.trainingSteps, trainingStepDestination, validateAndSaveTrainingDay]);

    const duplicateTrainingStep = useCallback((step) => {
        duplicateObjectInObjectList(
            step, 
            trainingDay.trainingSteps, 
            "trainingSteps", 
            12, 
            "Você atingiu o limite de 12 exercícios para este dia de treino.", 
            notify, 
            "orderInDay", 
            setTrainingDay
        )
    }, [notify, trainingDay.trainingSteps]);

    const duplicateCardioSession = useCallback((session) => {
        duplicateObjectInObjectList(
            session, 
            trainingDay.cardioSessions, 
            "cardioSessions", 
            4, 
            "Você atingiu o limite de 4 sessões de cardio para este dia de treino.", 
            notify, 
            "usedID", 
            setTrainingDay
        )
    }, [notify, trainingDay.cardioSessions]);

    const modifyCardioSession = useCallback(cardioSession => {
        if (!validateAndSaveTrainingDay()) return;

        navigate(cardioSessionDestination, { state: { cardioSession, orderInPlan: trainingDay.orderInPlan } })
    }, [cardioSessionDestination, navigate, trainingDay.orderInPlan, validateAndSaveTrainingDay]);

    const modifyTrainingStep = useCallback(trainingStep => {
        if (!validateAndSaveTrainingDay()) return;

        navigate(trainingStepDestination, { state: { trainingStep, orderInPlan: trainingDay.orderInPlan } })
    }, [navigate, trainingDay.orderInPlan, trainingStepDestination, validateAndSaveTrainingDay]);

    const removeCardioSession = useCallback(async ID => {
        const userConfirmed = await confirm("Deseja remover essa sessão de cardio do seu treino?");
        
        if (userConfirmed) {
            setTrainingDay(prevTrainingDay => ({
                ...prevTrainingDay,
                cardioSessions: removeAndReorder(prevTrainingDay.cardioSessions, "usedID", ID)
            }));

            notify("Sessão de cardio removida!", "success");
        }
    }, [confirm, notify]);

    const removeTrainingStep = useCallback(async order => {
        const userConfirmed = await confirm("Deseja remover esse exercício do seu treino?");
        
        if (userConfirmed) {
            setTrainingDay(prevTrainingDay => ({
                ...prevTrainingDay,
                trainingSteps: removeAndReorder(prevTrainingDay.trainingSteps, "orderInDay", order)
            }));

            notify("Exercício do treino removido!", "success");
        }
    }, [confirm, notify]);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        if (!validateAndSaveTrainingDay()) return;

        const destination = `/trainers/me/create-training-plan`;

        navigate(destination);
    }, [navigate, validateAndSaveTrainingDay]);

    useEffect(() => {
        document.title = "Modificar Dia de Treino";
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
                        text="Modificar Dia de Treino"
                    />

                    <Title
                        text={trainingDay.ID ?  `Dia ${trainingDay.orderInPlan}` : ""}
                        headingNumber={2}
                        varColor="--light-theme-color"
                    />
                </Stack>

                <TrainingDayForm
                    trainingDay={trainingDay}
                    setTrainingDay={setTrainingDay}
                    setTrainingDayError={setError}
                    handleSubmit={handleOnSubmit}
                    handleChangeDayType={handleOnChangeTrainingDayType}
                    handleAddTrainingStep={addTrainingStep}
                    handleDuplicateStep={duplicateTrainingStep}
                    handleModifyTrainingStep={modifyTrainingStep}
                    handleRemoveTrainingStep={removeTrainingStep}
                    handleAddCardioSession={addCardioSession}
                    handleDuplicateCardioSession={duplicateCardioSession}
                    handleModifyCardioSession={modifyCardioSession}
                    handleRemoveCardioSession={removeCardioSession}
                />
            </Stack>
        </main>
    );
}

export default ModifyTrainingDay;