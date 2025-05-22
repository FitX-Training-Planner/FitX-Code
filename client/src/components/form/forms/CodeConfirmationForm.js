import { useCallback, useRef } from "react";
import Stack from "../../containers/Stack";
import CodeInput from "../fields/CodeInput";
import SubmitFormButton from "../buttons/SubmitFormButton";
import styles from "./CodeConfirmationForm.module.css";
import removeAccents from "../../../utils/formatters/text/removeAccents";
import removeSymbols from "../../../utils/formatters/text/removeSymbols";
import removeSpaces from "../../../utils/formatters/text/removeSpaces";

function CodeConfirmationForm({ code, setCode, email, handleSubmit }) {
    const inputRefs = useRef([]);

    const handleOnKeyDownCode = useCallback((e, order) => {
        if (e.key === "Backspace") {
            const targetOrder = e.target.value ? order : order - 1;

            setCode(prevCode => 
                prevCode.map(codeUnit =>
                    codeUnit.order === targetOrder
                        ? { ...codeUnit, value: "" } 
                        : codeUnit
                )
            );  

            if (order > 1) {
                setTimeout(() => {
                    inputRefs.current[order - 1].focus();
                }, 0);
            }
        }
    }, [setCode]);

    const handleOnFocusCode = useCallback(() => {
        const firstEmptyIndex = code.findIndex(code => !code.value);
        const focusIndex =
            firstEmptyIndex === -1
                ? code.length
                : firstEmptyIndex + 1;

        inputRefs.current[focusIndex].focus();
    }, [code]);

    const handleOnChangeCode = useCallback((e, order) => {
        const value = e.target.value
            .slice(-1)
            .toUpperCase();

        const formattedValue = removeAccents(removeSymbols(removeSpaces(value)));

        setCode(prevCode => 
            prevCode.map(codeUnit => 
                codeUnit.order === order
                    ? { ...codeUnit, value: formattedValue } 
                    : codeUnit  
            )
        );

        if (formattedValue && order < code.length) {
            setTimeout(() => {
                inputRefs.current[order + 1]?.focus();
            }, 0);
        }
    }, [code, setCode]);

    return (
        <form
            onSubmit={handleSubmit}
        >
            <Stack
                gap="2em"
                className={styles.code_confirmation_form_container}
            >
                <p>
                    Preencha as caixas abaixo com o código que enviamos a você.
                </p>
            
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
                        {code.map(codeUnit => 
                            <CodeInput
                                key={codeUnit.order}
                                name={`code${codeUnit.order}`}
                                value={codeUnit.value}
                                handleChange={(e) => handleOnChangeCode(e, codeUnit.order)}
                                handleFocus={() => handleOnFocusCode(codeUnit.order)}
                                handleKeyDown={(e) => handleOnKeyDownCode(e, codeUnit.order)}
                                ref={(el) => inputRefs.current[codeUnit.order] = el}
                            />
                        )}
                    </Stack>
                </Stack>

                <SubmitFormButton
                    text="Confirmar"
                />
            </Stack>
        </form>
    );
}

export default CodeConfirmationForm;