import { useMemo, useState } from "react";
import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import TextArea from "../fields/TextArea";
import { isCardioDurationValid, isNoteValid } from "../../../utils/validators/trainingValidator";
import { formattNameAndNote, formattSecondsMinutesAndReps } from "../../../utils/formatters/training/formatOnChange";
import TextInput from "../fields/TextInput";
import Select from "../fields/Select";
import { handleOnChangeSelect, handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";

function CardioSessionForm({ cardioSession, setCardioSession, setCardioSessionError, handleSubmit, cardioOptions, cardioIntensities }) {
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
                    - Os campos obrigatórios são marcados com "*".
                </p>

                <Stack
                    gap="2em"
                >
                    <TextInput
                        name="durationMinutes"
                        placeholder="Insira a duração do cardio"
                        labelText="Duração em Minutos *"
                        value={cardioSession.durationMinutes}
                        handleChange={(e) => handleOnChangeTextField(e, formattSecondsMinutesAndReps, isCardioDurationValid, cardioSession, setCardioSession, setCardioSessionError, setErrors)}
                        alertMessage="A duração deve ter entre 10 e 600 minutos."
                        error={errors.durationMinutes}
                        maxLength={3}
                    />

                    <Select
                        name="cardioOption"
                        placeholder="Selecione o tipo"
                        labelText="Tipo do Cardio *"
                        value={cardioOptions.find(option => String(option.ID) === String(cardioSession.cardioOption?.ID))?.name}
                        handleChange={(e) => handleOnChangeSelect(e, arrays.cardioOptions, "name", cardioSession, setCardioSession, setCardioSessionError)}
                        options={cardioOptions.map(option => option.name)}
                    />

                    <Select
                        name="cardioIntensity"
                        placeholder="Selecione a intensidade"
                        labelText="Intensidade do Cardio *"
                        value={cardioIntensities.find(intensity => String(intensity.ID) === String(cardioSession.cardioIntensity?.ID))?.type}
                        handleChange={(e) => handleOnChangeSelect(e, arrays.cardioIntensities, "type", cardioSession, setCardioSession, setCardioSessionError)}
                        options={cardioIntensities.map(intensity => intensity.type)}
                    />

                    <TextInput
                        type="time"
                        name="sessionTime"
                        placeholder="Insira o horário do cardio"
                        labelText="Horário"
                        value={cardioSession.sessionTime}
                        handleChange={(e) => handleOnChangeTextField(e, undefined, undefined, cardioSession, setCardioSession, setCardioSessionError, setErrors)}
                    />

                    <TextArea
                        name="note"
                        placeholder="Insira sua nota ou observação"
                        labelText="Nota"
                        value={cardioSession.note}
                        handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, isNoteValid, cardioSession, setCardioSession, setCardioSessionError, setErrors)}
                        alertMessage="A nota não deve ter mais que 500 caracteres."
                        error={errors.note}
                        maxLength={500}
                    />
                </Stack>

                <SubmitFormButton
                    text="Criar ou Modificar Cardio"
                />
            </Stack>
        </form>
    );
}

export default CardioSessionForm;