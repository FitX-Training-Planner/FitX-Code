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

function PaymentPlanForm({ paymentPlan, setPaymentPlan, setPaymentPlanError, handleSubmit, handleAddBenefit, handleRemoveBenefit }) { 
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
                    - Os campos obrigatórios são marcados com "*".
                </p>
                
                <Stack
                    gap="2em"
                >    
                    <TextInput
                        name="name"
                        placeholder="Insira o nome do plano"
                        labelText="Nome do Plano de Pagamento *"
                        value={paymentPlan.name}
                        handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, isPlanNameValid, paymentPlan, setPaymentPlan, setPaymentPlanError, setErrors)}
                        alertMessage="O nome deve ter entre 1 e 50 caracteres."
                        error={errors.name}
                        maxLength={50}
                    />

                    <TextInput
                        name="fullPrice"
                        placeholder="Insira o preço do plano"
                        labelText="Preço *"
                        value={paymentPlan.fullPrice}
                        handleChange={(e) => handleOnChangeTextField(e, formatPrice, isPaymentPlanPriceValid, paymentPlan, setPaymentPlan, setPaymentPlanError, setErrors)}
                        alertMessage="O preço do plano deve ser um valor entre R$ 9,99 e R$ 99.999,99."
                        error={errors.fullPrice}
                        maxLength={8}
                    />

                    <TextInput
                        name="durationDays"
                        placeholder="Insira a duração do contrato"
                        labelText="Duração do Contrato em Dias *"
                        value={paymentPlan.durationDays}
                        handleChange={(e) => handleOnChangeTextField(e, formattSecondsMinutesAndReps, isPaymentPlanDurationValid, paymentPlan, setPaymentPlan, setPaymentPlanError, setErrors)}
                        alertMessage="A duração do contrato deve ter entre 1 dia e 2 anos."
                        error={errors.durationDays}
                        maxLength={3}
                    />

                    <Stack
                        gap="2em"
                    >
                        <Title
                            headingNumber={3}
                            text="Benefícios do Plano"
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
                                name="Adicionar Benefício"
                                handleClick={handleAddBenefit}
                            />
                        </Stack>
                    </Stack>

                    <TextArea
                        name="description"
                        placeholder="Insira a descrição do plano"
                        labelText="Descrição"
                        value={paymentPlan.description}
                        handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, isNoteValid, paymentPlan, setPaymentPlan, setPaymentPlanError, setErrors)}
                        alertMessage="A descrição não deve ter mais que 500 caracteres."
                        error={errors.description}
                        maxLength={500}
                    />
                </Stack>

                <SubmitFormButton
                    text={`${paymentPlan.ID ? "Modificar" : "Criar"} Plano de Pagamento`}
                />
            </Stack>
        </form>
    );
}

export default PaymentPlanForm;