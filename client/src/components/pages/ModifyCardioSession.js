import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Title from "../text/Title";
import { useSystemMessage } from "../../app/SystemMessageProvider";
import { useTrainingPlan } from "../../app/TrainingPlanProvider";
import { validateCardioSession } from "../../utils/validators/formValidator";
import useGets from "../../hooks/useGetRequest";
import getAndSetInitialData from "../../utils/requests/initialData";
import Stack from "../containers/Stack";
import CardioSessionForm from "../form/forms/CardioSessionForm";

function ModifyCardioSession() {
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
        sessionTime: "",
        durationMinutes: "",
        note: "",
        cardioOptionID: null,
        cardioIntensityID: null
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
            
            notify("As informações do plano de treino não foram encontradas.", "error");

            return;
        }

        const fetchData = async () => {
            const intensitiesSuccess = await getAndSetInitialData(
                getCardioIntensities,
                setCardioIntensities,
                { trainingDayOrder: locationTrainingDayOrder },
                navigate,
                destination
            );
    
            if (!intensitiesSuccess) return;
    
            const optionsSuccess = await getAndSetInitialData(
                getCardioOptions, 
                setCardioOptions, 
                { trainingDayOrder: locationTrainingDayOrder },
                navigate,
                destination
            );

            if (!optionsSuccess) return;

            setCardioSession(prevCardioSession => 
                locationCardioSession || 
                { ...prevCardioSession, ID: locationCardioSessionID }
            );
            
            setTrainingDayOrder(locationTrainingDayOrder);
        }

        fetchData();
    }, [destination, getCardioIntensities, getCardioOptions, location.state, navigate, notify]);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        if (!validateCardioSession(
            error, 
            setError, 
            cardioSession.note, 
            cardioSession.durationMinutes, 
            cardioSession.cardioIntensityID, 
            cardioSession.cardioOptionID
        )) return;

        setTrainingPlan(prevTrainingPlan => ({ 
            ...prevTrainingPlan, 
            trainingDays: prevTrainingPlan.trainingDays.map(trainingDayEl => (
                trainingDayEl.orderInPlan === trainingDayOrder ?
                { 
                    ...trainingDayEl, 
                    cardioSessions: (
                        trainingDayEl.cardioSessions.some(cardioSessionEl => cardioSessionEl.ID === cardioSession.ID) ?
                        trainingDayEl.cardioSessions.map(cardioSessionEl => (
                            cardioSessionEl.ID === cardioSession.ID ?
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
    }, [cardioSession, destination, error, navigate, setTrainingPlan, trainingDayOrder]);

    useEffect(() => {
        document.title = "Modificar Cardio";
    }, []);
    
    return (
        <main>
            <Stack>
                <Title
                    headingNumber={1}
                    text={`
                        Modificar Cardio 
                        ${cardioSession.ID && trainingDayOrder ? `${cardioSession.ID} do Dia ${trainingDayOrder}` : ""}
                    `}
                />

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