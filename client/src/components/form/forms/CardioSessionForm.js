import { useCallback, useMemo, useState } from "react";
import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import TextArea from "../fields/TextArea";
import { isCardioDurationValid, isNoteValid } from "../../../utils/validators/trainingValidator";
import { formattNameAndNote, formattSecondsMinutesAndReps } from "../../../utils/formatters/training/formatOnChange";
import TextInput from "../fields/TextInput";
import Select from "../fields/Select";
import Alert from "../../messages/Alert";

function CardioSessionForm({ cardioSession, setCardioSession, setCardioSessionError, handleSubmit, cardioOptions, cardioIntensities }) {
    const arrays = useMemo(() => ({
        "cardioIntensities": cardioIntensities,
        "cardioOptions": cardioOptions
    }), [cardioIntensities, cardioOptions]);
    
    const [errors, setErrors] = useState({
        durationMinutes: false,
        note: false
    });

    const handleOnChangeCardioData = useCallback((e, formattFunction, dataValidator) => {
        setCardioSessionError(false);
        
        const name = e.target.name;

        const value = 
            formattFunction ?
            formattFunction(e.target.value) :
            e.target.value;
        
        const newCardio = {
            ...cardioSession, 
            [name]: value
        };

        setCardioSession(newCardio);

        if (dataValidator) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: value !== "" && !dataValidator(value)
            }));
        }
    }, [setCardioSession, setCardioSessionError, cardioSession]);

    const handleOnChangeCardioFKs = useCallback((e, arrayName, valueFieldName) => {
        setCardioSessionError(false);
        
        const name = e.target.name;

        const value = e.target.value;

        const FK = arrays[arrayName].find(item => item[valueFieldName] === value).ID;

        const newCardio = {
            ...cardioSession, 
            [name]: FK
        };

        setCardioSession(newCardio);
    }, [setCardioSessionError, arrays, cardioSession, setCardioSession]);

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
                    <TextInput
                        name="durationMinutes"
                        placeholder="Insira a duração do cardio"
                        labelText="Duração em Minutos"
                        value={cardioSession.durationMinutes}
                        handleChange={(e) => handleOnChangeCardioData(e, formattSecondsMinutesAndReps, isCardioDurationValid)}
                        alertMessage="A duração deve ter entre 10 e 600 minutos."
                        error={errors.durationMinutes}
                        maxLength={3}
                    />

                    <TextInput
                        type="time"
                        name="sessionTime"
                        placeholder="Insira o horário do cardio"
                        labelText="Horário"
                        value={cardioSession.sessionTime}
                        handleChange={(e) => handleOnChangeCardioData(e)}
                    />

                    <TextArea
                        name="note"
                        placeholder="Insira sua nota ou observação"
                        labelText="Nota"
                        value={cardioSession.note}
                        handleChange={(e) => handleOnChangeCardioData(e, formattNameAndNote, isNoteValid)}
                        alertMessage="A nota não deve ter mais que 500 caracteres."
                        error={errors.note}
                        maxLength={500}
                    />

                    <Stack
                        direction="row"
                    >
                        <Select
                            name="cardioOptionID"
                            placeholder="Selecione o tipo"
                            labelText="Tipo do Cardio"
                            value={cardioOptions.find(option => String(option.ID) === String(cardioSession.cardioOptionID))?.name}
                            handleChange={(e) => handleOnChangeCardioFKs(e, "cardioOptions", "name")}
                            options={cardioOptions.map(option => option.name)}
                        />

                        {cardioSession.cardioOptionID &&
                            <img
                                src={`/${
                                    cardioOptions.find(option => 
                                        String(option.ID) === String(cardioSession.cardioOptionID)
                                    )?.media.url
                                }`}
                                alt="Cardio Icon"
                            />
                        }
                    </Stack>

                    <Stack
                        direction="row"
                    >
                        <Select
                            name="cardioIntensityID"
                            placeholder="Selecione a intensidade"
                            labelText="Intensidade do Cardio"
                            value={cardioIntensities.find(intensity => String(intensity.ID) === String(cardioSession.cardioIntensityID))?.type}
                            handleChange={(e) => handleOnChangeCardioFKs(e, "cardioIntensities", "type")}
                            options={cardioIntensities.map(intensity => intensity.type)}
                        />

                        {cardioSession.cardioIntensityID &&
                            <Alert
                                alertMessage={`
                                    Opção selecionada: 
                                    ${cardioIntensities.find(intensity => 
                                        String(intensity.ID) === String(cardioSession.cardioIntensityID))?.description
                                    }
                                `}
                            />
                        } 
                    </Stack>
                </Stack>

                <SubmitFormButton
                    text="Criar ou Modificar Cardio"
                />
            </Stack>
        </form>
    );
}

export default CardioSessionForm;