import Stack from "../../containers/Stack";
import { useTranslation } from "react-i18next";
import styles from "./ClientTrainingCards.module.css";
import ClickableIcon from "../../form/buttons/ClickableIcon";

function ClientTrainingItem({
    handleExpand,
    style,
    children
}) {
    const { t } = useTranslation();

    return (
        <Stack  
            className={styles.training_item}
            extraStyles={style}
            gap="0"
        >
            <Stack
                className={styles.training_item_actions}
                alignItems="end"
            >
                {handleExpand && (
                    <ClickableIcon
                        iconSrc="/images/icons/expand.png"
                        size="tiny"
                        name={t("expand")}
                        handleClick={handleExpand || undefined}
                    />
                )}
            </Stack>
            
            <div>
                {children}
            </div>
        </Stack>
    );
}

export default ClientTrainingItem;