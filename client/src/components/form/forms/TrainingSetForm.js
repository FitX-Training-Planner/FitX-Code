import { useMemo, useState } from "react";
import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import { formattSecondsMinutesAndReps } from "../../../utils/formatters/training/formatOnChange";
import { isDurationSetValid, isRepsValid, isRestValid } from "../../../utils/validators/trainingValidator";
import Select from "../fields/Select";
import TextInput from "../fields/TextInput";
import { handleOnChangeSelect, handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import { useTranslation } from "react-i18next";

function TrainingSetForm({
    set,
    setSet,
    setSetError,
    handleSubmit,
    setTypes,
    trainingTechniques
}) {
    const { t } = useTranslation();

    const arrays = useMemo(() => ({
        "setTypes": setTypes,
        "trainingTechniques": trainingTechniques
    }), [setTypes, trainingTechniques]);
    
    const [errors, setErrors] = useState({
        reps: false,
        durationSeconds: false,
        restSeconds: false
    });

    return (
        <form
            onSubmit={handleSubmit}
        >
            <Stack
                gap="3em"
            >
                <Stack>
                    <p>
                        - {t("mandatoryFields")}
                    </p>

                    <p>
                        - {t("repsOrIsometry")} *
                    </p>
                </Stack>

                <Stack
                    gap="2em"
                > 
                    <TextInput
                        name="minReps"
                        placeholder={t("minRepsPlaceholder")}
                        labelText={t("minReps")}
                        value={set.minReps}
                        handleChange={(e) => handleOnChangeTextField(e, formattSecondsMinutesAndReps, () => isRepsValid(e.target.value, set.maxReps), set, setSet, setSetError, setErrors, "reps", false)}
                        alertMessage={t("alertMinReps")}
                        error={errors.reps}
                        maxLength={3}
                    />

                    <TextInput
                        name="maxReps"
                        placeholder={t("maxRepsPlaceholder")}
                        labelText={t("maxReps")}
                        value={set.maxReps}
                        handleChange={(e) => handleOnChangeTextField(e, formattSecondsMinutesAndReps, () => isRepsValid(set.minReps, e.target.value), set, setSet, setSetError, setErrors, "reps", false)}
                        alertMessage={t("alertMaxReps")}
                        error={errors.reps}
                        maxLength={3}
                    />

                    <TextInput
                        name="durationSeconds"
                        placeholder={t("durationSecondsPlaceholder")}
                        labelText={t("durationSeconds")}
                        value={set.durationSeconds}
                        handleChange={(e) => handleOnChangeTextField(e, formattSecondsMinutesAndReps, isDurationSetValid, set, setSet, setSetError, setErrors)}
                        alertMessage={t("alertDurationSeconds")}
                        error={errors.durationSeconds}
                        maxLength={3}
                    />
                    
                    <TextInput
                        name="restSeconds"
                        placeholder={t("restSecondsPlaceholder")}
                        labelText={`${t("restSeconds")} *`}
                        value={set.restSeconds}
                        handleChange={(e) => handleOnChangeTextField(e, formattSecondsMinutesAndReps, isRestValid, set, setSet, setSetError, setErrors)}
                        alertMessage={t("alertRestSeconds")}
                        error={errors.restSeconds}
                        maxLength={3}
                    />

                    <Select
                        name="setType"
                        placeholder={t("setTypePlaceholder")}
                        labelText={`${t("setType")} *`}
                        value={setTypes.find(type => String(type.ID) === String(set.setType?.ID))?.name}
                        handleChange={(e) => handleOnChangeSelect(e, arrays.setTypes, "name", set, setSet, setSetError)}
                        options={setTypes.map(type => type.name)}    
                    />

                    <Select
                        name="trainingTechnique"
                        placeholder={t("trainingTechniquePlaceholder")}
                        labelText={t("trainingTechnique")}
                        value={trainingTechniques.find(technique => String(technique.ID) === String(set.trainingTechnique?.ID))?.name}
                        handleChange={(e) => handleOnChangeSelect(e, arrays.trainingTechniques, "name", set, setSet, setSetError)}
                        options={trainingTechniques.map(technique => technique.name)}    
                    />
                </Stack>                   

                <SubmitFormButton
                    text={t("createSet")}
                />
            </Stack>
        </form>
    );
}

export default TrainingSetForm;