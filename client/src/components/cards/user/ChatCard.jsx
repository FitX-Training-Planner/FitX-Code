import { useTranslation } from "react-i18next";
import PhotoInput from "../../form/fields/PhotoInput";
import { formatDateTime } from "../../../utils/formatters/text/formatDate";
import Stack from "../../containers/Stack";
import GenericCard from "../GenericCard";
import styles from "./ChatCard.module.css"

function ChatCard({
    contactName,
    contactPhotoUrl,
    updateDate,
    newMessages,
    lastMessageContent,
    lastMessageIsFromMe,
    handleExpand
}) {
    const { t } = useTranslation();
    
    return (
        <GenericCard
            padding="0.5em"
            border="none"
            boxShadow="none"
            borderRadius="0"
            className={styles.chat_card}
        >
            <div
                onClick={handleExpand}
            >
                <Stack
                    direction="row"
                    alignItems="start"
                >
                    <Stack
                        direction="row"
                        gap="0.5em"
                    >
                        <PhotoInput
                            blobUrl={contactPhotoUrl}
                            size="tiny"
                            disabled
                        />

                        <Stack
                            alignItems="start"
                            gap="0.2em"
                            extraStyles={{ minWidth: "1px" }}
                        >
                            <span
                                style={{ fontWeight: "bold" }}
                            >
                                {contactName}
                            </span>

                            {lastMessageContent && (
                                <p
                                    className={styles.message_content}
                                >
                                    {lastMessageIsFromMe && `${t("you")}:`} {lastMessageContent}
                                </p>
                            )}
                        </Stack>
                    </Stack>
                
                    <Stack
                        gap="0.2em"
                        alignItems="end"
                    >
                        <span>
                            {formatDateTime(updateDate, t)}
                        </span>

                        {newMessages > 0 && (
                            <span
                                className={styles.new_messages}
                            >
                                {Number(newMessages) > 9 ? "+9" : newMessages}
                            </span>
                        )}
                    </Stack>
                </Stack>
            </div>
        </GenericCard>
    );
}

export default ChatCard;