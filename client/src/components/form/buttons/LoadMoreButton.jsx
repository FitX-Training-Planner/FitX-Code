import { useTranslation } from "react-i18next";
import Stack from "../../containers/Stack";
import ClickableIcon from "./ClickableIcon";
import styles from "./LoadMoreButton.module.css";
import Loader from "../../layout/Loader";

function LoadMoreButton({ 
    text, 
    handleLoad,
    loading
}) {
    const { t } = useTranslation();

    return (
        <div
            type="button"
            className={!loading ? styles.load_more_button : undefined}
            onClick={handleLoad}
        >
            <Stack
                direction="row"
                gap="0.5em"
                justifyContent="center"
            >
                {!loading ? (
                    <>
                        {text || t("loadMore")}
        
                        <ClickableIcon
                            iconSrc="/images/icons/add.png"
                            size="small"
                            name={t("load")}
                            hasTheme={false}
                        />
                    </>
                ) : (
                    <Loader />
                )}
            </Stack>
        </div>
    );
}

export default LoadMoreButton;