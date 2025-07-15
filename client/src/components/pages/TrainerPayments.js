import { useSelector } from "react-redux";
import useRequest from "../../hooks/useRequest";
import { useSystemMessage } from "../../app/SystemMessageProvider";
import useWindowSize from "../../hooks/useWindowSize";
import { getCacheData, removeItemFromCacheList, setCacheData } from "../../utils/cache/operations";
import React, { useCallback, useMemo, useEffect, useRef, useState } from "react";
import { verifyIsTrainer } from "../../utils/requests/verifyUserType";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import NavBarLayout from "../containers/NavBarLayout";
import Stack from "../containers/Stack";
import Title from "../text/Title";
import PaymentPlanCard from "../cards/contracts/PaymentPlanCard";
import ContractCard from "../cards/contracts/ContractCard";
import styles from "./TrainerPayments.module.css";
import FlexWrap from "../containers/FlexWrap";
import ClickableIcon from "../form/buttons/ClickableIcon";
import LoadMoreButton from "../form/buttons/LoadMoreButton";
import FilterItemsLayout from "../containers/FilterItemsLayout";
import SearchInput from "../form/fields/SearchInput";

function TrainerPayments() {
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
    const contractsLimit = 15;

    const contractsFilters = useMemo(() => {
        return [
            { value: "newest", text: "Mais novos" },
            { value: "oldest", text: "Mais antigos" },
            { value: "highest_value", text: "Maior valor" },
            { value: "lowest_value", text: "Menor valor" },
            { value: "longest_duration", text: "Mais longos" },
            { value: "shortest_duration", text: "Mais curtos" }
        ]
    }, []);  
    
    const [contracts, setContracts] = useState([]);
    const [showedContracts, setShowedContracts] = useState([]);
    const [contractsError, setContractsError] = useState(false);
    const [contractsOffset, setContractsOffset] = useState(0);
    const [activeContractFilter, setActiveContractFilter] = useState(contractsFilters[0]);
    const [contractsSearchText, setContractsSearchText] = useState("");
    const [paymentPlans, setPaymentPlans] = useState([]);
    const [paymentPlansError, setPaymentPlansError] = useState(false);

    const loadContracts = useCallback((hasError, updatedContracts, offset, filter) => {
        if (hasError) return;

        if ((updatedContracts.length < contractsLimit && updatedContracts.length !== 0) || updatedContracts.length % contractsLimit !== 0) {
            notify("Você chegou ao fim dos seus contratos!");

            return;
        }

        const getContracts = () => {
            return api.get(`/trainers/me/contracts`, { 
                params: { 
                    offset: offset, 
                    limit: contractsLimit, 
                    sort: filter
                }
            });
        }
        
        const handleOnGetContractsSuccess = (data) => {
            const testContract = [{
                startDate: new Date(),        
                endDate: new Date(),
                status: "Vencido",        
                trainerID: 1,
                client: {
                    ID: 2,
                    name: "Paulo Henrique",
                    photoUrl: "/images/icons/chatbot2.png"
                },
                paymentPlan: {
                    ID: 1,
                    durationDays: "270",
                    name: "Plano de mestre"
                },
                paymentTransaction: {
                    ID: 1,
                    amount: "10000.50",
                    paymentMethod: "PIX",
                    createDate: new Date(),
                    mercadopagoTransactionID: "19283829",
                    receiptUrl: "https://mercadopago/transaction/receipt/192838382834783939394"
                }
            }];
            
            const newContracts = [...updatedContracts, ...testContract];

            setContracts(newContracts);
            setShowedContracts(newContracts);

            setContractsOffset(offset + contractsLimit);
        };
    
        const handleOnGetContractsError = () => {
            setContractsError(true);
        };
    
        getTrainerContracts(
            getContracts, 
            handleOnGetContractsSuccess, 
            handleOnGetContractsError, 
            "Carregando contratos", 
            "Contratos carregados!", 
            "Falha ao carregar contratos!"
        );
    }, [getTrainerContracts, notify]);
    
    const handleOnChangeFilter = useCallback((filter) => {
        setContracts([]);
        setShowedContracts([]);
        setContractsOffset(0);
        setContractsError(false);

        loadContracts(false, [], 0, filter);
    }, [loadContracts]);

    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;
        
        const fetchData = async () => {
            const success = await verifyIsTrainer(isTrainer, user, navigate, notify);

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
                "Falha ao recuperar planos de pagamento!"
            );
        }

        fetchData();
    }, [navigate, notify, isTrainer, user, getTrainerPaymentPlans, loadContracts, contractsError, contracts, contractsOffset, activeContractFilter.value]);

    const addPaymentPlan = useCallback(() => {
        if (paymentPlans.length >= 6) {
            notify("Você atingiu o limite de 6 planos de pagamento.", "error");

            return;
        }

        navigate("/trainers/me/create-payment-plan")
    }, [paymentPlans.length, navigate, notify]);

    const modifyPaymentPlan = useCallback(paymentPlan => {
        navigate("/trainers/me/create-payment-plan", { state: { paymentPlan } })
    }, [navigate]);

    const removePlan = useCallback(async ID => {
        const userConfirmed = await confirm("Deseja remover esse plano de pagamento?");
        
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
                "Removendo plano", 
                "Plano removido!", 
                "Falha ao remover plano!"
            );
        }
    }, [confirm, removePaymentPlan]);

    useEffect(() => {
        document.title = "Pagamentos e Contratos";
    }, []);

    return (
        <NavBarLayout
            isClient={false}
        >
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
                            text="Pagamentos e Contratos"
                        />
                    </Stack>

                    <Stack
                        className={styles.payment_plans_container}
                        gap="3em"
                    >
                        <Title
                            headingNumber={2}
                            text="Planos de Pagamento"
                        />

                        {paymentPlans.length === 0 ? (
                            paymentPlansError ? (
                                <p>
                                    Ocorreu um erro ao recuperar seus planos de pagamento!

                                    <br/>
                                    
                                    Recarregue a página ou tente de novo mais tarde.
                                </p>
                            ) : (
                                <p>
                                    Crie seu primeiro plano de pagamento clicando no botão abaixo.
                                </p>
                            )
                        ) : (
                            <FlexWrap
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                gap="2em"
                                maxElements={width <= 940 ? 1 : 2}
                                className={styles.payment_plans}
                            >
                                {paymentPlans.length === 0 ? (
                                    <p>
                                        Crie seu primeiro plano de pagamento clicando no botão abaixo.
                                    </p>
                                ) : (
                                    paymentPlans.map((plan, index) => (
                                        <React.Fragment
                                            key={index}
                                        >
                                            <PaymentPlanCard
                                                name={plan.name} 
                                                fullPrice={plan.fullPrice} 
                                                durationDays={plan.durationDays} 
                                                description={plan.description} 
                                                benefits={plan.benefits}
                                                handleModifyPaymentPlan={() => modifyPaymentPlan(plan)}
                                                handleRemovePaymentPlan={() => removePlan(plan.ID)}
                                            />
                                        </React.Fragment>
                                    ))
                                )}
                            </FlexWrap>
                        )}

                        <ClickableIcon
                            iconSrc="/images/icons/add.png"
                            name="Adicionar Plano"
                            handleClick={addPaymentPlan}
                        />
                    </Stack>

                    <Stack
                        className={styles.contracts_container}
                        gap="3em"
                    >
                        <Title
                            headingNumber={2}
                            text="Contratos"
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
                                {!contractsError && contracts.length === 0 ? (
                                    !contractsLoading && (
                                        <p>
                                            Você ainda não possui nenhum contrato.
                                        </p>
                                    )
                                ) : (
                                    <Stack
                                        gap="3em"
                                    >
                                        <SearchInput
                                            placeholder="Filtrar por status..."
                                            name="Filtrar"
                                            searchText={contractsSearchText}
                                            setSearchText={setContractsSearchText}
                                            items={contracts}
                                            setShowedItems={setShowedContracts}
                                            searchKey="status"
                                        />

                                        <Stack
                                            gap="2em"
                                        >
                                            {showedContracts.length !== 0 ? (
                                                showedContracts.map((contract, index) => (
                                                    <React.Fragment
                                                        key={index}
                                                    >
                                                        <ContractCard
                                                            clientName={contract.client?.name} 
                                                            clientPhoto={contract.client?.photoUrl} 
                                                            startDate={contract.startDate} 
                                                            endDate={contract.endDate} 
                                                            status={contract.status} 
                                                            durationDays={contract.paymentPlan?.durationDays} 
                                                            paymentPlanName={contract.paymentPlan?.name} 
                                                            paymentPlanID={contract.paymentPlan?.ID}
                                                            paymentAmount={contract.paymentTransaction?.amount} 
                                                            paymentMethod={contract.paymentTransaction?.paymentMethod} 
                                                            paymentTransactionDate={contract.paymentTransaction?.createDate} 
                                                            mercadoPagoTransactionId={contract.paymentTransaction?.mercadopagoTransactionID} 
                                                            paymentReceiptUrl={contract.paymentTransaction?.receiptUrl} 
                                                        />
                                                    </React.Fragment>
                                                ))
                                            ) : (
                                                <p>
                                                    Sem resultado
                                                </p>
                                            )}
                                        </Stack>
                                    </Stack>
                                )}
                            </FilterItemsLayout>

                            {contractsError ? (
                                <p>
                                    <>
                                        Ocorreu um erro ao carregar seus contratos!

                                        <br/>
                                        
                                        Recarregue a página ou tente de novo mais tarde.
                                    </>
                                </p>
                            ) : (
                                !contractsLoading && (
                                    <LoadMoreButton
                                        handleLoad={() => loadContracts(contractsError, contracts, contractsOffset, activeContractFilter.value)}
                                    />
                                )
                            )}
                        </Stack>
                    </Stack>
                </Stack>
            </main>
        </NavBarLayout>
    );
}

export default TrainerPayments;