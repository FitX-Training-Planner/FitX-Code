import styles from "./CreateTrainingPlan.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import Title from "../text/Title";
import { useLocation, useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/useSystemMessage";
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
import { useTranslation } from "react-i18next";

function CreatePaymentPlan() { 
    const { t } = useTranslation();

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
        fullPrice: "",
        durationDays: "",
        description: "",
        benefits: []
    });
    const [error, setError] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    
    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;

        const verifyTrainer = async () => {
            const success = await verifyIsTrainer(isTrainer, user, navigate, notify, t);

            if (!success) return;

            const locationTrainingPlan = location.state?.paymentPlan;
    
            if (locationTrainingPlan) setPaymentPlan(locationTrainingPlan);
        }

        verifyTrainer();
    }, [navigate, notify, isTrainer, user, location.state?.paymentPlan, setPaymentPlan, t]);

    const addBenefit = useCallback(() => {   
        if (paymentPlan.benefits.length >= 8) {
            notify(t("limitAlertPaymentPlanBenefits"), "error");

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
    }, [notify, paymentPlan.benefits, t]);

    const removeBenefit = useCallback(async ID => {
        const userConfirmed = await confirm(t("removeConfirmPaymentPlanBenefit"));
        
        if (userConfirmed) {
            setPaymentPlan(prevPaymentPlan => ({
                ...prevPaymentPlan,
                benefits: removeAndReorder(prevPaymentPlan.benefits, "ID", ID)
            }));
        }
    }, [confirm, setPaymentPlan, t]);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        if (!acceptTerms) return;

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

            loadingMessage = t("modifying");
            successMessage = t("successModifyPaymentPlan");
            errorMessage = t("errorModifyPaymentPlan");
        } else {
            requestFn = () => {
                return api.post(`/trainers/me/payment-plans`, formData);
            };

            loadingMessage = t("creating");
            successMessage = t("successCreatePaymentPlan");
            errorMessage = t("errorCreatePaymentPlan");
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
    }, [error, navigate, postOrPutPlanRequest, paymentPlan, acceptTerms, t]);

    useEffect(() => {
        document.title = t("createPaymentPlan");
    }, [t]);

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
                        text={t("paymentPlan")}
                    />

                    <Title
                        headingNumber={2}
                        text={`${paymentPlan.ID ? t("modify") : t("create")} ${t("plan")}`}
                        varColor="--light-theme-color"
                    />

                    {!paymentPlan.ID && (
                        <p>
                            {t("createPaymentPlanDescription")}
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
                    acceptTerms={acceptTerms}
                    setAcceptedTerms={setAcceptTerms}
                />
            </Stack>
        </main>
    );
}

export default CreatePaymentPlan;