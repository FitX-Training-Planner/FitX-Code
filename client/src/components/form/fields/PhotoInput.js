import { useEffect, useState } from "react";
import styles from "./PhotoInput.module.css";
import Stack from "../../containers/Stack";
import Alert from "../../messages/Alert";
import { useLocation } from "react-router-dom";

function PhotoInput({ name, labelText, size = "medium", blobUrl, handleChange, disabled = false }) {
    const userIcon = "/images/icons/user.png";
    const LabelOrDiv = name ? "label" : "div";

    const [preview, setPreview] = useState(blobUrl || userIcon);

    const location = useLocation();

    useEffect(() => {
        if (blobUrl) {
            setPreview(blobUrl);
        } else {
            setPreview(userIcon);
        }
    }, [blobUrl, location.pathname]);

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
                        justifyContent="center"
                    >
                        <Alert
                            varColor="--dark-color"
                            alertMessage="Selecione uma foto do tipo JPG, JPEG, PNG ou WEBP de até 1mb."
                        />

                        <span>
                            {labelText}
                        </span>
                    </Stack>
                </>
            }

            <LabelOrDiv
                htmlFor={name || undefined}
                className={styles[size]}
                style={{ cursor: disabled ? "default" : "pointer" }}
            >
                <img
                    key={preview} 
                    src={preview}
                    alt={`${labelText || ""} Icon`}
                    onError={() => preview !== userIcon ? setPreview(userIcon) : undefined}
                />
            </LabelOrDiv>

            {name && (
                <input
                    type="file"
                    name={name}
                    id={name}
                    onChange={handleChange || undefined}
                    accept=".jpg,.jpeg,.png,.webp"
                    disabled={disabled}
                />
            )}
        </Stack>
    );
}

export default PhotoInput;
