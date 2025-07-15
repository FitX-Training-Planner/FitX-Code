import styles from "./CreateTrainingPlan.module.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Title from "../text/Title";
import { useTrainingPlan } from "../../app/TrainingPlanProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/SystemMessageProvider";
import { useSelector } from "react-redux";
import { getNextOrder, removeAndReorder } from "../../utils/generators/generateOrder";
import api from "../../api/axios";
import useRequest from "../../hooks/useRequest";
import { validateAllElementsInTrainingPlan, validateTrainingPlan } from "../../utils/validators/formValidator";
import Stack from "../containers/Stack";
import TrainingPlanForm from "../form/forms/TrainingPlanForm";
import duplicateObjectInObjectList from "../../utils/generators/duplicate";
import { verifyIsTrainer } from "../../utils/requests/verifyUserType";
import { cleanCacheData } from "../../utils/cache/operations";
import BackButton from "../form/buttons/BackButton";

function CreateTrainingPlan() {    
    const navigate = useNavigate();

    const location = useLocation();
    
    const hasRun = useRef(false);
    
    const { notify } = useSystemMessage();
    const { confirm } = useSystemMessage();

    const { request: postOrPutPlanRequest } = useRequest();
    const { request: isTrainer } = useRequest();

    const { trainingPlan, setTrainingPlan, resetTrainingPlan } = useTrainingPlan();
        
    const user = useSelector(state => state.user);

    const trainingDayDestination = useMemo(() => (
        `/trainers/me/create-training-plan/modify-training-day`
    ), []);
    
    const [error, setError] = useState(false);
    
    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;

        const verifyTrainer = async () => {
            const success = await verifyIsTrainer(isTrainer, user, navigate, notify);

            if (!success) return;

            const locationTrainingPlan = location.state?.trainingPlan;
    
            if (locationTrainingPlan) setTrainingPlan(locationTrainingPlan);
        }

        verifyTrainer();
    }, [navigate, notify, isTrainer, user, location.state?.trainingPlan, setTrainingPlan]);

    const validatePlan = useCallback(() => {
        if (!validateTrainingPlan(
            error,
            setError,
            trainingPlan.name,
            trainingPlan.note
        )) {
            notify("Ainda há erros no formulário de plano de treino!", "error");

            return false;
        }

        return true;
    }, [error, notify, trainingPlan.name, trainingPlan.note]);

    const addTrainingDay = useCallback(() => {   
        if (trainingPlan.trainingDays.length >= 9) {
            notify("Você atingiu o limite de 9 dias para este plano de treino.", "error");

            return;
        }
     
        navigate(
            trainingDayDestination, 
            { state: { trainingDayOrder: getNextOrder(trainingPlan.trainingDays, "orderInPlan") } }
        )
    }, [navigate, notify, trainingDayDestination, trainingPlan.trainingDays]);

    const duplicateTrainingDay = useCallback((day) => {
        duplicateObjectInObjectList(
            day, 
            trainingPlan.trainingDays, 
            "trainingDays", 
            9, 
            "Você atingiu o limite de 9 dias para este plano de treino.", 
            notify, 
            "orderInPlan", 
            setTrainingPlan
        )
    }, [notify, setTrainingPlan, trainingPlan.trainingDays]);

    const modifyTrainingDay = useCallback(trainingDay => {
        navigate(trainingDayDestination, { state: { trainingDay } });
    }, [navigate, trainingDayDestination]);

    const removeTrainingDay = useCallback(async order => {
        const userConfirmed = await confirm("Deseja remover esse dia do seu treino?");
        
        if (userConfirmed) {
            setTrainingPlan(prevTrainingPlan => ({
                ...prevTrainingPlan,
                trainingDays: removeAndReorder(prevTrainingPlan.trainingDays, "orderInPlan", order)
            }));

            notify("Dia de treino removido!", "success");
        }
    }, [confirm, notify, setTrainingPlan]);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        if (!validatePlan()) return;

        const verification = validateAllElementsInTrainingPlan(
            error,
            setError,
            trainingPlan
        );

        if (verification.error) {
            notify(verification.message, "error");
            
            return;
        }

        const formData = new FormData();

        formData.append("trainingPlan", JSON.stringify(trainingPlan));

        let requestFn = () => undefined;
        let loadingMessage = "";
        let successMessage = "";
        let errorMessage = "";

        if (trainingPlan.ID) {
            requestFn = () => {
                return api.put(`/trainers/me/training-plans/${trainingPlan.ID}`, formData);
            };

            loadingMessage = "Modificando";
            successMessage = "Plano de treino modificado com sucesso!";
            errorMessage = "Falha ao modificar plano!";
        } else {
            requestFn = () => {
                return api.post(`/trainers/me/training-plans`, formData);
            };

            loadingMessage = "Criando";
            successMessage = "Plano de treino criado com sucesso!";
            errorMessage = "Falha ao criar plano!";
        }

        const handleOnPostOrPutPlanSuccess = () => {
            navigate("/trainers/me/training-plans");

            resetTrainingPlan();

            cleanCacheData("trainingPlans");
        };

        const handleOnPostOrPutPlanError = () => {
            setError(true);
        };

        postOrPutPlanRequest(
            requestFn, 
            handleOnPostOrPutPlanSuccess, 
            handleOnPostOrPutPlanError, 
            loadingMessage, 
            successMessage, 
            errorMessage
        );
    }, [error, navigate, notify, postOrPutPlanRequest, resetTrainingPlan, trainingPlan, validatePlan]);

    useEffect(() => {
        document.title = "Criar Plano de Treino";
    }, []);

    return (
        <main
            className={styles.training_plan_page}
        >
            <BackButton
                destiny="/trainers/me/training-plans"
            />

            <Stack
                gap="3em"
            >
                <Stack
                    className={styles.training_title_container}
                >
                    <Title
                        headingNumber={1}
                        text="Plano de Treino"
                    />

                    <Title
                        headingNumber={2}
                        text={`${trainingPlan.ID ? "Modificar" : "Criar"} Modelo`}
                        varColor="--light-theme-color"
                    />

                    {!trainingPlan.ID && (
                        <p>
                            Crie um plano de treino completo para usar com quantos clientes você quiser!
                        </p>
                    )}
                </Stack>

                <TrainingPlanForm
                    trainingPlan={trainingPlan}
                    setTrainingPlan={setTrainingPlan}
                    setTrainingPlanError={setError}
                    handleSubmit={handleOnSubmit}
                    handleAddTrainingDay={addTrainingDay}
                    handleDuplicateTrainingDay={duplicateTrainingDay}
                    handleModifyTrainingDay={modifyTrainingDay}
                    handleRemoveTrainingDay={removeTrainingDay}
                />
            </Stack>
        </main>
    );
}

export default CreateTrainingPlan;