import { useMemo, useState } from "react";
import { formattCref, formattTrainerDescription, formattTrainerMaxActiveContracts } from "../../../utils/formatters/user/formatOnChange";
import { isCREFValid, isMaxActiveContractsValid, isTrainerDescriptionValid } from "../../../utils/validators/userValidator";
import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import { handleOnChangeSelect, handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import { useTranslation } from "react-i18next";
import TextArea from "../fields/TextArea";
import TextInput from "../fields/TextInput";
import Select from "../fields/Select";
import Title from "../../text/Title";
import Alert from "../../messages/Alert";

function ModifyTrainerForm({
    changedTrainer,
    setChangedTrainer,
    setModifyTrainerError,
    handleSubmit, 
    hasChanged
}) {
    const [errors, setErrors] = useState({
        description: false,
        crefNumber: false,
        maxActiveContracts: false
    });

    const { t } = useTranslation();
    
    const UFs = useMemo(() => [
        "AC",
        "AL",
        "AP",
        "AM",
        "BA",
        "CE",
        "DF",
        "ES",
        "GO",
        "MA",
        "MT",
        "MS",
        "MG",
        "PA",
        "PB",
        "PR",
        "PE",
        "PI",
        "RJ",
        "RN",
        "RS",
        "RO",
        "RR",
        "SC",
        "SP",
        "SE",
        "TO"
    ], []);
    
    return (
        <form 
            onSubmit={handleSubmit}
        >
            <Stack
                gap="3em"
            >                
                <Stack
                    gap="2em"
                >
                    {changedTrainer.crefNumber ? (
                        <TextInput
                            labelText={t("cref")}
                            name="crefNumber"
                            value={changedTrainer.crefNumber}
                            icon="/images/icons/trainer.png"
                        />
                    ) : (
                        <Stack>
                            <Stack
                                direction="row"
                                justifyContent="start"
                            >
                                <Alert
                                    varColor="--text-color"
                                    alertMessage={t("crefDescription")}
                                />

                                <Title
                                    headingNumber={2}
                                    text={t("addCref")}
                                />
                            </Stack>

                            <TextInput
                                name="newCrefNumber"
                                placeholder={t("crefPlaceholder")}
                                labelText={t("cref")}
                                value={changedTrainer.newCrefNumber}
                                handleChange={(e) => handleOnChangeTextField(e, formattCref, isCREFValid, changedTrainer, setChangedTrainer, setModifyTrainerError, setErrors)}
                                icon="/images/icons/trainer.png"
                                alertMessage={t("alertCref")}
                                error={errors.crefNumber}
                                maxLength={8}
                            />

                            <Select
                                name="newCrefUF"
                                placeholder={t("crefUfPlaceholder")}
                                labelText={t("crefUf")}
                                value={changedTrainer.newCrefUF}
                                handleChange={(e) => handleOnChangeSelect(e, UFs, undefined, changedTrainer, setChangedTrainer, setModifyTrainerError)}
                                icon="/images/icons/location.png"
                                options={UFs}
                            />
                        </Stack>
                    )}

                    <TextArea
                        name="description"
                        placeholder={t("trainerDescriptionPlaceholder")}
                        labelText={t("trainerDescription")}
                        value={changedTrainer.description}
                        handleChange={(e) => handleOnChangeTextField(e, formattTrainerDescription, isTrainerDescriptionValid, changedTrainer, setChangedTrainer, setModifyTrainerError, setErrors)}
                        icon="/images/icons/description.png"
                        alertMessage={t("alertTrainerDescription")}
                        error={errors.description}
                        maxLength={1200}
                    />

                    <TextInput
                        name="maxActiveContracts"
                        placeholder={t("maxActiveContractsPlaceholder")}
                        labelText={t("maxActiveContracts")}
                        value={changedTrainer.maxActiveContracts}
                        handleChange={(e) => handleOnChangeTextField(e, formattTrainerMaxActiveContracts, isMaxActiveContractsValid, changedTrainer, setChangedTrainer, setModifyTrainerError, setErrors)}
                        alertMessage={t("alertMaxActiveContracts")}
                        error={errors.maxActiveContracts}
                        maxLength={2}
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

export default ModifyTrainerForm;