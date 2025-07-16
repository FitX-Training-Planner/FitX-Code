import { useTranslation } from "react-i18next";
import Stack from "../../containers/Stack";
import ClickableIcon from "./ClickableIcon";
import styles from "./LoadMoreButton.module.css";

function LoadMoreButton({ 
    text, 
    handleLoad 
}) {
    const { t } = useTranslation();

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
                {text || t("loadMore")}

                <ClickableIcon
                    iconSrc="/images/icons/add.png"
                    size="small"
                    name={t("load")}
                    hasTheme={false}
                />
            </Stack>
        </div>
    );
}

export default LoadMoreButton;