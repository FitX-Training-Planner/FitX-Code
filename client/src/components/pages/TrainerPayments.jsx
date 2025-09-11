import { useSelector } from "react-redux";
import useRequest from "../../hooks/useRequest";
import { useSystemMessage } from "../../app/useSystemMessage";
import useWindowSize from "../../hooks/useWindowSize";
import { getCacheData, removeItemFromCacheList, setCacheData } from "../../utils/cache/operations";
import React, { useCallback, useMemo, useEffect, useRef, useState } from "react";
import { verifyIsTrainer } from "../../utils/requests/verifyUserType";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import NavBarLayout from "../containers/NavBarLayout";
import Stack from "../containers/Stack";
import Title from "../text/Title";
import ContractCard from "../cards/contracts/ContractCard";
import styles from "./TrainerPayments.module.css";
import LoadMoreButton from "../form/buttons/LoadMoreButton";
import FilterItemsLayout from "../containers/FilterItemsLayout";
import { useTranslation } from "react-i18next";
import PaymentPlansContainer from "../layout/PaymentPlansContainer";
import DateInput from "../form/fields/DateInput";
import FooterLayout from "../containers/FooterLayout";
import { translateDatabaseData } from "../../utils/formatters/text/translate";

function TrainerPayments() {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const { width } = useWindowSize();
    
    const hasRun = useRef(false);
    
    const { notify, confirm } = useSystemMessage();
    
    const { request: isTrainer } = useRequest();
    const { request: getTrainerContracts, loading: contractsLoading } = useRequest();
    const { request: getTrainerPaymentPlans } = useRequest();
    const { request: removePaymentPlan } = useRequest();
            
    const user = useSelector(state => state.user);

    const paymentPlansStorageKey = "paymentPlans";
    const contractsLimit = 8;

    const contractsFilters = useMemo(() => {
        return [
            { value: "actives", text: t("actives") },
            { value: "newest", text: t("newests") },
            { value: "oldest", text: t("oldests") },
            { value: "highest_value", text: t("highestValue") },
            { value: "lowest_value", text: t("lowestValue") },
            { value: "longest_duration", text: t("longests") },
            { value: "shortest_duration", text: t("shortests") }
        ]
    }, [t]);  
    
    const [contracts, setContracts] = useState([]);
    const [contractsError, setContractsError] = useState(false);
    const [contractsOffset, setContractsOffset] = useState(0);
    const [activeContractFilter, setActiveContractFilter] = useState(contractsFilters[0]);
    const [searchDate, setSearchDate] = useState({
        day: "",
        month: null,
        year: "",
        validYear: "",
        fullDate: ""
    });
    const [searchDateError, setSearchDateError] = useState(false);
    const [paymentPlans, setPaymentPlans] = useState([]);
    const [paymentPlansError, setPaymentPlansError] = useState(false);

    const loadContracts = useCallback((hasError, updatedContracts, offset, filter) => {
        if (hasError) return;

        if ((updatedContracts.length < contractsLimit && updatedContracts.length !== 0) || updatedContracts.length % contractsLimit !== 0 || (offset !== 0 && updatedContracts.length === 0)) {
            notify(t("contractsEnding"));

            return;
        }

        const getContracts = () => {
            return api.get(`/trainers/me/contracts`, { 
                params: { 
                    offset: offset, 
                    limit: contractsLimit, 
                    sort: filter,
                    fullDate: searchDate.fullDate || undefined,
                    month: searchDate.month?.value,
                    year: searchDate.validYear || undefined
                }
            });
        }
        
        const handleOnGetContractsSuccess = (data) => {
            const newContracts = [...updatedContracts, ...data];

            setContracts(newContracts);

            setContractsOffset(offset + contractsLimit);
        };
    
        const handleOnGetContractsError = () => {
            setContractsError(true);
        };

        const isFirstLoading = offset === 0;
    
        getTrainerContracts(
            getContracts, 
            handleOnGetContractsSuccess, 
            handleOnGetContractsError, 
            !isFirstLoading ? t("loadingContracts") : undefined, 
            !isFirstLoading ? t("successContracts") : undefined, 
            t("errorContracts")
        );
    }, [getTrainerContracts, notify, searchDate.fullDate, searchDate.month?.value, searchDate.validYear, t]);
    
    const handleOnChangeFilter = useCallback((filter, e) => {
        if (e) e.preventDefault();

        setContracts([]);
        setContractsOffset(0);
        setContractsError(false);

        loadContracts(false, [], 0, filter);
    }, [loadContracts]);

    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;
        
        const fetchData = async () => {
            const success = await verifyIsTrainer(isTrainer, user, navigate, notify, t);

            if (!success) return;

            loadContracts(contractsError, contracts, contractsOffset, activeContractFilter.value);

            const cachedData = getCacheData(paymentPlansStorageKey);
            
            if (cachedData) {
                setPaymentPlans(cachedData);

                return;
            }

            const getPaymentPlans = () => {
                return api.get(`/trainers/me/payment-plans`);
            }
        
            const handleOnGetPaymentPlansSuccess = (data) => {
                setPaymentPlans(data);

                setCacheData(paymentPlansStorageKey, data);
            };
        
            const handleOnGetPaymentPlansError = () => {
                setPaymentPlansError(true);
            };

            getTrainerPaymentPlans(
                getPaymentPlans, 
                handleOnGetPaymentPlansSuccess, 
                handleOnGetPaymentPlansError, 
                undefined, 
                undefined, 
                t("errorPaymentPlans")
            );
        }

        fetchData();
    }, [navigate, notify, isTrainer, user, getTrainerPaymentPlans, loadContracts, contractsError, contracts, contractsOffset, activeContractFilter.value, t]);

    const addPaymentPlan = useCallback(() => {
        if (paymentPlans.length >= 6) {
            notify(t("limitAlertPaymentPlans"), "error");

            return;
        }

        navigate("/trainers/me/create-payment-plan")
    }, [paymentPlans.length, navigate, notify, t]);

    const modifyPaymentPlan = useCallback(paymentPlan => {
        navigate("/trainers/me/create-payment-plan", { state: { paymentPlan } })
    }, [navigate]);

    const removePlan = useCallback(async ID => {
        const userConfirmed = await confirm(t("removeConfirmPaymentPlan"));
        
        if (userConfirmed) {
            const removePaymentPlanReq = () => {
                return api.delete(`/trainers/me/payment-plans/${ID}`);
            }
        
            const handleOnRemovePaymentPlanSuccess = () => {
                setPaymentPlans(prevPaymentPlans => prevPaymentPlans.filter(plan => String(plan.ID) !== String(ID)));

                removeItemFromCacheList(paymentPlansStorageKey, ID)
            };

            removePaymentPlan(
                removePaymentPlanReq, 
                handleOnRemovePaymentPlanSuccess, 
                () => undefined, 
                t("loadingRemovePaymentPlan"), 
                t("successRemovePaymentPlan"), 
                t("errorRemovePaymentPlan")
            );
        }
    }, [confirm, removePaymentPlan, t]);

    useEffect(() => {
        document.title = t("paymentsAndContracts");
    }, [t]);

    return (
        <NavBarLayout
            isClient={false}
        >
            <FooterLayout>
                <main
                    className={styles.trainer_payments_page}
                    style={{ padding: width <= 440 ? "1em 0" : "2em 0" }}
                >
                    <Stack
                        gap="2em"
                    >
                        <Stack
                            className={styles.title_container}
                        >
                            <Title
                                headingNumber={1}
                                text={t("paymentsAndContracts")}
                            />
                        </Stack>

                        <PaymentPlansContainer
                            paymentPlans={paymentPlans}
                            paymentPlansError={paymentPlansError}
                            handleAddPaymentPlan={addPaymentPlan}
                            handleModifyPaymentPlan={modifyPaymentPlan}
                            handleRemovePaymentPlan={removePlan}
                        />

                        <Stack
                            className={styles.contracts_container}
                            gap="3em"
                        >
                            <Title
                                headingNumber={2}
                                text={t("contracts")}
                                varColor="--theme-color"
                            />

                            <Stack
                                className={styles.contracts}
                                gap="2em"
                            >
                                <FilterItemsLayout
                                    filters={contractsFilters}
                                    activeFilter={activeContractFilter}
                                    setActiveFilter={setActiveContractFilter}
                                    handleChange={handleOnChangeFilter}
                                >
                                    <Stack
                                        direction={width <= 440 ? "column" : "row"}
                                        alignItems={width <= 440 ? "end" : "start"}
                                    >
                                        <LoadMoreButton
                                            handleLoad={(e) => handleOnChangeFilter(activeContractFilter.value, e)}
                                            text={t("reload")}
                                            loading={contractsLoading}
                                        />

                                        <DateInput
                                            dateValuesObject={searchDate}
                                            setDateValuesObject={setSearchDate}
                                            error={searchDateError}
                                            setError={setSearchDateError}
                                        />

                                    </Stack>
                                    
                                    {!contractsError && contracts.length === 0 ? (
                                        !contractsLoading && (
                                            <p>
                                                {t("noContracts")}
                                            </p>
                                        )
                                    ) : (
                                        <Stack
                                            gap="2em"
                                        >
                                            {contracts.length !== 0 ? (
                                                contracts.map((contract, index) => (
                                                    <React.Fragment
                                                        key={index}
                                                    >
                                                        <ContractCard
                                                            userName={contract.client?.name} 
                                                            userPhoto={contract.client?.photoUrl} 
                                                            startDate={contract.startDate} 
                                                            endDate={contract.endDate} 
                                                            status={translateDatabaseData(contract.status, "contractStatus", "name", user, t)} 
                                                            paymentPlanName={contract.paymentPlan?.name} 
                                                            transactionAmount={contract.paymentTransaction?.amount} 
                                                            transactionAppFee={contract.paymentTransaction?.appFee}
                                                            paymentMethod={contract.paymentTransaction?.paymentMethod}
                                                            transactionDate={contract.paymentTransaction?.createDate} 
                                                            transactionMpFee={contract.paymentTransaction?.mpFee}
                                                            transactionTrainerReceived={contract.paymentTransaction?.trainerReceived}
                                                            mercadoPagoTransactionId={contract.paymentTransaction?.mercadopagoTransactionID} 
                                                            transactionReceiptUrl={contract.paymentTransaction?.receiptUrl} 
                                                            forClient={false}
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

                                {contractsError ? (
                                    <p>
                                        <>
                                            {t("errorOcurredContracts")}

                                            <br/>
                                            
                                            {t("reloadOrTryLater")}
                                        </>
                                    </p>
                                ) : (
                                    <LoadMoreButton
                                        handleLoad={() => loadContracts(contractsError, contracts, contractsOffset, activeContractFilter.value)}
                                        loading={contractsLoading}
                                    />
                                )}
                            </Stack>
                        </Stack>
                    </Stack>
                </main>
            </FooterLayout>
        </NavBarLayout>
    );
}

export default TrainerPayments;