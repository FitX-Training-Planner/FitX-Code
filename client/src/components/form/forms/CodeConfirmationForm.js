import { useCallback, useRef } from "react";
import Stack from "../../containers/Stack";
import CodeInput from "../fields/CodeInput";
import SubmitFormButton from "../buttons/SubmitFormButton";
import styles from "./CodeConfirmationForm.module.css";
import removeAccents from "../../../utils/formatters/text/removeAccents";
import removeSymbols from "../../../utils/formatters/text/removeSymbols";
import removeSpaces from "../../../utils/formatters/text/removeSpaces";

function CodeConfirmationForm({ codes, setCodes, email, contact, handleSubmit }) {
    const inputRefs = useRef({
        email: [],
        contact: []
    });

    const handleOnKeyDownCode = useCallback((e, codeType, order) => {
        if (e.key === "Backspace") {
            const targetOrder = e.target.value ? order : order - 1;

            setCodes(prevCodes => ({
                ...prevCodes,
                [codeType]: prevCodes[codeType].map(codeUnit =>
                    codeUnit.order === targetOrder
                        ? { ...codeUnit, value: "" } 
                        : codeUnit
                )
            }));  

            if (order > 1) {
            setTimeout(() => {
                inputRefs.current[codeType][order - 1].focus();
            }, 0);
        }
        }
    }, [setCodes]);

    const handleOnFocusCode = useCallback((codeType) => {
        const firstEmptyIndex = codes[codeType].findIndex(code => !code.value);
        const focusIndex =
            firstEmptyIndex === -1
                ? codes[codeType].length
                : firstEmptyIndex + 1;

        inputRefs.current[codeType][focusIndex].focus();
    }, [codes]);

    const handleOnChangeCode = useCallback((e, codeType, order) => {
        const value = e.target.value
            .slice(-1)
            .toUpperCase();

        const formattedValue = removeAccents(removeSymbols(removeSpaces(value)));

        setCodes(prevCodes => ({
            ...prevCodes, 
            [codeType]: prevCodes[codeType].map(codeUnit => 
                codeUnit.order === order
                    ? {...codeUnit, value: formattedValue} 
                    : codeUnit  
            )
        }));

        if (formattedValue && order < codes[codeType].length) {
            setTimeout(() => {
                inputRefs.current[codeType][order + 1]?.focus();
            }, 0);
        }
    }, [codes, setCodes]);

    return (
        <form
            onSubmit={handleSubmit}
        >
            <Stack
                gap="2em"
                className={styles.code_confirmation_form_container}
            >
                <p>
                    Preencha as caixas abaixo com
                    {email && contact ? " os códigos " : " o código "}
                    que enviamos a você.
                </p>
                
                <Stack
                    gap="2em"
                >
                    {email && 
                        <Stack>
                            <p>
                                Código enviado para

                                <span
                                    className={styles.user_info}
                                >
                                    {` ${email}:`}
                                </span>
                            </p>

                            <Stack
                                direction="row"
                                className={styles.code}
                            >
                                {codes.email.map(codeUnit => 
                                    <CodeInput
                                        key={codeUnit.order}
                                        name={`emailCode${codeUnit.order}`}
                                        value={codeUnit.value}
                                        handleChange={(e) => handleOnChangeCode(e, "email", codeUnit.order)}
                                        handleFocus={() => handleOnFocusCode("email", codeUnit.order)}
                                        handleKeyDown={(e) => handleOnKeyDownCode(e, "email", codeUnit.order)}
                                        ref={(el) => inputRefs.current.email[codeUnit.order] = el}
                                    />
                                )}
                            </Stack>
                        </Stack>
                    }

                    {contact &&
                        <Stack>
                            <p>
                                Código enviado para

                                <span
                                    className={styles.user_info}
                                >
                                    {` ${contact}:`}
                                </span>
                            </p>

                            <Stack
                                direction="row"
                                className={styles.code}
                            >
                                {codes.contact.map(codeUnit => 
                                    <CodeInput
                                        key={codeUnit.order}
                                        name={`contactCode${codeUnit.order}`}
                                        value={codeUnit.value}
                                        handleChange={(e) => handleOnChangeCode(e, "contact", codeUnit.order)}
                                        handleFocus={() => handleOnFocusCode("contact", codeUnit.order)}
                                        handleKeyDown={(e) => handleOnKeyDownCode(e, "contact", codeUnit.order)}
                                        ref={(el) => inputRefs.current.contact[codeUnit.order] = el}
                                  />
                                )}
                            </Stack>
                        </Stack>
                    }
                </Stack>

                <SubmitFormButton
                    text="Confirmar"
                />
            </Stack>
        </form>
    );
}

export default CodeConfirmationForm;