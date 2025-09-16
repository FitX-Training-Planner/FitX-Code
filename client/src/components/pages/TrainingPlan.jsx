import { useSelector } from "react-redux";
import useRequest from "../../hooks/useRequest";
import useWindowSize from "../../hooks/useWindowSize";
import React, { useEffect, useRef, useState } from "react";
import { verifyIsTrainer } from "../../utils/requests/verifyUserType";
import { useNavigate, useParams } from "react-router-dom";
import { useSystemMessage } from "../../app/useSystemMessage";
import api from "../../api/axios";
import BackButton from "../layout/BackButton";
import Stack from "../containers/Stack";
import FilterItemsById from "../form/buttons/FilterItemsById";
import { useTranslation } from "react-i18next";
import ClientTrainingDayCard from "../cards/training/ClientTrainingDayCard";
import NavBarLayout from "../containers/NavBarLayout";
import Title from "../text/Title";

function TrainingPlan() {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const { width } = useWindowSize();
    
    const hasRun = useRef(false);

    const { id } = useParams();
    
    const { notify } = useSystemMessage();
    
    const { request: isTrainer } = useRequest();
    const { request: getTrainingPlan } = useRequest();
            
    const user = useSelector(state => state.user);
    
    const [trainingPlan, setTrainingPlan] = useState({
        name: "",
        note: "",
        trainingDays: []
    });
    const [showedDays, setShowedDays] = useState([]);
    
    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;
        
        const fetchData = async () => {
            const success = await verifyIsTrainer(isTrainer, user, navigate, notify, t);

            if (!success) return;
            
            const getPlan = () => {
                return api.get(`/trainers/me/training-plans/${id}`);
            }
        
            const handleOnGetPlanSuccess = (data) => {
                setTrainingPlan(data);

                setShowedDays(data.trainingDays);
            };
        
            const handleOnGetPlanError = () => {
                navigate("/trainers/me/training-plans");
            };

            getTrainingPlan(
                getPlan, 
                handleOnGetPlanSuccess, 
                handleOnGetPlanError, 
                t("loadingTrainingPlan"), 
                undefined, 
                t("errorTrainingPlan")
            );
        }

        fetchData();
    }, [navigate, notify, isTrainer, user, getTrainingPlan, id, t]);

    useEffect(() => {
        document.title = t("trainingPlan");
    }, [t]);

    return (
        <main
            style={{ padding: width <= 440 ? "2em 1em" : "2em"}}
        >
            <BackButton
                destiny="/trainers/me/training-plans"
            />

            <Stack
                gap="5em"
            >
                <Stack>
                    <Title
                        headingNumber={1}
                        text={t("trainingPlan")}
                    />

                    <p>
                        {t("clientViewDescription")}
                    </p>
                </Stack>

                <Stack
                    gap="2em"
                >
                    {trainingPlan.trainingDays.length > 1 && (
                        <FilterItemsById
                            items={trainingPlan.trainingDays}
                            orderKey="orderInPlan"
                            setShowedItems={setShowedDays}
                        />
                    )}

                    <Stack
                        gap="2em"
                    >
                        {showedDays.map((day, index) => (
                            <React.Fragment
                                key={index}
                            >
                                <ClientTrainingDayCard
                                    dayID={day.ID}
                                    name={day.name}
                                    isRestDay={day.isRestDay}
                                    orderInPlan={day.orderInPlan}
                                    note={day.note}
                                    trainingSteps={day.trainingSteps}
                                    cardioSessions={day.cardioSessions}
                                />
                            </React.Fragment>
                        ))}
                    </Stack>
                </Stack>     
            </Stack>
        </main>
    );
}

export default TrainingPlan;