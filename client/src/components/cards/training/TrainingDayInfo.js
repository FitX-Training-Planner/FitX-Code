import { useTranslation } from "react-i18next";
import Stack from "../../containers/Stack";
import Title from "../../text/Title";
import styles from "./TrainingCards.module.css";

function TrainingDayInfo({
    children,
    name,
    orderInPlan,
    note,
    headingNumber,
    titleColor = "--text-color",
    bgTitleColor = "--bg-color" 
}) {
    const { t } = useTranslation();

    return (
        <Stack>
            <Stack
                gap="0.2em"
                className={styles.item_title}
                extraStyles={{ backgroundColor: `var${bgTitleColor}` }}
            >              
                <span>
                    {t("day")} {orderInPlan}
                </span>

                <Title
                    headingNumber={headingNumber}
                    text={name}
                    varColor={titleColor}
                />
            </Stack>

            <hr/>

            {children}

            {note && 
                <p
                    className={styles.note}
                >
                    <span>
                        {t("dayNote")}: 
                    </span>
                    
                    {` ${note}`}
                </p>
            }
        </Stack>
    );
}

export default TrainingDayInfo;