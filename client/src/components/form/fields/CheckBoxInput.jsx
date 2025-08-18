import Stack from "../../containers/Stack";
import styles from "./CheckBoxInput.module.css";

function CheckBoxInput({ 
    name, 
    isChecked = false, 
    handleChange, 
    labelText, 
    description 
}) {
    return (
        <Stack
            gap="0.5em"
            alignItems="start"
            className={styles.checkbox_input}
        >
            <span>
                {labelText}
            </span>
            
            <input
                checked={isChecked}
                onChange={handleChange}
                name={name}
                id={name}
                type="checkbox"
            />

            <label
                htmlFor={name}
            >
                <span/>
            </label>

            <p>
                {description}
            </p>
        </Stack>
    );
};

export default CheckBoxInput;
