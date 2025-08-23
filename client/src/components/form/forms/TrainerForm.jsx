import styles from "./LoginForm.module.css";
import { useMemo, useState } from "react";
import { formattCref, formattTrainerDescription } from "../../../utils/formatters/user/formatOnChange";
import { isCREFValid, isTrainerDescriptionValid } from "../../../utils/validators/userValidator";
import Stack from "../../containers/Stack";
import TextInput from "../fields/TextInput";
import SubmitFormButton from "../buttons/SubmitFormButton";
import Title from "../../text/Title";
import TextArea from "../fields/TextArea";
import Select from "../fields/Select";
import { handleOnChangeSelect, handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import Alert from "../../messages/Alert";
import { useTranslation } from "react-i18next";
import AcceptTerms from "../fields/AcceptTerms";

function TrainerForm({
    trainer,
    setTrainer,
    setTrainerError,
    handleSubmit,
    acceptTerms,
    setAcceptedTerms
}) {
    const { t } = useTranslation();
    
    const [errors, setErrors] = useState({
        cref_number: false,
        description: false
    });

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
        <>
            <Stack
                gap="0"
                className={styles.title_container}
            >
                <img 
                    src="/logo180.png" 
                    alt=""
                />

                <Title
                    headingNumber={1}
                    text={t("trainerProfile")}
                />
            </Stack>
            
            <form 
                onSubmit={handleSubmit}
            >
                <Stack
                    gap="3em"
                >
                    <Stack
                        gap="2em"
                    >
                        <Stack>
                            <Alert
                                varColor="--text-color"
                                alertMessage={t("crefDescription")}
                            />

                            <TextInput
                                name="cref_number"
                                placeholder={t("crefPlaceholder")}
                                labelText={t("cref")}
                                value={trainer.cref_number}
                                handleChange={(e) => handleOnChangeTextField(e, formattCref, isCREFValid, trainer, setTrainer, setTrainerError, setErrors)}
                                icon="/images/icons/trainer.png"
                                alertMessage={t("alertCref")}
                                error={errors.cref_number}
                                maxLength={8}
                            />

                            <Select
                                name="crefUF"
                                placeholder={t("crefUfPlaceholder")}
                                labelText={t("crefUf")}
                                value={trainer.crefUF}
                                handleChange={(e) => handleOnChangeSelect(e, UFs, undefined, trainer, setTrainer, setTrainerError)}
                                icon="/images/icons/location.png"
                                options={UFs}
                            />
                        </Stack>

                        <Stack
                            gap="0.5em"
                        >
                            <TextArea
                                name="description"
                                placeholder={t("trainerDescriptionPlaceholder")}
                                labelText={t("trainerDescription")}
                                value={trainer.description}
                                handleChange={(e) => handleOnChangeTextField(e, formattTrainerDescription, isTrainerDescriptionValid, trainer, setTrainer, setTrainerError, setErrors)}
                                icon="/images/icons/description.png"
                                alertMessage={t("alertTrainerDescription")}
                                error={errors.description}
                                maxLength={1200}
                            />

                            <AcceptTerms
                                isAccepted={acceptTerms}
                                setIsAccepted={setAcceptedTerms}
                                description={t("createTrainerTerms")}
                            />
                        </Stack>
                    </Stack>

                    <SubmitFormButton
                        text={t("signUp")}
                    />
                </Stack>
            </form>
        </>
    );
}

export default TrainerForm;