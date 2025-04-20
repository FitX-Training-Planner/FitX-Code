import Stack from "../../containers/Stack";
import styles from "./TextInput.module.css";

function TextInput({ name, placeholder, labelText, value = "", handleChange, icon, alertMessage, error = false }) {
    return (
        <Stack 
            className={styles.text_input} 
            gap="0.2em"
        >
            <label 
                htmlFor={name} 
            >
                {icon &&
                    <img src={icon} alt={`${labelText} Icon`} />
                }
                
                <p>
                    {labelText}
                </p>
            </label>

            <input type="text" id={name} name={name} placeholder={placeholder} value={value} onChange={handleChange} />

            <p 
                className={error ? styles.visible : undefined} 
            >
                {alertMessage}
            </p>
        </Stack>
    );
}

export default TextInput;