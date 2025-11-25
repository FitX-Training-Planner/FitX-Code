import { useTranslation } from "react-i18next";
import useWindowSize from "../../hooks/useWindowSize";
import { formatDateTime } from "../../utils/formatters/text/formatDate";
import styles from "./ChatLayout.module.css";
import Stack from "../containers/Stack";

function ChatMessage({
    content,
    createDate,
    isFromMe,
    isChatBot,
    isViewed,
    isPending
}) {
    const { t } = useTranslation();

    const { width } = useWindowSize();

    return (
        <Stack
            className={`${styles.message} ${isFromMe ? styles.from_me : undefined}`}
            extraStyles={{ maxWidth: width <= 440 ? "90%" : "60%" }}
            alignItems="start"
        >
            <p>
                {content}
            </p>

            <Stack
                className={styles.message_info}
                direction="row"
                alignItems="end"
            >
                <span>
                    {formatDateTime(createDate, t, true)}
                </span>
        
                <Stack
                    direction="row"
                    extraStyles={{
                        width: "max-content"
                    }}
                >
                    <span
                        className={`${styles.view_indicator} ${isPending ? styles.pending : (isViewed || isChatBot ? styles.viewed : undefined)}`}
                        title={isPending ? t("messagePending") : (isViewed || isChatBot ? t("viewed") : t("messageDelivered"))}
                    ></span>

                    {(isViewed || isChatBot) && (
                        <span
                            className={`${styles.view_indicator} ${styles.viewed}`}
                            title={t("viewed")}
                        ></span>
                    )}
                </Stack>
            </Stack>
        </Stack>
    )
}

export default ChatMessage;