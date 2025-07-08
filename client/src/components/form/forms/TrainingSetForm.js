import { useMemo, useState } from "react";
import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import { formattSecondsMinutesAndReps } from "../../../utils/formatters/training/formatOnChange";
import { isDurationSetValid, isRepsValid, isRestValid } from "../../../utils/validators/trainingValidator";
import Select from "../fields/Select";
import TextInput from "../fields/TextInput";
import { handleOnChangeSelect, handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";

function TrainingSetForm({ set, setSet, setSetError, handleSubmit, setTypes, trainingTechniques }) {
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
                        - Os campos obrigatórios são marcados com "*".
                    </p>

                    <p>
                        - Preencha ou os campos de repetições ou o de tempo de isometria. *
                    </p>
                </Stack>

                <Stack
                    gap="2em"
                > 
                    <TextInput
                        name="minReps"
                        placeholder="Mínimo de repetições"
                        labelText="Número Mínimo de Repetições"
                        value={set.minReps}
                        handleChange={(e) => handleOnChangeTextField(e, formattSecondsMinutesAndReps, () => isRepsValid(e.target.value, set.maxReps), set, setSet, setSetError, setErrors, "reps", false)}
                        alertMessage="O número mínimo de repetições deve ser menor que o máximo e estar entre 1 e 100."
                        error={errors.reps}
                        maxLength={3}
                    />

                    <TextInput
                        name="maxReps"
                        placeholder="Máximo de repetições"
                        labelText="Número Máximo de Repetições"
                        value={set.maxReps}
                        handleChange={(e) => handleOnChangeTextField(e, formattSecondsMinutesAndReps, () => isRepsValid(set.minReps, e.target.value), set, setSet, setSetError, setErrors, "reps", false)}
                        alertMessage="O número máximo de repetições deve ser maior que o mínimo e estar entre 1 e 100."
                        error={errors.reps}
                        maxLength={3}
                    />

                    <TextInput
                        name="durationSeconds"
                        placeholder="Insira a duração da isometria"
                        labelText="Duração da Isometria em Segundos"
                        value={set.durationSeconds}
                        handleChange={(e) => handleOnChangeTextField(e, formattSecondsMinutesAndReps, isDurationSetValid, set, setSet, setSetError, setErrors)}
                        alertMessage="O tempo de isometria deve ter entre 5 e 600 segundos."
                        error={errors.durationSeconds}
                        maxLength={3}
                    />
                    
                    <TextInput
                        name="restSeconds"
                        placeholder="Insira a duração do descanso"
                        labelText="Descanso para a Série em Segundos *"
                        value={set.restSeconds}
                        handleChange={(e) => handleOnChangeTextField(e, formattSecondsMinutesAndReps, isRestValid, set, setSet, setSetError, setErrors)}
                        alertMessage="O tempo de descanso deve ter entre 15 e 600 segundos."
                        error={errors.restSeconds}
                        maxLength={3}
                    />

                    <Select
                        name="setType"
                        placeholder="Selecione o tipo da série"
                        labelText="Tipo da Série *"
                        value={setTypes.find(type => String(type.ID) === String(set.setType?.ID))?.name}
                        handleChange={(e) => handleOnChangeSelect(e, arrays.setTypes, "name", set, setSet, setSetError)}
                        options={setTypes.map(type => type.name)}    
                    />

                    <Select
                        name="trainingTechnique"
                        placeholder="Selecione a técnica"
                        labelText="Técnica de Treinamento"
                        value={trainingTechniques.find(technique => String(technique.ID) === String(set.trainingTechnique?.ID))?.name}
                        handleChange={(e) => handleOnChangeSelect(e, arrays.trainingTechniques, "name", set, setSet, setSetError)}
                        options={trainingTechniques.map(technique => technique.name)}    
                    />
                </Stack>                   

                <SubmitFormButton
                    text="Criar ou Modificar Série"
                />
            </Stack>
        </form>
    );
}

export default TrainingSetForm;