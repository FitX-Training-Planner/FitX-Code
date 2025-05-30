import styles from "./LoginForm.module.css";
import { useCallback, useState } from "react";
import { formattCref, formattTrainerDescription } from "../../../utils/formatters/user/formattOnChange";
import { isCREFValid, isTrainerDescriptionValid } from "../../../utils/validators/userValidator";
import Stack from "../../containers/Stack";
import TextInput from "../fields/TextInput";
import SubmitFormButton from "../buttons/SubmitFormButton";
import Title from "../../text/Title";
import TextArea from "../fields/TextArea";
import Select from "../fields/Select";

function TrainerForm({ trainer, setTrainer, setTrainerError, handleSubmit }) {
    const [errors, setErrors] = useState({
        cref_number: false,
        description: false
    });

    const UFs = [
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
    ];

    const handleOnChangeTrainerData = useCallback((e, formattFunction, dataValidator) => {
        setTrainerError(false);

        const name = e.target.name;
        const value = 
            formattFunction 
            ? formattFunction(e.target.value) 
            : e.target.value;

        const newTrainer = {
            ...trainer, 
            [name]: value
        };

        setTrainer(newTrainer);

        if (dataValidator) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: value !== "" && !dataValidator(value)
            }));
        }
    }, [setTrainerError, setTrainer, trainer]);
    
    return (
        <>
            <Stack
                gap="0"
                className={styles.title_container}
            >
                <img 
                    src="logo180.png" 
                    alt="FitX Icon"
                />

                <Title
                    headingNumber={1}
                    text="Registro Profissional"
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
                        <Stack
                        >
                            <TextInput
                                name="cref_number"
                                placeholder="000000-L"
                                labelText="CREF"
                                value={trainer.cref_number}
                                handleChange={(e) => handleOnChangeTrainerData(e, formattCref, isCREFValid)}
                                // icon={}
                                alertMessage="Número do CREF inválido."
                                error={errors.cref_number}
                                maxLength={8}
                            />

                            <Select
                                name="crefUF"
                                placeholder="Selecione a UF"
                                labelText="Unidade Federtiva do CREF"
                                value={trainer.cref_UF}
                                handleChange={(e) => handleOnChangeTrainerData(e)}
                                // icon={}
                                options={UFs}
                            />
                        </Stack>

                        <TextArea
                            name="description"
                            placeholder="Insira sua descrição profissional"
                            labelText="Descrição Profissional"
                            value={trainer.description}
                            handleChange={(e) => handleOnChangeTrainerData(e, formattTrainerDescription, isTrainerDescriptionValid)}
                            // icon={}
                            alertMessage="A descrição profissional não deve ter mais que 1200 caracteres ou 15 quebras de linha."
                            error={errors.description}
                            maxLength={1200}
                        />
                    </Stack>

                    <SubmitFormButton
                        text="Criar Conta"
                    />
                </Stack>
            </form>
        </>
    );
}

export default TrainerForm;