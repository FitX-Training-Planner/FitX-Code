import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/SystemMessageProvider";
import { useSelector } from "react-redux";
import api from "../../api/axios";
import useRequest from "../../hooks/useRequest";
import useWindowSize from "../../hooks/useWindowSize";
import { verifyIsTrainer } from "../../utils/requests/verifyUserType";
import NavBarLayout from "../containers/NavBarLayout";
import Stack from "../containers/Stack";
import Title from "../text/Title";
import ClickableIcon from "../form/buttons/ClickableIcon";
import TrainingPlanCompactedCard from "../cards/training/TrainingPlanCompactedCard";
import styles from "./TrainingPlans.module.css";
import { getCacheData, removeItemFromCacheList, setCacheData } from "../../utils/cache/operations";
import SearchInput from "../form/fields/SearchInput";

function TrainingPlans() {    
    const navigate = useNavigate();
    
    const hasRun = useRef(false);

    const { width } = useWindowSize();
    
    const { notify } = useSystemMessage();
    const { confirm } = useSystemMessage();

    const { request: getTrainingPlans } = useRequest();
    const { request: isTrainer } = useRequest();
    const { request: removeTrainingPlan } = useRequest();
        
    const user = useSelector(state => state.user);

    const storageKey = "trainingPlans";
    
    const [trainingPlans, setTrainingPlans] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [showedTrainingPlans, setShowedTrainingPlans] = useState([]);

    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;
        
        const fetchData = async () => {
            const success = await verifyIsTrainer(isTrainer, user, navigate, notify);

            if (!success) return;

            const cachedData = getCacheData(storageKey);

            if (cachedData) {
                setTrainingPlans(cachedData);
                setShowedTrainingPlans(cachedData);

                return;
            }
            
            const getPlans = () => {
                return api.get("/trainers/me/training-plans");
            }
        
            const handleOnGetPlansSuccess = (data) => {
                setTrainingPlans(data);
                setShowedTrainingPlans(data);

                setCacheData(storageKey, data);
            };
        
            const handleOnGetPlansError = () => {
                navigate("/");
            };

            getTrainingPlans(
                getPlans, 
                handleOnGetPlansSuccess, 
                handleOnGetPlansError, 
                "Recuperando planos", 
                "Planos recuperados!", 
                "Falha ao recuperar planos!"
            );
        }

        fetchData();
    }, [navigate, notify, isTrainer, user, getTrainingPlans]);

    const addTrainingPlan = useCallback(() => {   
        if (trainingPlans.length >= 20) {
            notify("Você atingiu o limite de 20 planos de treinamento.", "error");

            return;
        }

        navigate("/trainers/me/create-training-plan");
    }, [navigate, notify, trainingPlans.length]);

    const modifyTrainingPlan = useCallback(trainingPlan => {
        navigate("/trainers/me/create-training-plan", { state: { trainingPlan } });
    }, [navigate]);

    const expandPlan = useCallback(ID => {
        navigate(`/trainers/me/training-plans/${ID}`);
    }, [navigate]);

    const removePlan = useCallback(async ID => {
        const userConfirmed = await confirm("Deseja remover esse plano permanentemente?");
        
        if (userConfirmed) {
            const removePlan = () => {
                return api.delete(`/trainers/me/training-plans/${ID}`);
            }
        
            const handleOnRemovePlanSuccess = () => {
                const filteredItems = trainingPlans.filter(plan => String(plan.ID) !== String(ID));

                setTrainingPlans(filteredItems);
                setShowedTrainingPlans(filteredItems);

                removeItemFromCacheList(storageKey, ID)
            };

            removeTrainingPlan(
                removePlan, 
                handleOnRemovePlanSuccess, 
                () => undefined, 
                "Removendo plano", 
                "Plano removido!", 
                "Falha ao remover plano!"
            );
        }
    }, [confirm, removeTrainingPlan, trainingPlans]);

    useEffect(() => {
        document.title = "Planos de Treino";
    }, []);

    return (
        <NavBarLayout
            isClient={false}
        >
            <main
                className={styles.training_plans_page}
            >
                <Stack
                    gap="4em"
                >
                    <Stack
                        className={styles.training_plans_title}
                    >
                        <Title
                            headingNumber={1}
                            text="Planos de Treino"
                        />

                        <p>
                            Adicione, edite, ou remova quantos planos de treino quiser!
                        </p>
                    </Stack>

                    <Stack
                        gap="3em"
                    >
                        {trainingPlans.length !== 0 && (
                            <SearchInput
                                searchText={searchText}
                                setSearchText={setSearchText}
                                items={trainingPlans}
                                setShowedItems={setShowedTrainingPlans}
                                searchKey="name"
                                placeholder="Filtrar por nome..."
                                name="Filtrar"
                            />
                        )}

                        <Stack
                            gap="2em"
                        >
                            {trainingPlans.length === 0 ? (
                                <p>
                                    Crie seu primeiro plano de treino clicando no botão abaixo.
                                </p>
                            ) : (
                                showedTrainingPlans.length !== 0 ? (
                                    showedTrainingPlans.map((trainingPlan, index) => (
                                        <React.Fragment
                                            key={index}
                                        >
                                            <TrainingPlanCompactedCard
                                                headingNumber={2}
                                                planID={trainingPlan.ID}
                                                name={trainingPlan.name}
                                                trainingDays={trainingPlan.trainingDays}
                                                handleModifyPlan={() => modifyTrainingPlan(trainingPlan)}
                                                handleRemovePlan={() => removePlan(trainingPlan.ID)}
                                                handleExpandPlan={() => expandPlan(trainingPlan.ID)}
                                                width={width}
                                            />
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <p>
                                        Sem resultado
                                    </p>
                                )
                            )}
                        </Stack>

                        <ClickableIcon
                            iconSrc="/images/icons/add.png"
                            name="Adicionar Plano"
                            handleClick={addTrainingPlan}
                        />
                    </Stack>
                </Stack>
            </main>
        </NavBarLayout>
    );
}

export default TrainingPlans;