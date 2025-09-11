import { useSelector } from "react-redux";
import useRequest from "../../hooks/useRequest";
import useWindowSize from "../../hooks/useWindowSize";
import React, { useEffect, useRef, useState } from "react";
import { verifyIsClient } from "../../utils/requests/verifyUserType";
import { useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/useSystemMessage";
import api from "../../api/axios";
import Stack from "../containers/Stack";
import { useTranslation } from "react-i18next";
import NavBarLayout from "../containers/NavBarLayout";
import Loader from "../layout/Loader";
import Title from "../text/Title";
import styles from "./ClientTrainingPlan.module.css"
import ClientTrainingDayCard from "../cards/training/ClientTrainingDayCard";
import FilterItemsById from "../form/buttons/FilterItemsById";

function ClientTrainingPlan() {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const { width } = useWindowSize();
    
    const hasRun = useRef(false);
    
    const { notify } = useSystemMessage();
    
    const { request: isClient } = useRequest();
    const { request: getTrainingPlan, loading: getTrainingPlanLoading } = useRequest();
            
    const user = useSelector(state => state.user);
    
    const [trainingPlan, setTrainingPlan] = useState({});
    const [showedDays, setShowedDays] = useState([]);
    
    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;
        
        const fetchData = async () => {
            const success = await verifyIsClient(isClient, user, navigate, notify, t);

            if (!success) return;
            
            const getPlan = () => {
                return api.get(`/me/training-plan`);
            }
        
            const handleOnGetPlanSuccess = (data) => {
                if (data?.ID) setTrainingPlan(data);

                setShowedDays(data?.trainingDays);
            };
        
            const handleOnGetPlanError = () => {
                navigate("/");
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
    }, [getTrainingPlan, isClient, navigate, notify, t, user]);

    useEffect(() => {
        document.title = t("trainingPlan");
    }, [t]);

    return (
        <NavBarLayout>
            <main
                style={{ padding: width <= 440 ? "2em 1em" : "2em"}}
            >
                <Stack
                    gap="4em"
                >
                    <Title
                        headingNumber={1}
                        text={t("trainingPlan")}
                    />

                    <Stack
                        gap="2em"
                    >
                        {!trainingPlan.ID ? (
                            getTrainingPlanLoading ? (
                                <Loader />
                            ) : (
                                <Stack
                                    gap="5em"
                                    className={styles.no_training_container}
                                >
                                    <Stack
                                        gap="4em"
                                    >
                                        <Stack>
                                            <p>
                                                {t("noTrainingSended")} 
                                                
                                            </p>
                                                
                                            <span>
                                                {t("or")}
                                            </span>
                                                
                                            <p>
                                                {t("noContractActive")}
                                            </p>
                                        </Stack>

                                        <img
                                            src="/images/icons/sad.png"
                                            alt=""
                                            style={{ maxWidth: "100%" }}
                                        />  
                                    </Stack>

                                    <p>
                                        {t("noTrainingSendedInstruction")}
                                    </p>
                                </Stack>
                            )
                        ) : (
                            <>
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
                            </>
                        )}
                    </Stack>     
                </Stack>
            </main>
        </NavBarLayout>
    );
}

export default ClientTrainingPlan;