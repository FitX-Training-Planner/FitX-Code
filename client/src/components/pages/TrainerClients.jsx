import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSystemMessage } from "../../app/useSystemMessage";
import { useTranslation } from "react-i18next";
import styles from "./TrainerClients.module.css";
import api from "../../api/axios";
import useRequest from "../../hooks/useRequest";
import NavBarLayout from "../containers/NavBarLayout";
import FooterLayout from "../containers/FooterLayout";
import LoadMoreButton from "../form/buttons/LoadMoreButton";
import Stack from "../containers/Stack";
import Title from "../text/Title";
import FilterItemsLayout from "../containers/FilterItemsLayout";
import ClientCardInHistory from "../cards/user/ClientCardInHistory";
import ActiveClientCard from "../cards/user/ActiveClientCard";
import { useConfirmIdentityCallback } from "../../app/useConfirmIdentityCallback";
import { useNavigate } from "react-router-dom";
import { getCacheData, setCacheData } from "../../utils/cache/operations";
import SearchInput from "../form/fields/SearchInput";
import useWindowSize from "../../hooks/useWindowSize";
import Alert from "../messages/Alert";

function TrainerClients() {
    const { t } = useTranslation();

    const { notify,confirm } = useSystemMessage();

    const hasRun = useRef();

    const { width } = useWindowSize();
    
    const { setHandleOnConfirmed } = useConfirmIdentityCallback();

    const navigate = useNavigate();

    const { request: getUserEmailReq } = useRequest();
    const { request: getActiveClients, loading: activeClientsLoading } = useRequest();
    const { request: getClientsHistory, loading: clientsHistoryLoading } = useRequest();
    const { request: getTrainingPlans } = useRequest();
    const { request: cancelTrainerContract } = useRequest();
    const { request: modifyClientTraining } = useRequest();

    const clientsLimit = 6;
    const emailStorageKey = "fitxEmail";

    const clientsFilters = useMemo(() => {
        return [
            { value: "newest", text: t("newests") },
            { value: "oldest", text: t("oldests") },
            { value: "more_hires", text: t("moreHires") },
            { value: "more_hiring_time", text: t("moreHiringTime") },
            { value: "more_completed_contracts", text: t("moreCompletedContracts") },
            { value: "more_canceled_contracts", text: t("moreCanceledContracts") },
            { value: "most_valuable_historic", text: t("mostValuable") }
        ]
    }, [t]);  

    const [activeClients, setActiveClients] = useState([]);
    const [showedActiveClients, setShowedActiveClients] = useState([]);
    const [activeClientsError, setActiveClientsError] = useState(false);
    const [clientsHistory, setClientsHistory] = useState([]);
    const [clientsHistoryError, setClientsHistoryError] = useState(false);
    const [clientsHistoryOffset, setClientsHistoryOffset] = useState(0);
    const [clientsHistoryFilter, setClientsHistoryFilter] = useState(clientsFilters[0]);
    const [email, setEmail] = useState("");
    const [searchTextHistory, setSearchTextHistory] = useState("");
    const [searchTextActive, setSearchTextActive] = useState("");
    const [trainingPlans, setTrainingPlans] = useState([]);

    const loadClients = useCallback((hasError, updatedClientHistory, offset, filter) => {
        if (hasError) return;

        if ((updatedClientHistory.length < clientsLimit && updatedClientHistory.length !== 0) || updatedClientHistory.length % clientsLimit != 0 || (offset !== 0 && updatedClientHistory.length === 0)) {
            notify(t("clientsEnding"));

            return;
        }

        const getClients = () => {
            return api.get(`/trainers/me/clients`, { 
                params: { 
                    offset: offset, 
                    limit: clientsLimit, 
                    sort: filter,
                    search: searchTextHistory || undefined
                }
            });
        }
        
        const handleOnGlientsSuccess = (data) => {
            const newClients = [...updatedClientHistory, ...data];

            setClientsHistory(newClients);

            setClientsHistoryOffset(offset + clientsLimit);
        };
    
        const handleOnGetClientsError = () => {
            setClientsHistoryError(true);
        };

        const isFirstLoading = offset === 0;
    
        getClientsHistory(
            getClients, 
            handleOnGlientsSuccess, 
            handleOnGetClientsError, 
            !isFirstLoading ? t("loadingClients") : undefined, 
            !isFirstLoading ? t("successClients") : undefined, 
            t("errorClients")
        );
    }, [getClientsHistory, notify, searchTextHistory, t]);
    
    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;
        
        const fetchData = async () => {
            const cachedEmailData = getCacheData(emailStorageKey);

            if (cachedEmailData) {
                setEmail(cachedEmailData);
            } else {
                const getEmail = () => {
                    return api.get(`/users/me/email`);
                }
            
                const handleOnGetEmailSuccess = (data) => {
                    setEmail(data.email);

                    setCacheData(emailStorageKey, data.email);
                };
    
                getUserEmailReq(
                    getEmail, 
                    handleOnGetEmailSuccess, 
                    () => undefined, 
                    undefined, 
                    undefined, 
                    t("errorLoadingUserInfo")
                );
            }

            const getClients = () => {
                return api.get(`/trainers/me/clients/active`);
            }
        
            const handleOnGetClientsSuccess = (data) => {
                setActiveClients(data);
                setShowedActiveClients(data);
            };
            
            const handleOnGetClientsError = () => {
                setActiveClientsError(true);
            };

            getActiveClients(
                getClients, 
                handleOnGetClientsSuccess, 
                handleOnGetClientsError, 
                t("loadingYourActiveClients"), 
                undefined, 
                t("errorYourActiveClients")
            );

            const getPlans = () => {
                return api.get(`/trainers/me/training-plans/base`);
            }
        
            const handleOnGetPlansSuccess = (data) => {
                setTrainingPlans(data);
            };

            getTrainingPlans(
                getPlans, 
                handleOnGetPlansSuccess, 
                () => undefined, 
                undefined, 
                undefined, 
                t("errorTrainingPlans")
            );

            loadClients(clientsHistoryError, clientsHistory, clientsHistoryOffset, clientsHistoryFilter.value);
        }

        fetchData();
    }, [clientsHistory, clientsHistoryError, clientsHistoryFilter.value, clientsHistoryOffset, getActiveClients, getTrainingPlans, getUserEmailReq, loadClients, t]);

    const handleOnChangeClientsFilter = useCallback((filter) => {
        setClientsHistory([]);
        setClientsHistoryOffset(0);
        setClientsHistoryError(false);

        loadClients(false, [], 0, filter);
    }, [loadClients]);

    const handleOnCancelContract = useCallback(async (e, contractID, clientID) => {
        e.preventDefault();

        const userConfirmed = await confirm(t("cancelContractTrainerConfirm"));
        
        if (userConfirmed) {
            navigate("/code-confirmation", { state: { localUser: { email: email }, origin: "cancelContract" } });

            setHandleOnConfirmed(() => () => {
                const formData = new FormData()

                formData.append("contractID", contractID);

                const cancelContract = () => {
                    return api.put(`/trainers/me/clients/${clientID}/active/cancel-contract`, formData);
                }
            
                const handleOnCancelContractSuccess = () => {
                    navigate("/trainers/me/clients");
                };

                cancelTrainerContract(
                    cancelContract, 
                    handleOnCancelContractSuccess, 
                    () => undefined, 
                    t("loadingCancelContract"), 
                    t("successCancelContract"),
                    t("errorCancelContract")
                );
            });
        }
    }, [cancelTrainerContract, confirm, email, navigate, setHandleOnConfirmed, t]);

    const handleOnModifyClientTraining = useCallback(async (e, clientID, trainingPlanID, contractID) => {
        e.preventDefault();

        const formData = new FormData()

        if (trainingPlanID) formData.append("trainingPlanID", trainingPlanID);
        formData.append("contractID", contractID);

        const ModifyClientTrainingPlan = () => {
            return api.put(`/trainers/me/clients/${clientID}/active/training-plan`, formData);
        }

        modifyClientTraining(
            ModifyClientTrainingPlan, 
            () => undefined, 
            () => undefined, 
            t("loadingModifyClientTraining"), 
            t("successModifyClientTraining"),
            t("errorModifyClientTraining")
        );
    }, [modifyClientTraining, t]);
    
    useEffect(() => {
        document.title = t("clients");
    }, [t]);

    return (
        <NavBarLayout
            isClient={false}
        >
            <FooterLayout>
                <main>
                    <Stack
                        gap="4em"
                        className={styles.trainer_clients_page}
                    >
                        <Title
                            headingNumber={1}
                            text={t("clients")}
                        />
                        
                        <Stack
                            gap="6em"
                        >
                            <Stack
                                gap="3em"
                                extraStyles={{ padding: width <= 440 ? "0" : "0 1em" }}
                            >
                                <Title
                                    headingNumber={2}
                                    text={t("activeClients")}
                                    varColor="--theme-color"
                                />

                                <Stack
                                    gap="2em"
                                    className={styles.clients}
                                >
                                    <Stack
                                        direction="row"
                                        gap="0.5em"
                                    >
                                        <Alert/>

                                        {t("activeClientsDeactiveProfileAlert")}
                                    </Stack>

                                    <Stack>
                                        {activeClients.length !== 0 && (
                                            <SearchInput
                                                searchText={searchTextActive}
                                                setSearchText={setSearchTextActive}
                                                items={activeClients}
                                                setShowedItems={setShowedActiveClients}
                                                searchKey="name"
                                                placeholder={t("searchByName")}
                                            />
                                        )}

                                        <Stack
                                            gap="2em"
                                        >
                                            <Stack>                                        
                                                {!activeClientsError && activeClients.length === 0 ? (
                                                    !activeClientsLoading && (
                                                        <p>
                                                            {t("noClients")}
                                                        </p>
                                                    )
                                                ) : (
                                                    <Stack
                                                        gap="2em"
                                                    >
                                                        {showedActiveClients.length !== 0 ? (
                                                            activeClients.map((client, index) => (
                                                                <React.Fragment
                                                                    key={index}
                                                                >
                                                                    <ActiveClientCard
                                                                        name={client.name}
                                                                        photoUrl={client.photoUrl}
                                                                        sex={client.sex}
                                                                        age={client.age}
                                                                        height={client.height}
                                                                        weight={client.weight}
                                                                        limitationsDescription={client.limitationsDescription}
                                                                        availableDays={client.availableDays}
                                                                        trainingPlanID={client.trainingPlan?.ID}
                                                                        trainingPlanName={client.trainingPlan?.name}
                                                                        paymentPlanName={client.paymentPlan?.name}
                                                                        paymentPlanAppFee={client.paymentPlan?.appFee}
                                                                        paymentPlanFullPrice={client.paymentPlan?.fullPrice}
                                                                        contractStartDate={client.contract.startDate}
                                                                        contractEndDate={client.contract.endDate}
                                                                        handleRefund={(e) => handleOnCancelContract(e, client.contract.ID, client.ID)}
                                                                        client={client}
                                                                        setClient={(value) =>
                                                                            setActiveClients(prevClients =>
                                                                                prevClients.map(c => c.ID === client.ID ? { ...c, ...value } : c)
                                                                            )
                                                                        }
                                                                        trainingPlans={trainingPlans}
                                                                        handleOnModifyClientTrainingPlan={(e) => handleOnModifyClientTraining(e, client.ID, client.trainingPlan?.ID, client.contract.ID)}
                                                                    />
                                                                </React.Fragment>
                                                            ))
                                                        ) : (
                                                            <p>
                                                                {t("noResult")}
                                                            </p>
                                                        )}
                                                    </Stack>
                                                )}
                                            </Stack>

                                            {activeClientsError && (
                                                <p>
                                                    <>
                                                        {t("errorOcurredActiveClients")}

                                                        <br/>
                                                        
                                                        {t("reloadOrTryLater")}
                                                    </>
                                                </p>
                                            )}
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>

                            <Stack
                                extraStyles={{ padding: width <= 440 ? "0" : "0 1em" }}
                                gap="3em"
                            >
                                <Title
                                    headingNumber={2}
                                    text={t("clientsHistory")}
                                    varColor="--theme-color"
                                />

                                <Stack
                                    className={styles.clients}
                                    gap="2em"
                                >
                                    <Stack
                                        direction="row"
                                        gap="0.5em"
                                    >
                                        <Alert/>

                                        <p>
                                            {t("clientsHistoryDeactiveProfileAlert")}
                                        </p>
                                    </Stack>

                                    <Stack>
                                        <SearchInput
                                            searchText={searchTextHistory}
                                            setSearchText={setSearchTextHistory}
                                            placeholder={t("searchClient")}
                                            handleSubmit={() => handleOnChangeClientsFilter(clientsHistoryFilter.value)}
                                        />
                                        
                                        <FilterItemsLayout
                                            filters={clientsFilters}
                                            activeFilter={clientsHistoryFilter}
                                            setActiveFilter={setClientsHistoryFilter}
                                            handleChange={handleOnChangeClientsFilter}
                                        >                                        
                                            {!clientsHistoryError && clientsHistory.length === 0 ? (
                                                !clientsHistoryLoading && (
                                                    searchTextHistory ? (
                                                        <p>
                                                            {t("noResult")}
                                                        </p>
                                                    ) : (
                                                        <p>
                                                            {t("noClients")}
                                                        </p>
                                                    )
                                                )
                                            ) : (
                                                <Stack
                                                    gap="2em"
                                                >
                                                    {clientsHistory.length !== 0 ? (
                                                        clientsHistory.map((client, index) => (
                                                            <React.Fragment
                                                                key={index}
                                                            >
                                                                <ClientCardInHistory
                                                                    name={client.name}
                                                                    photoUrl={client.photoUrl}
                                                                    sex={client.sex}
                                                                    firstContractDate={client.firstContractDate}
                                                                    lastContractDate={client.lastContractDate}
                                                                    contractsNumber={client.contractsNumber}
                                                                    daysInContract={client.daysInContract}
                                                                    completedContracts={client.completedContracts}
                                                                    canceledContracts={client.canceledContracts}
                                                                    amountPaid={client.amountPaid}
                                                                />
                                                            </React.Fragment>
                                                        ))
                                                    ) : (
                                                        <p>
                                                            {t("noResult")}
                                                        </p>
                                                    )}
                                                </Stack>
                                            )}
                                        </FilterItemsLayout>
                                    </Stack>

                                    {clientsHistoryError ? (
                                        <p>
                                            <>
                                                {t("errorOcurredClients")}

                                                <br/>
                                                
                                                {t("reloadOrTryLater")}
                                            </>
                                        </p>
                                    ) : (
                                        <LoadMoreButton
                                            handleLoad={() => loadClients(clientsHistoryError, clientsHistory, clientsHistoryOffset, clientsHistoryFilter.value)}
                                            loading={clientsHistoryLoading}
                                        />
                                    )}
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </main>
            </FooterLayout>
        </NavBarLayout>
    )
}

export default TrainerClients;