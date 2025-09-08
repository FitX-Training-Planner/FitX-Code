import { useMemo, useState } from "react";
import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import TextArea from "../fields/TextArea";
import { isCardioDurationValid, isNoteValid } from "../../../utils/validators/trainingValidator";
import { formattNameAndNote, formattSecondsMinutesAndReps } from "../../../utils/formatters/training/formatOnChange";
import TextInput from "../fields/TextInput";
import Select from "../fields/Select";
import { handleOnChangeSelect, handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import { useTranslation } from "react-i18next";
import useWindowSize from "../../../hooks/useWindowSize";

function CardioSessionForm({
    cardioSession,
    setCardioSession,
    setCardioSessionError,
    handleSubmit,
    cardioOptions,
    cardioIntensities
}) {
    const { t } = useTranslation();

    const { width } = useWindowSize();
    
    const arrays = useMemo(() => ({
        "cardioIntensities": cardioIntensities,
        "cardioOptions": cardioOptions
    }), [cardioIntensities, cardioOptions]);
    
    const [errors, setErrors] = useState({
        durationMinutes: false,
        note: false
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

                <Stack>
                    <TextInput
                        name="durationMinutes"
                        placeholder={t("cardioDurationMinutesPlaceholder")}
                        labelText={`${t("cardioDurationMinutes")} *`}
                        value={cardioSession.durationMinutes}
                        handleChange={(e) => handleOnChangeTextField(e, formattSecondsMinutesAndReps, isCardioDurationValid, cardioSession, setCardioSession, setCardioSessionError, setErrors)}
                        alertMessage={t("alertCardioDurationMinutes")}
                        error={errors.durationMinutes}
                        maxLength={3}
                    />

                    <Stack
                        direction={width <= 440 ? "column" : "row"}
                        alignItems="end"
                    >
                        <Select
                            name="cardioOption"
                            placeholder={t("cardioOptionPlaceholder")}
                            labelText={`${t("cardioOption")} *`}
                            value={cardioOptions.find(option => String(option.ID) === String(cardioSession.cardioOption?.ID))?.name}
                            handleChange={(e) => handleOnChangeSelect(e, arrays.cardioOptions, "name", cardioSession, setCardioSession, setCardioSessionError)}
                            options={cardioOptions.map(option => option.name)}
                        />

                        <Select
                            name="cardioIntensity"
                            placeholder={t("cardioIntensityPlaceholder")}
                            labelText={`${t("cardioIntensity")} *`}
                            value={cardioIntensities.find(intensity => String(intensity.ID) === String(cardioSession.cardioIntensity?.ID))?.type}
                            handleChange={(e) => handleOnChangeSelect(e, arrays.cardioIntensities, "type", cardioSession, setCardioSession, setCardioSessionError)}
                            options={cardioIntensities.map(intensity => intensity.type)}
                        />
                    </Stack>

                    <TextInput
                        type="time"
                        name="sessionTime"
                        placeholder={t("cardioTimePlaceholder")}
                        labelText={t("cardioTime")}
                        value={cardioSession.sessionTime}
                        handleChange={(e) => handleOnChangeTextField(e, undefined, undefined, cardioSession, setCardioSession, setCardioSessionError, setErrors)}
                    />

                    <TextArea
                        name="note"
                        placeholder={t("notePlaceholder")}
                        labelText={t("note")}
                        value={cardioSession.note}
                        handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, isNoteValid, cardioSession, setCardioSession, setCardioSessionError, setErrors)}
                        alertMessage={t("alertNote500")}
                        error={errors.note}
                        maxLength={500}
                    />
                </Stack>

                <SubmitFormButton
                    text={t("createCardioSession")}
                />
            </Stack>
        </form>
    );
}

export default CardioSessionForm;