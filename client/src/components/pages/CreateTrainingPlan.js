// import styles from "./CreateTrainingPlan.module.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Title from "../text/Title";
import { useTrainingPlan } from "../../app/TrainingPlanProvider";
import { useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/SystemMessageProvider";
import { useSelector } from "react-redux";
import { getNextOrder, removeAndReorder } from "../../utils/generators/generateOrder";
import api from "../../api/axios";
import useRequest from "../../hooks/useRequest";
import { validateAllElementsInTrainingPlan, validateTrainingPlan } from "../../utils/validators/formValidator";
import Stack from "../containers/Stack";
import TrainingPlanForm from "../form/forms/TrainingPlanForm";

function CreateTrainingPlan() {    
    const navigate = useNavigate();
    
    const hasRun = useRef(false);
    
    const { notify, confirm } = useSystemMessage();

    const { request: postPlanRequest } = useRequest();
    const { request: verifyIsTrainer } = useRequest();

    const { trainingPlan, setTrainingPlan, resetTrainingPlan } = useTrainingPlan();
        
    const user = useSelector(state => state.user);

    const trainingDayDestination = useMemo(() => (
        `/trainers/me/create-training-plan/modify-training-day`
    ), []);
    
    const [error, setError] = useState(false);
    
    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;
    
        if (user.config.isClient) {
            navigate("/");
            
            notify("Essa página só pode ser acessada por treinadores.", "error");

            return;
        }

        const getIsTrainer = () => {
            return api.post(`/is-trainer`);
        };

        verifyIsTrainer(getIsTrainer, () => undefined, () => undefined);
    }, [navigate, notify, verifyIsTrainer, user.config.isClient]);

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

        if (!validatePlan()) return;
     
        navigate(
            trainingDayDestination, 
            { state: { trainingDayOrder: getNextOrder(trainingPlan.trainingDays, "orderInPlan") } }
        )
    }, [navigate, notify, trainingDayDestination, trainingPlan.trainingDays, validatePlan]);

    const modifyTrainingDay = useCallback(trainingDay => {
        if (!validatePlan()) return;

        navigate(trainingDayDestination, { state: { trainingDay } })
    }, [navigate, trainingDayDestination, validatePlan]);

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

        formData.append("trainingPlan", trainingPlan);

        const postTrainingPlan = () => {
            return api.post(`/trainers/me/training-plans`, formData);
        };

        const handleOnPostPlanSuccess = () => {
            navigate("/");

            resetTrainingPlan();
        };

        const handleOnPostPlanError = () => {
            setError(true);
        };

        postPlanRequest(
            postTrainingPlan, 
            handleOnPostPlanSuccess, 
            handleOnPostPlanError, 
            "Criando", 
            "Plano de treino criado com sucesso!", 
            "Falha ao criar plano!"
        );
    }, [error, navigate, notify, postPlanRequest, resetTrainingPlan, trainingPlan, validatePlan]);

    useEffect(() => {
        document.title = "Criar Plano de Treino";
    }, []);

    return (
        <main>
            <Stack>
                <Stack>
                    <Title
                        headingNumber={1}
                        text="Novo Plano de Treino"
                    />

                    <p>
                        Crie um plano de treino completo para usar com quantos clientes você quiser!
                    </p>
                </Stack>

                <TrainingPlanForm
                    trainingPlan={trainingPlan}
                    setTrainingPlan={setTrainingPlan}
                    setTrainingPlanError={setError}
                    handleSubmit={handleOnSubmit}
                    handleAddTrainingDay={addTrainingDay}
                    handleModifyTrainingDay={modifyTrainingDay}
                    handleRemoveTrainingDay={removeTrainingDay}
                />
            </Stack>
        </main>
    );
}

export default CreateTrainingPlan;