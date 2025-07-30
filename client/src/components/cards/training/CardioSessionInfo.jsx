import { useTranslation } from "react-i18next";
import convertTime from "../../../utils/formatters/text/convertTime";
import Stack from "../../containers/Stack";
import Title from "../../text/Title";
import styles from "./TrainingCards.module.css";

function CardioSessionInfo({
    usedID,
    note,
    cardioOptionName,
    cardioIntensityType,
    durationMinutes,
    sessionTime,
    headingNumber,
    titleColor = "--text-color", 
}) {
    const { t } = useTranslation();

    return (
        <Stack>
            <Stack
                gap="0.2em"
                className={styles.item_title}
            >
                <span>
                    {t("session")} {usedID}
                </span>

                <Title
                    text={cardioOptionName}
                    headingNumber={headingNumber}
                    varColor={titleColor}
                />
            </Stack>

            <hr/>

            <Stack
                gap="0.5em"
            >
                <span>
                    {convertTime(durationMinutes, "minute", t)}
                </span>

                <span>
                    {cardioIntensityType}
                </span>
                
                <Stack
                    gap="0.2em"
                    className={styles.descriptioned_item}
                >
                    <span>
                        {t("time")}:
                    </span>

                    <span>
                        {
                            sessionTime 
                            ? sessionTime
                            : t("undefined")
                        }
                    </span>
                </Stack>
            </Stack>

            {note && 
                <p
                    className={styles.note}
                >
                    <span>
                        {t("cardioSessionNote")}:
                    </span>
                    
                    {` ${note}`}
                </p>
            }
        </Stack>
    );
}

export default CardioSessionInfo;