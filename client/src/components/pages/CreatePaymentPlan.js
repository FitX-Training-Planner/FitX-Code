import styles from "./CreateTrainingPlan.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import Title from "../text/Title";
import { useLocation, useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/SystemMessageProvider";
import { useSelector } from "react-redux";
import { getNextOrder, removeAndReorder } from "../../utils/generators/generateOrder";
import api from "../../api/axios";
import useRequest from "../../hooks/useRequest";
import Stack from "../containers/Stack";
import { verifyIsTrainer } from "../../utils/requests/verifyUserType";
import { cleanCacheData } from "../../utils/cache/operations";
import BackButton from "../form/buttons/BackButton";
import { validatePaymentPlan } from "../../utils/validators/formValidator";
import PaymentPlanForm from "../form/forms/PaymentPlanForm";

function CreatePaymentPlan() {    
    const navigate = useNavigate();

    const location = useLocation();
    
    const hasRun = useRef(false);
    
    const { notify } = useSystemMessage();
    const { confirm } = useSystemMessage();

    const { request: postOrPutPlanRequest } = useRequest();
    const { request: isTrainer } = useRequest();
        
    const user = useSelector(state => state.user);
    
    const [paymentPlan, setPaymentPlan] = useState({
        ID: null,
        name: "",
        fullPrice: "10,00",
        durationDays: "",
        description: "",
        benefits: []
    });
    const [error, setError] = useState(false);
    
    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;

        const verifyTrainer = async () => {
            const success = await verifyIsTrainer(isTrainer, user, navigate, notify);

            if (!success) return;

            const locationTrainingPlan = location.state?.paymentPlan;
    
            if (locationTrainingPlan) setPaymentPlan(locationTrainingPlan);
        }

        verifyTrainer();
    }, [navigate, notify, isTrainer, user, location.state?.paymentPlan, setPaymentPlan]);

    const addBenefit = useCallback(() => {   
        if (paymentPlan.benefits.length >= 8) {
            notify("Você pode exibir até 8 benefícios no plano de pagamento.", "error");

            return;
        }
     
        setPaymentPlan(prevPaymentPlan => ({ 
            ...prevPaymentPlan, 
            benefits: [
                ...prevPaymentPlan.benefits,
                {
                    ID: getNextOrder(paymentPlan.benefits, "ID"),
                    description: ""
                }
            ] 
        }));
    }, [notify, paymentPlan.benefits]);

    const removeBenefit = useCallback(async ID => {
        const userConfirmed = await confirm("Deseja remover esse benefício do seu plano?");
        
        if (userConfirmed) {
            setPaymentPlan(prevPaymentPlan => ({
                ...prevPaymentPlan,
                benefits: removeAndReorder(prevPaymentPlan.benefits, "ID", ID)
            }));
        }
    }, [confirm, setPaymentPlan]);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        if (!validatePaymentPlan(
            error,
            setError,
            paymentPlan.name,
            paymentPlan.fullPrice,
            paymentPlan.durationDays,
            paymentPlan.description,
            paymentPlan.benefits
        )) return;

        const formData = new FormData();

        formData.append("name", paymentPlan.name);
        formData.append("fullPrice", paymentPlan.fullPrice.replace(",", "."));
        formData.append("durationDays", paymentPlan.durationDays);
        formData.append("description", paymentPlan.description);
        formData.append("benefits", JSON.stringify(
            paymentPlan.benefits.map(benefit => benefit.description.trim())
        ));

        let requestFn = () => undefined;
        let loadingMessage = "";
        let successMessage = "";
        let errorMessage = "";

        if (paymentPlan.ID) {
            requestFn = () => {
                return api.put(`/trainers/me/payment-plans/${paymentPlan.ID}`, formData);
            };

            loadingMessage = "Modificando";
            successMessage = "Plano de pagamento modificado com sucesso!";
            errorMessage = "Falha ao modificar plano!";
        } else {
            requestFn = () => {
                return api.post(`/trainers/me/payment-plans`, formData);
            };

            loadingMessage = "Criando";
            successMessage = "Plano de pagamento criado com sucesso!";
            errorMessage = "Falha ao criar plano!";
        }

        const handleOnPostOrPutPlanSuccess = () => {
            navigate("/trainers/me/payments");

            cleanCacheData("paymentPlans");
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
    }, [error, navigate, postOrPutPlanRequest, paymentPlan]);

    useEffect(() => {
        document.title = "Criar Plano de Pagamento";
    }, []);

    return (
        <main
            className={styles.training_plan_page}
        >
            <BackButton
                destiny="/trainers/me/payments"
            />

            <Stack
                gap="3em"
            >
                <Stack
                    className={styles.training_title_container}
                >
                    <Title
                        headingNumber={1}
                        text="Plano de Pagamento"
                    />

                    <Title
                        headingNumber={2}
                        text={`${paymentPlan.ID ? "Modificar" : "Criar"} Plano`}
                        varColor="--light-theme-color"
                    />

                    {!paymentPlan.ID && (
                        <p>
                            Crie um plano de pagamento personalizado para atrair mais clientes!
                        </p>
                    )}
                </Stack>

                <PaymentPlanForm
                    paymentPlan={paymentPlan} 
                    setPaymentPlan={setPaymentPlan} 
                    setPaymentPlanError={setError} 
                    handleSubmit={handleOnSubmit} 
                    handleAddBenefit={addBenefit} 
                    handleRemoveBenefit={removeBenefit}
                />
            </Stack>
        </main>
    );
}

export default CreatePaymentPlan;