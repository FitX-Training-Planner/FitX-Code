import { useState } from "react";
import MessageInput from "../fields/MessageInput";
import Stack from "../../containers/Stack";
import { handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import ClickableIcon from "../buttons/ClickableIcon";
import { formattNameAndNote } from "../../../utils/formatters/training/formatOnChange";
import { isPaymentPlanBenefitDescriptionValid } from "../../../utils/validators/paymentsValidator";
import { useTranslation } from "react-i18next";


function PaymentPlanBenefitInput({
    benefit,
    setBenefit,
    handleRemoveBenefit,
    setPaymentPlanError
}) {
    const { t } = useTranslation();

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
                    placeholder={t("benefitDescriptionPlaceholder")}
                    alertMessage={t("alertBenefitDescription")}
                    error={errors.description}
                />
            </Stack>

            <ClickableIcon
                iconSrc="/images/icons/remove.png"
                name={t("remove")}
                handleClick={() => handleRemoveBenefit(benefit.ID)}
                size="small"
            />
        </Stack>
    );
}

export default PaymentPlanBenefitInput;