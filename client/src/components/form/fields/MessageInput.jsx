import Stack from "../../containers/Stack";
import styles from "./MessageInput.module.css";

function MessageInput({
    name, 
    value = "",
    handleChange,
    maxLength,
    alertMessage,
    error,
    varTextColor = "--text-color", 
    placeholder,
    handleKeyDown
}) {
    return (
        <Stack 
            className={styles.message_input} 
            gap="0.2em"
        >
            <textarea 
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                maxLength={maxLength}
                style={{ color: `var(${varTextColor})` }}
                onKeyDown={handleKeyDown}
            />

            {alertMessage &&
                <p 
                    className={error ? styles.visible : undefined}
                >
                    {alertMessage}
                </p>
            }
        </Stack>
    );
}

export default MessageInput;
