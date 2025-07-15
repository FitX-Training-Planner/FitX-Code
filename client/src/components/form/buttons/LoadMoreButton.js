import Stack from "../../containers/Stack";
import ClickableIcon from "./ClickableIcon";
import styles from "./LoadMoreButton.module.css";

function LoadMoreButton({ text = "Carregar mais", handleLoad }) {
    return (
        <div
            type="button"
            className={styles.load_more_button}
            onClick={handleLoad}
        >
            <Stack
                direction="row"
                gap="0.5em"
                justifyContent="center"
            >
                {text}

                <ClickableIcon
                    iconSrc="/images/icons/add.png"
                    size="small"
                    name="Carregar"
                    hasTheme={false}
                />
            </Stack>
        </div>
    );
}

export default LoadMoreButton;