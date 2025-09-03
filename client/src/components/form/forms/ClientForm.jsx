import styles from "./LoginForm.module.css";
import { useState } from "react";
import { isAvailableDaysValid, isBirthDateValid, isHeightValid, isTrainerDescriptionValid, isWeightValid } from "../../../utils/validators/userValidator";
import Stack from "../../containers/Stack";
import TextInput from "../fields/TextInput";
import SubmitFormButton from "../buttons/SubmitFormButton";
import Title from "../../text/Title";
import TextArea from "../fields/TextArea";
import { handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import Alert from "../../messages/Alert";
import { useTranslation } from "react-i18next";
import { formattNameAndNote } from "../../../utils/formatters/training/formatOnChange";
import { formattClientData } from "../../../utils/formatters/user/formatOnChange";
import SelectMuscles from "./SelectMuscles";
import useWindowSize from "../../../hooks/useWindowSize";
import SelectBoxes from "../fields/SelectBoxes";

function ClientForm({
    client,
    setClient,
    setClientError,
    sexes,
    setSexes,
    muscleGroups,
    setMuscleGroups,
    handleSubmit
}) {
    const { t } = useTranslation();

    const { width } = useWindowSize();
    
    const [errors, setErrors] = useState({
        birthDate: false,
        height: false,
        weight: false,
        availableDays: false,
        limitationsDescription: false
    });

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
                    text={t("clientProfile")}
                />
            </Stack>
            
            <form 
                onSubmit={handleSubmit}
            >
                <Stack
                    gap="4em"
                >
                    <Alert
                        varColor="--text-color"
                        alertMessage={t("clientDataDescription")}
                    />

                    <Stack>
                        <Stack>
                            <Stack
                                alignItems="start"
                            >
                                <TextInput
                                    type="date"
                                    name="birthDate"
                                    labelText={t("birthDate")}
                                    value={client.birthDate}
                                    handleChange={(e) => handleOnChangeTextField(e, undefined, isBirthDateValid, client, setClient, setClientError, setErrors)}
                                    icon="/images/icons/age.png"
                                    alertMessage={t("alertBirthDate")}
                                    error={errors.birthDate}
                                />

                                <TextInput
                                    name="height"
                                    placeholder={t("heightPlaceholder")}
                                    labelText={t("height")}
                                    value={client.height}
                                    handleChange={(e) => handleOnChangeTextField(e, formattClientData, isHeightValid, client, setClient, setClientError, setErrors)}
                                    icon="/images/icons/height.png"
                                    alertMessage={t("alertHeight")}
                                    error={errors.height}
                                    maxLength={3}
                                />
                                
                                <TextInput
                                    name="weight"
                                    placeholder={t("weightPlaceholder")}
                                    labelText={t("weight")}
                                    value={client.weight}
                                    handleChange={(e) => handleOnChangeTextField(e, formattClientData, isWeightValid, client, setClient, setClientError, setErrors)}
                                    icon="/images/icons/weight.png"
                                    alertMessage={t("alertWeight")}
                                    error={errors.weight}
                                    maxLength={3}
                                />

                                <TextInput
                                    name="availableDays"
                                    placeholder={t("availableDaysPlaceholder")}
                                    labelText={t("availableDays")}
                                    value={client.availableDays}
                                    handleChange={(e) => handleOnChangeTextField(e, formattClientData, isAvailableDaysValid, client, setClient, setClientError, setErrors)}
                                    icon="/images/icons/calendar.png"
                                    alertMessage={t("alertAvailableDays")}
                                    error={errors.availableDays}
                                    maxLength={1}
                                />

                                <SelectBoxes
                                    options={sexes.map(sex => ({ ...sex, name: t(sex.ID) }))}
                                    setOptions={setSexes}
                                    labelText={t("sex")}
                                    icon="/images/icons/sex.png"
                                />
                            </Stack>

                            <TextArea
                                name="limitationsDescription"
                                placeholder={t("limitationsDescriptionPlaceholder")}
                                labelText={t("limitationsDescription")}
                                value={client.limitationsDescription}
                                handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, isTrainerDescriptionValid, client, setClient, setClientError, setErrors)}
                                icon="/images/icons/limitations.png"
                                alertMessage={t("alertLimitationsDescription")}
                                error={errors.limitationsDescription}
                                maxLength={1200}
                            />
                        </Stack>

                        <Stack
                            gap="3em"
                        >
                            <Stack>
                                <Title
                                    headingNumber={2}
                                    text={t("weaknesses")}
                                />

                                <Alert
                                    alertMessage={t("weaknessesDescription")}
                                />
                            </Stack>
                            
                            <SelectMuscles
                                muscleGroups={muscleGroups}
                                isMale={!(sexes.find(sex => sex.isSelected)?.ID === "female")}
                                setMuscleGroups={setMuscleGroups}
                                figuresDirection={(width <= 840 && width > 640) || width <= 440 ? "column" : "row"}
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

export default ClientForm;