import { useEffect, useState } from "react";
import styles from "./PhotoInput.module.css";
import Stack from "../../containers/Stack";
import Alert from "../../messages/Alert";

function PhotoInput({ name, labelText, size = "medium", blobUrl, handleChange, disabled = false }) {
    const userIcon = "images/icons/user.png";

    const [preview, setPreview] = useState(blobUrl || userIcon);

    useEffect(() => {
        setPreview(blobUrl || userIcon);
    }, [blobUrl]);
    
    return (
        <Stack 
            className={styles.photo_input}
        >
            {labelText && 
                <>
                    <Stack
                        gap="0.5em"
                        direction="row"
                        className={styles.label_container}
                    >
                        <Alert
                            varColor="--dark-color"
                            alertMessage="Selecione uma foto do tipo JPG, JPEG, PNG ou WEBP de até 2mb."
                        />

                        <span>
                            {labelText}
                        </span>
                    </Stack>
                </>
            }

            <label
                htmlFor={name}
                className={styles[size]}
                style={{ cursor: disabled ? "default" : "pointer" }}
            >
                <img
                    src={preview}
                    alt={`${labelText} Icon`}
                    onError={() => setPreview(userIcon)}
                />
            </label>

            <input
                type="file"
                name={name}
                id={name}
                onChange={handleChange || undefined}
                accept=".jpg,.jpeg,.png,.webp"
                disabled={disabled}
            />
        </Stack>

    );
}

export default PhotoInput;
