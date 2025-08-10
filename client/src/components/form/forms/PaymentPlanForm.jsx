import React, { useState } from "react";
import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import TextArea from "../fields/TextArea";
import TextInput from "../fields/TextInput";
import { isNoteValid, isPlanNameValid } from "../../../utils/validators/trainingValidator";
import { formattNameAndNote, formattSecondsMinutesAndReps } from "../../../utils/formatters/training/formatOnChange";
import ClickableIcon from "../buttons/ClickableIcon";
import { handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import Title from "../../text/Title";
import { isPaymentPlanDurationValid, isPaymentPlanPriceValid } from "../../../utils/validators/paymentsValidator";
import { formatPrice } from "../../../utils/formatters/payments/formatOnChange";
import Benefit from "../fields/PaymentPlanBenefitInput";
import { useTranslation } from "react-i18next";
import Alert from "../../messages/Alert";

function PaymentPlanForm({
    paymentPlan,
    setPaymentPlan,
    setPaymentPlanError,
    handleSubmit,
    handleAddBenefit,
    handleRemoveBenefit
}) { 
    const { t } = useTranslation();

    const [errors, setErrors] = useState({
        name: false,
        fullPrice: false,
        durationDays: false,
        benefits: [],
        description: false
    });

    return (
        <form
            onSubmit={handleSubmit}
        >
            <Stack
                gap="3em"
            >
                <p>
                    - {t("mandatoryFields")}
                </p>
                
                <Stack
                    gap="2em"
                >    
                    <TextInput
                        name="name"
                        placeholder={t("paymentPlanNamePlaceholder")}
                        labelText={`${t("paymentPlanName")} *`}
                        value={paymentPlan.name}
                        handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, isPlanNameValid, paymentPlan, setPaymentPlan, setPaymentPlanError, setErrors)}
                        alertMessage={t("alertPaymentPlanName")}
                        error={errors.name}
                        maxLength={50}
                    />

                    <Stack>
                        <Stack
                            direction="row"
                            justifyContent="start"
                        >
                            <Alert />   

                            <p>
                                {t("mpFeeAlert")}
                            </p>
                        </Stack>

                        <TextInput
                            name="fullPrice"
                            placeholder={t("paymentPlanFullPricePlaceholder")}
                            labelText={`${t("price")} *`}
                            value={paymentPlan.fullPrice}
                            handleChange={(e) => handleOnChangeTextField(e, formatPrice, isPaymentPlanPriceValid, paymentPlan, setPaymentPlan, setPaymentPlanError, setErrors)}
                            alertMessage={t("alertPaymentPlanFullPrice")}
                            error={errors.fullPrice}
                            maxLength={8}
                        />
                    </Stack>

                    <TextInput
                        name="durationDays"
                        placeholder={t("paymentPlanDurationDaysPlaceholder")}
                        labelText={`${t("paymentPlanDurationDays")} *`}
                        value={paymentPlan.durationDays}
                        handleChange={(e) => handleOnChangeTextField(e, formattSecondsMinutesAndReps, isPaymentPlanDurationValid, paymentPlan, setPaymentPlan, setPaymentPlanError, setErrors)}
                        alertMessage={t("alertPaymentPlanDurationDays")}
                        error={errors.durationDays}
                        maxLength={3}
                    />

                    <Stack
                        gap="2em"
                    >
                        <Title
                            headingNumber={3}
                            text={t("paymentPlanBenefits")}
                        />

                        <Stack>
                            <Stack
                                gap="0.5em"
                            >
                                {paymentPlan.benefits.map((benefit, index) => (
                                    <React.Fragment
                                        key={index}
                                    >
                                        <Stack
                                            gap="0.2em"
                                        >
                                            <Benefit
                                                benefit={benefit}
                                                setBenefit={(updatedBenefit) => {
                                                    setPaymentPlan(prev => ({
                                                        ...prev,
                                                        benefits: prev.benefits.map(b => 
                                                            String(b.ID) === String(updatedBenefit.ID) ? updatedBenefit : b
                                                        )
                                                    }));
                                                }}
                                                handleRemoveBenefit={handleRemoveBenefit}
                                                setPaymentPlanError={setPaymentPlanError}
                                            />

                                            <hr/>
                                        </Stack>
                                    </React.Fragment>
                                ))}
                            </Stack>

                            <ClickableIcon
                                iconSrc="/images/icons/add.png"
                                name={t("addBenefit")}
                                handleClick={handleAddBenefit}
                            />
                        </Stack>
                    </Stack>

                    <TextArea
                        name="description"
                        placeholder={t("paymentPlanDescriptionPlaceholder")}
                        labelText={t("description")}
                        value={paymentPlan.description}
                        handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, isNoteValid, paymentPlan, setPaymentPlan, setPaymentPlanError, setErrors)}
                        alertMessage={t("alertPaymentPlanDescription")}
                        error={errors.description}
                        maxLength={500}
                    />
                </Stack>

                <SubmitFormButton
                    text={`${paymentPlan.ID ? t("modify") : t("create")} ${t("paymentPlan")}`}
                />
            </Stack>
        </form>
    );
}

export default PaymentPlanForm;