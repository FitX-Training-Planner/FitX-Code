// import styles from "./FileInput.module.css";
import Stack from "../../containers/Stack";

function FileInput({
    name,
    placeholder,
    handleChange
}) {    
    return (
        <Stack 
            // className={styles.file_input}
        >
            <label
                htmlFor={name}
                title={placeholder}
            >
                <img
                    src="/images/icons/documents.png"
                    alt="Document Icon"
                />
            </label>

            <input
                type="file"
                name={name}
                id={name}
                onChange={handleChange}
                accept=".pdf"
            />
        </Stack>
    );
}

export default FileInput;
