import { useSelector } from "react-redux";
import useRequest from "../../hooks/useRequest";
import { useSystemMessage } from "../../app/useSystemMessage";
import useWindowSize from "../../hooks/useWindowSize";
import { cleanCacheData, getCacheData, setCacheData } from "../../utils/cache/operations";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { verifyIsClient } from "../../utils/requests/verifyUserType";
import api from "../../api/axios";
import NavBarLayout from "../containers/NavBarLayout";
import Stack from "../containers/Stack";
import Title from "../text/Title";
import ClickableIcon from "../form/buttons/ClickableIcon";
import FilterItemsLayout from "../containers/FilterItemsLayout";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import LoadMoreButton from "../form/buttons/LoadMoreButton";
import ClientTrainingContractCard from "../cards/user/ClientTrainingContractCard";
import SmallTrainerProfessionalCard from "../cards/user/SmallTrainerProfessionalCard";
import { useTranslation } from "react-i18next";

function ClientHome() {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const { width } = useWindowSize();
    
    const hasRun = useRef(false);
    
    const { notify, confirm } = useSystemMessage();
    
    const { request: isClient } = useRequest();
    const { request: getTrainers, loading: trainersLoading } = useRequest();
    const { request: getClientTraining, loading: trainingLoading } = useRequest();
    const { request: cancelClientContract } = useRequest();
            
    const user = useSelector(state => state.user);

    const clientTrainingStorageKey = "clientTraining";
    const trainersLimit = 20;

    const trainersFilters = useMemo(() => {
        return [
            { value: "most_popular", text: t("mostPopulars") },
            { value: "best_rated", text: t("bestRateds") },
            { value: "most_affordable", text: t("mostAffordables") },
            { value: "best_value", text: t("bestValues") }
        ]
    }, [t]);  
    const clientTrainingDefault = useMemo(() => {
        return {
            loaded: false,
            trainer: {
                ID: 1,
                name: "Paulo Henrique",
                photoUrl: "/images/icons/chatbot2.png",
                crefNumber: "123456-P"
            },
            trainingPlan: {
                ID: 1,
                name: "Plano 1",
            },
            contract: {
                ID: 1,
                startDate: new Date("2025-05-04"),
                endDate: new Date("2026-05-04")
            }
        }
    }, []);

    const [clientTraining, setClientTraining] = useState(null);
    const [clientTrainingError, setClientTrainingError] = useState(false);
    const [trainers, setTrainers] = useState([]);
    const [trainersError, setTrainersError] = useState(false);
    const [trainersOffset, setTrainersOffset] = useState(0);
    const [activeTrainerFilter, setActiveTrainerFilter] = useState(trainersFilters[0]);

    const loadTrainers = useCallback((hasError, updatedTrainers, offset, filter) => {
        if (hasError) return;

        if ((updatedTrainers.length < trainersLimit && updatedTrainers.length !== 0) || updatedTrainers.length % trainersLimit !== 0 || (offset !== 0 && updatedTrainers.length === 0)) {
            notify(t("noTrainers"));

            return;
        }

        const getSearchedTrainers = () => {
            return api.get(`/trainers`, { 
                params: { 
                    offset: offset, 
                    limit: trainersLimit, 
                    sort: filter
                }
            });
        }
        
        const handleOnGetTrainersSuccess = (data) => {            
            setTrainers(prevTrainers => [...prevTrainers, ...data]);

            setTrainersOffset(offset + trainersLimit);
        };
    
        const handleOnGetTrainersError = () => {
            setTrainersError(true);
        };
    
        const isFirstLoading = offset === 0;

        getTrainers(
            getSearchedTrainers, 
            handleOnGetTrainersSuccess, 
            handleOnGetTrainersError, 
            !isFirstLoading ? t("loadingTrainers") : undefined, 
            !isFirstLoading ? t("successTrainers") : undefined, 
            t("errorTrainers")
        );
    }, [getTrainers, notify, t]);
    
    const handleOnChangeFilter = useCallback((filter) => {
        setTrainers([]);
        setTrainersOffset(0);
        setTrainersError(false);

        loadTrainers(false, [], 0, filter);
    }, [loadTrainers]);

    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;
        
        const fetchData = async () => {
            const success = await verifyIsClient(isClient, user, navigate, notify, t);

            if (!success) return;

            loadTrainers(trainersError, trainers, trainersOffset, activeTrainerFilter.value);

            const cachedData = getCacheData(clientTrainingStorageKey);
            
            if (cachedData) {
                setClientTraining(cachedData);
                
                return;
            }
            
            const getTraining = () => {
                return api.get(`/me/training-contract`);
            }
            
            const handleOnGetClientTrainingSuccess = (data) => {
                setClientTraining(data);

                setCacheData(clientTrainingStorageKey, data);
            };
        
            const handleOnGetClientTrainingError = () => {
                setClientTrainingError(true);
            };

            getClientTraining(
                getTraining, 
                handleOnGetClientTrainingSuccess, 
                handleOnGetClientTrainingError, 
                undefined, 
                undefined, 
                t("errorTrainingContract")
            );
        }

        fetchData();
    }, [navigate, notify, user, trainersError, trainers, trainersOffset, isClient, loadTrainers, activeTrainerFilter.value, getClientTraining, t, clientTrainingDefault]);

    const cancelContract = useCallback(async (e) => {
        e.preventDefault();

        const userConfirmed = await confirm(t("cancelContractConfirm"));
        
        if (userConfirmed) {
            const cancelContract = () => {
                return api.put(`/me/active-contract`);
            }
        
            const handleOnCancelContractSuccess = () => {
                setClientTraining(clientTrainingDefault);

                cleanCacheData(clientTrainingStorageKey)
            };

            cancelClientContract(
                cancelContract, 
                handleOnCancelContractSuccess, 
                () => undefined, 
                t("loadingCancelContract"), 
                t("successCancelContract"),
                t("errorCancelContract")
            );
        }
    }, [cancelClientContract, clientTrainingDefault, confirm, t]);

    useEffect(() => {
        document.title = t("home");
    }, [t]);

    return (
        <NavBarLayout>
            <main
                className={styles.client_home}
                style={{ padding: width <= 440 ? "2em 1em" : "1em" }}
            >
                <Stack
                    gap="3em"
                >
                    <Stack
                        direction={width <= 440 ? "column" : "row"}
                        justifyContent="center"
                        gap={width <= 440 ? "0" : "1em"}
                    >
                        <ClickableIcon
                            iconSrc="/logo180.png"
                            size="large"
                            hasTheme={false}
                        />

                        <Title
                            headingNumber={1}
                            text={t("training")}
                        />
                    </Stack>

                    <Stack
                        gap="3em"
                    >
                        <Stack>
                            <Title
                                headingNumber={2}
                                text={t("yourTraining")}
                            />

                            {trainingLoading || !clientTraining || clientTrainingError ? (
                                clientTrainingError ? (
                                    <p>
                                        {t("errorOcurredTrainingContract")}

                                        <br/>
                                        
                                        {t("reloadOrTryLater")}
                                    </p>
                                ) : (
                                    <p>
                                        {t("noContractActive")}

                                        <br/>

                                        {t("searchTrainersInstruction")}
                                    </p>
                                )
                            ) : (
                                <ClientTrainingContractCard
                                    trainerName={clientTraining.trainer?.name} 
                                    trainerPhotoUrl={clientTraining.trainer?.photoUrl} 
                                    trainerCrefNumber={clientTraining.trainer?.crefNumber} 
                                    trainingPlanID={clientTraining.trainingPlan?.ID}
                                    trainingPlanName={clientTraining.trainingPlan?.name} 
                                    contractStartDate={clientTraining.contract?.startDate} 
                                    contractEndDate={clientTraining.contract?.endDate} 
                                    handleCancelContract={cancelContract}
                                />
                            )}
                        </Stack>

                        <Stack>
                            <Title
                                headingNumber={2}
                                text={t("otherTrainers")}
                            />

                            <Stack
                                className={styles.contracts}
                                gap="2em"
                            >
                                <FilterItemsLayout
                                    filters={trainersFilters}
                                    activeFilter={activeTrainerFilter}
                                    setActiveFilter={setActiveTrainerFilter}
                                    handleChange={handleOnChangeFilter}
                                >
                                    <Stack
                                        gap="2em"
                                    >
                                        {trainers.length !== 0 ? (
                                            trainers.map((trainer, index) => (
                                                <React.Fragment
                                                    key={index}
                                                >
                                                    <SmallTrainerProfessionalCard
                                                        name={trainer.name} 
                                                        photoUrl={trainer.photoUrl} 
                                                        crefNumber={trainer.crefNumber} 
                                                        rate={trainer.rate} 
                                                        contractsNumber={trainer.contractsNumber} 
                                                        complaintsNumber={trainer.complaintsNumber} 
                                                        paymentPlans={trainer.paymentPlans} 
                                                        handleExpand={() => navigate(`/trainers/${trainer.ID}`)}
                                                    />
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <p>
                                                {t("noTrainersFinded")}
                                            </p>
                                        )}
                                    </Stack>
                                </FilterItemsLayout>

                                {trainersError ? (
                                    <p>
                                        <>
                                            {t("errorOcurredTrainers")}

                                            <br/>
                                            
                                            {t("reloadOrTryLater")}
                                        </>
                                    </p>
                                ) : (
                                    <LoadMoreButton
                                        handleLoad={() => loadTrainers(trainersError, trainers, trainersOffset, activeTrainerFilter.value)}
                                        loading={trainersLoading}
                                    />
                                )}
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </main>
        </NavBarLayout>
    );
}

export default ClientHome;