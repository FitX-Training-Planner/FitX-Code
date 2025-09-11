import Stack from "../../containers/Stack";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import Title from "../../text/Title";
import { useTranslation } from "react-i18next";
import styles from "./ClientTrainingCards.module.css";
import convertTime from "../../../utils/formatters/text/convertTime";
import Alert from "../../messages/Alert";
import useWindowSize from "../../../hooks/useWindowSize";

function ClientTrainingCardioSessionCard({
    optionName,
    optionMedia,
    intensityType,
    intensityDescription,
    durationMinutes,
    sessionTime,
    note,
    order
}) {
    const { t } = useTranslation();

    const width = useWindowSize();

    return (
        <Stack  
            className={styles.training_card}
            gap="0"
        >  
            <Stack
                direction="row"
                className={styles.day_name_container}
            >
                <Stack
                    gap="0"
                    alignItems="start"
                >
                    <span>
                        {t("cardioSession")} {order}
                    </span>

                    <Title
                        headingNumber={2}
                        text={optionName}
                        textAlign="start"
                    />
                </Stack>

                <ClickableIcon
                    iconSrc={`/${optionMedia}`}
                    size="large"
                />
            </Stack>

            <Stack
                className={styles.training_card_body}
                gap="2em"
            >
                <Stack
                    alignItems="end"
                >
                    <Stack
                        direction="row"
                    >
                        <ClickableIcon
                            iconSrc="/images/icons/clock.png"
                        />

                        <Stack
                            direction={width <= 440 ? "column" : "row"}
                            alignItems="end"
                        >
                            <Stack
                                alignItems="start"
                                direction="row"
                                justifyContent="start"
                                gap="2em"
                            >
                                <Stack
                                    gap="0.5em"
                                    alignItems="start"
                                    className={styles.descriptioned_item}
                                >
                                    <span>
                                        {t("duration")}:
                                    </span>

                                    <span>
                                        {convertTime(durationMinutes, "minute", t)}
                                    </span>
                                </Stack>
                                
                                {sessionTime && (
                                    <Stack
                                        gap="0.5em"
                                        alignItems="start"
                                        className={styles.descriptioned_item}
                                    >
                                        <span>
                                            {t("time")}:
                                        </span>

                                        <span>
                                            {sessionTime}
                                        </span>
                                    </Stack>
                                )}
                            </Stack>
                        </Stack>
                    </Stack>

                    {(intensityType && intensityDescription) && (
                        <Stack
                            direction="row-reverse"
                            gap="0.5em"
                            justifyContent="end"
                            className={styles.descriptioned_item}
                        >
                            <span>
                                {intensityType}
                            </span>

                            <Alert
                                alertMessage={intensityDescription}
                            />
                        </Stack>
                    )}
                </Stack>

                {note && (
                    <Stack>
                        <hr/>
                        
                        <p
                            style={{ fontSize: "var(--small-text-size)", hyphens: "none" }}
                        >
                            {note}
                        </p>
                    </Stack>
                )}
            </Stack>
        </Stack>
    );
}

export default ClientTrainingCardioSessionCard;