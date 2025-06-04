import { useCallback, useMemo, useState } from "react";
import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import { formattSecondsMinutesAndReps } from "../../../utils/formatters/training/formatOnChange";
import { isDurationSetValid, isRepsValid, isRestValid } from "../../../utils/validators/trainingValidator";
import Select from "../fields/Select";
import Alert from "../../messages/Alert";
import TextInput from "../fields/TextInput";

function TrainingSetForm({ set, setSet, setSetError, handleSubmit, setTypes, trainingTechniques }) {
    const arrays = useMemo(() => ({
        "setTypes": setTypes,
        "trainingTechniques": trainingTechniques
    }), [setTypes, trainingTechniques]);
    
    const [errors, setErrors] = useState({
        minReps: false,
        maxReps: false,
        durationSeconds: false,
        restSeconds: false
    });
    
    const handleOnChangeSetData = useCallback((e, formattFunction, dataValidator) => {
        setSetError(false);
        
        const name = e.target.name;

        const value = formattFunction(e.target.value);
        
        const newSet = {
            ...set, 
            [name]: value
        };

        setSet(newSet);

        const isReps = name === "minReps" || name === "maxReps";

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: value !== "" && !dataValidator(!isReps && value)
        }));
    }, [setSetError, set, setSet]);

    const handleOnChangeSetFKs = useCallback((e, arrayName, valueFieldName) => {
        setSetError(false);
        
        const name = e.target.name;

        const value = e.target.value;

        const FK = arrays[arrayName].find(item => item[valueFieldName] === value).ID;

        const newSet = {
            ...set, 
            [name]: FK
        };

        setSet(newSet);
    }, [setSetError, arrays, set, setSet]);

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
                    <span>
                        Série {set.orderInExercise}
                    </span>

                    <Stack>
                        <p>
                            - Os campos obrigatórios são marcados com "*".
                        </p>

                        <Stack
                            direction="row"
                        >
                            <Stack
                                direction="row"
                            >
                                <Select
                                    name="setTypeID"
                                    placeholder="Selecione o tipo da série"
                                    labelText="Tipo da Série *"
                                    value={setTypes.find(type => String(type.ID) === String(set.setTypeID))?.name}
                                    handleChange={(e) => handleOnChangeSetFKs(e, "setTypes", "name")}
                                    options={setTypes.map(type => type.name)}    
                                />

                                {set.setTypeID &&
                                    <Stack>
                                        <Alert
                                            alertMessage={`
                                                Opção selecionada: 
                                                ${setTypes.find(type => 
                                                    String(type.ID) === String(set.setTypeID))?.description
                                                }
                                            `}
                                        />

                                        <span>
                                            {`
                                                Dificuldade: ${setTypes.find(type => 
                                                    String(type.ID) === String(set.setTypeID))?.intensityLevel
                                                }
                                            `}
                                        </span>
                                    </Stack>
                                }
                            </Stack>

                            <Stack
                                direction="row"
                            >
                                <Select
                                    name="trainingTechniqueID"
                                    placeholder="Selecione a técnica"
                                    labelText="Técnica de Treinamento"
                                    value={trainingTechniques.find(technique => String(technique.ID) === String(set.trainingTechniqueID))?.name}
                                    handleChange={(e) => handleOnChangeSetFKs(e, "trainingTechniques", "name")}
                                    options={trainingTechniques.map(technique => technique.name)}    
                                />

                                {set.trainingTechniqueID &&
                                    <Alert
                                        alertMessage={`
                                            Opção selecionada: 
                                            ${trainingTechniques.find(technique => 
                                                String(technique.ID) === String(set.trainingTechniqueID))?.description
                                            }
                                        `}
                                    />
                                }
                            </Stack>
                        </Stack>     

                        <Stack>
                            <p>
                                - Preencha ou os campos de repetições ou o de tempo de isometria *
                            </p>

                            <TextInput
                                name="minReps"
                                placeholder="Mínimo de repetições"
                                labelText="Número Mínimo de Repetições"
                                value={set.minReps}
                                handleChange={(e) => 
                                    handleOnChangeSetData(e, formattSecondsMinutesAndReps, () => isRepsValid(set.minReps, set.maxReps))
                                }
                                alertMessage="O número mínimo de repetições deve ser menor que o máximo e estar entre 1 e 100."
                                error={errors.minReps}
                                maxLength={3}
                            />

                            <TextInput
                                name="maxReps"
                                placeholder="Máximo de repetições"
                                labelText="Número Máximo de Repetições"
                                value={set.maxReps}
                                handleChange={(e) => 
                                    handleOnChangeSetData(e, formattSecondsMinutesAndReps, () => isRepsValid(set.minReps, set.maxReps))
                                }
                                alertMessage="O número máximo de repetições deve ser maior que o mínimo e estar entre 1 e 100."
                                error={errors.maxReps}
                                maxLength={3}
                            />

                            <TextInput
                                name="durationSeconds"
                                placeholder="Insira a duração da isometria"
                                labelText="Duração da Isometria em Segundos"
                                value={set.durationSeconds}
                                handleChange={(e) => handleOnChangeSetData(e, formattSecondsMinutesAndReps, isDurationSetValid)}
                                alertMessage="O tempo de isometria deve ter entre 5 e 600 segundos."
                                error={errors.durationSeconds}
                                maxLength={3}
                            />

                            <TextInput
                                name="restSeconds"
                                placeholder="Insira a duração do descanso"
                                labelText="Duração do Descanso em Segundos *"
                                value={set.restSeconds}
                                handleChange={(e) => handleOnChangeSetData(e, formattSecondsMinutesAndReps, isRestValid)}
                                alertMessage="O tempo de descanso deve ter entre 15 e 600 segundos."
                                error={errors.restSeconds}
                                maxLength={3}
                            />
                        </Stack>                   
                    </Stack>
                </Stack>

                <SubmitFormButton
                    text="Criar ou Modificar Série"
                />
            </Stack>
        </form>
    );
}

export default TrainingSetForm;