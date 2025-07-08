import Stack from "../../containers/Stack";
import styles from "./MessageInput.module.css";

function MessageInput({ name, value = "", handleChange, maxLength }) {
    return (
        <Stack 
            className={styles.message_input} 
        >
            <textarea 
                id={name}
                name={name}
                placeholder="Insira sua mensagem"
                value={value}
                onChange={handleChange}
                maxLength={maxLength}
            />
        </Stack>
    );
}

export default MessageInput;
