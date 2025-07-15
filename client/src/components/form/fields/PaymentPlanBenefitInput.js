import { useState } from "react";
import MessageInput from "../fields/MessageInput";
import Stack from "../../containers/Stack";
import { handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import ClickableIcon from "../buttons/ClickableIcon";
import { formattNameAndNote } from "../../../utils/formatters/training/formatOnChange";
import { isPaymentPlanBenefitDescriptionValid } from "../../../utils/validators/paymentsValidator";


function PaymentPlanBenefitInput({ benefit, setBenefit, handleRemoveBenefit, setPaymentPlanError }) {
    const [errors, setErrors] = useState({ 
        description: false 
    });

    return (
        <Stack
            direction="row"
            alignItems="start"
        >
            <Stack 
                direction="row"
                alignItems="start"
            >
                <span>
                    -
                </span>
                
                <MessageInput
                    name="description"
                    value={benefit.description}
                    handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, isPaymentPlanBenefitDescriptionValid, benefit, setBenefit, setPaymentPlanError, setErrors)}
                    maxLength={300}
                    placeholder="Insira a descrição do benefício"
                    alertMessage="A descrição do benefício deve ter entre 5 e 300 caracteres."
                    error={errors.description}
                />
            </Stack>

            <ClickableIcon
                iconSrc="/images/icons/remove.png"
                name="Remover"
                handleClick={() => handleRemoveBenefit(benefit.ID)}
                size="small"
            />
        </Stack>
    );
}

export default PaymentPlanBenefitInput;