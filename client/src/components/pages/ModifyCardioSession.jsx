import styles from "./CreateTrainingPlan.module.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Title from "../text/Title";
import { useSystemMessage } from "../../app/useSystemMessage";
import { useTrainingPlan } from "../../app/useTrainingPlan";
import { validateCardioSession } from "../../utils/validators/formValidator";
import useGets from "../../hooks/useGetRequest";
import getAndSetInitialData from "../../utils/requests/initialData";
import Stack from "../containers/Stack";
import CardioSessionForm from "../form/forms/CardioSessionForm";
import BackButton from "../form/buttons/BackButton";
import { useTranslation } from "react-i18next";

function ModifyCardioSession() {
    const { t } = useTranslation();

    const location = useLocation();
    
    const navigate = useNavigate();
    
    const hasRun = useRef(false);
    
    const { notify } = useSystemMessage();
    
    const { setTrainingPlan } = useTrainingPlan();

    const { getCardioIntensities } = useGets();
    const { getCardioOptions } = useGets();
    
    const destination = useMemo(() => (
        `/trainers/me/create-training-plan/modify-training-day`
    ), []);

    const [cardioSession, setCardioSession] = useState({
        ID: null,
        usedID: 1,
        sessionTime: "",
        durationMinutes: "",
        note: "",
        cardioOption: null,
        cardioIntensity: null
    });
    const [trainingDayOrder, setTrainingDayOrder] = useState(null);
    const [error, setError] = useState(false);
    const [cardioOptions, setCardioOptions] = useState([]);
    const [cardioIntensities, setCardioIntensities] = useState([]);
    
    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;
    
        const locationCardioSessionID = location.state?.cardioSessionID;
        const locationCardioSession = location.state?.cardioSession;
        const locationTrainingDayOrder = location.state?.orderInPlan;

        if (!(locationCardioSession || locationCardioSessionID) || !locationTrainingDayOrder) {
            navigate("/");
            
            notify(t("notFoundTrainingPlanInfo"), "error");

            return;
        }

        const fetchData = async () => {
            const intensitiesSuccess = await getAndSetInitialData(
                getCardioIntensities,
                setCardioIntensities,
                { trainingDayOrder: locationTrainingDayOrder },
                navigate,
                destination,
                "cardioIntensities"
            );
    
            if (!intensitiesSuccess) return;
    
            const optionsSuccess = await getAndSetInitialData(
                getCardioOptions, 
                setCardioOptions, 
                { trainingDayOrder: locationTrainingDayOrder },
                navigate,
                destination,
                "cardioOptions"
            );

            if (!optionsSuccess) return;

            setCardioSession(prevCardioSession => 
                locationCardioSession || 
                { ...prevCardioSession, ID: locationCardioSessionID, usedID: locationCardioSessionID }
            );
            
            setTrainingDayOrder(locationTrainingDayOrder);
        }

        fetchData();
    }, [destination, getCardioIntensities, getCardioOptions, location.state, navigate, notify, t]);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        if (!validateCardioSession(
            error, 
            setError, 
            cardioSession.note, 
            cardioSession.durationMinutes, 
            cardioSession.cardioIntensity?.ID || null, 
            cardioSession.cardioOption?.ID || null
        )) {
            notify(t("alertErrorCardioSession"), "error");

            return;
        }

        setTrainingPlan(prevTrainingPlan => ({ 
            ...prevTrainingPlan, 
            trainingDays: prevTrainingPlan.trainingDays.map(trainingDayEl => (
                trainingDayEl.orderInPlan === trainingDayOrder ?
                { 
                    ...trainingDayEl, 
                    cardioSessions: (
                        trainingDayEl.cardioSessions.some(cardioSessionEl => cardioSessionEl.usedID === cardioSession.usedID) ?
                        trainingDayEl.cardioSessions.map(cardioSessionEl => (
                            cardioSessionEl.usedID === cardioSession.usedID ?
                            cardioSession :
                            cardioSessionEl
                        )) :
                        [...trainingDayEl.cardioSessions, cardioSession]
                    )
                } :
                trainingDayEl
            ))
        }));

        navigate(destination, { state: { trainingDayOrder } });
    }, [cardioSession, destination, error, navigate, notify, setTrainingPlan, trainingDayOrder, t]);

    useEffect(() => {
        document.title = t("modifyCardioSession");
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
                        text={t("modifyCardioSession")}
                    />

                    <Title
                        text={cardioSession.ID && trainingDayOrder ? `${t("session")} ${cardioSession.usedID} ${t("ofDay")} ${trainingDayOrder}` : ""}
                        headingNumber={2}
                        varColor="--light-theme-color"
                    />
                </Stack>

                <CardioSessionForm
                    cardioSession={cardioSession}
                    setCardioSession={setCardioSession}
                    setCardioSessionError={setError}
                    handleSubmit={handleOnSubmit}
                    cardioOptions={cardioOptions}
                    cardioIntensities={cardioIntensities}
                />
            </Stack>
        </main>
    );
}

export default ModifyCardioSession;