import Stack from "../../containers/Stack";
import styles from "./TextInput.module.css";
import { useSelector } from "react-redux";

function TextInput({ 
    type = "text", 
    name, 
    placeholder, 
    labelText, 
    value = "", 
    handleChange, 
    icon, 
    alertMessage, 
    error = false, 
    maxLength 
}) {
    const user = useSelector(state => state.user);

    return (
        <Stack 
            className={`${styles.text_input} ${user.config.isDarkTheme ? styles.dark_theme : undefined}`} 
            gap="0.2em"
        >
            {(labelText || icon) && (
                <label 
                    htmlFor={name} 
                >
                    {icon && (
                        <img 
                            src={icon} 
                            alt="" 
                        />
                    )}
                    
                    {labelText && (
                        <p>
                            {labelText}
                        </p>
                    )}
                </label>
            )}

            <input 
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={handleChange || undefined}
                maxLength={maxLength}
                readOnly={!handleChange}
            />

           {alertMessage && (
                <p 
                    className={error ? styles.visible : undefined} 
                >
                    {alertMessage}
                </p>
            )}
        </Stack>
    );
}

export default TextInput;