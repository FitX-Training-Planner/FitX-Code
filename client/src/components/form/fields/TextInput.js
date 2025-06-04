import Stack from "../../containers/Stack";
import styles from "./TextInput.module.css";

function TextInput({ type = "text", name, placeholder, labelText, value = "", handleChange, icon, alertMessage, error = false, maxLength }) {
    return (
        <Stack 
            className={styles.text_input} 
            gap="0.2em"
        >
            <label 
                htmlFor={name} 
            >
                {icon &&
                    <img 
                        src={icon} 
                        alt={`${labelText} Icon`} 
                    />
                }
                
                <p>
                    {labelText}
                </p>
            </label>

            <input 
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                maxLength={maxLength || undefined}
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

export default TextInput;