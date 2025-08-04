import { useState } from "react";
import { formattEmailAndPassword, formattName } from "../../../utils/formatters/user/formatOnChange";
import { isEmailValid, isNameValid } from "../../../utils/validators/userValidator";
import Stack from "../../containers/Stack";
import TextInput from "../fields/TextInput";
import SubmitFormButton from "../buttons/SubmitFormButton";
import { handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import { useTranslation } from "react-i18next";

function ModifyUserForm({
    changedUser,
    setChangedUser,
    setModifyUserError,
    handleSubmit, 
    hasChanged
}) {
    const [errors, setErrors] = useState({
        name: false,
        email: false
    });

    const { t } = useTranslation();
    
    return (
        <form 
            onSubmit={handleSubmit}
        >
            <Stack
                gap="3em"
            >
                <Stack
                    gap="0.5em"
                >
                   <TextInput
                        name="name"
                        placeholder={t("namePlaceholder")}
                        labelText={t("name")}
                        value={changedUser.name}
                        handleChange={(e) => handleOnChangeTextField(e, formattName, isNameValid, changedUser, setChangedUser, setModifyUserError, setErrors)}
                        icon="/images/icons/user2.png"
                        alertMessage={t("alertName")}
                        error={errors.name}
                        maxLength={100}
                    />

                    <TextInput
                        type="email"
                        name="email"
                        placeholder={t("emailPlaceholder")}
                        labelText={t("email")}
                        value={changedUser.email}
                        handleChange={(e) => handleOnChangeTextField(e, formattEmailAndPassword, isEmailValid, changedUser, setChangedUser, setModifyUserError, setErrors)}
                        icon="/images/icons/email.png"
                        alertMessage={t("alertEmail")}
                        error={errors.email}
                        maxLength={254}
                    />
                </Stack>

                {hasChanged && (
                    <SubmitFormButton
                        text={t("modify")}
                    />
                )}
            </Stack>
        </form>
    );
}

export default ModifyUserForm;