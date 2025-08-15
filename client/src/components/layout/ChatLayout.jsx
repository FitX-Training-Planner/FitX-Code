import Stack from "../containers/Stack";
import styles from "./ChatLayout.module.css";
import PhotoInput from "../form/fields/PhotoInput";
import { formatDateTime } from "../../utils/formatters/text/formatDate";
import MessageForm from "../form/forms/MessageForm";
import SendDocumentForm from "../form/forms/SendDocumentForm";
import React, { useEffect, useRef } from "react";
import useWindowSize from "../../hooks/useWindowSize";
import { useTranslation } from "react-i18next";

function ChatLayout({
    isChatBot = true,
    chat,
    chatFormContext,
    setChatFormContext,
    setMessageError,
    setDocumentError,
    handleSendDocument,
    handleSendMessage,
    chatbotLoading
}) {
    const { t } = useTranslation();

    const { width } = useWindowSize();

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chat.messages]);
    
    return (
        <Stack 
            className={styles.chat_container}
        >
            <Stack
                direction="row"
                className={styles.chat_info}
            >
                <Stack
                    className={styles.contact_info}
                    direction="row"
                    gap="0.2em"
                    justifyContent="start"
                >
                    <PhotoInput
                        blobUrl={isChatBot ? "/images/icons/chatbot2.png" : chat.contact?.photoUrl}
                        size="tiny"
                    />

                    <Stack
                        className={styles.update_info}
                        gap="0.2em"
                        alignItems="start"
                    >
                        <span>
                            {isChatBot ? "Coachy" : chat.contact?.name}
                        </span>

                        <span>
                            {
                                isChatBot 
                                ? (chatbotLoading ? `${t("thinking")}...` : "Online") 
                                : `${t("lastUpdate")}: ${formatDateTime(chat.updateDate, t)}`
                            }
                        </span>
                    </Stack>
                </Stack>

                <Stack
                    className={styles.chat_actions}
                >
                    {!isChatBot && (
                        <Stack>
                            <SendDocumentForm
                                chatFormContext={chatFormContext}
                                setChatFormContext={setChatFormContext}
                                setDocumentError={setDocumentError}
                                handleSubmit={handleSendDocument}
                            />
                        </Stack>
                    )}
                </Stack>
            </Stack>

            <Stack
                className={styles.messages}
                gap="2em"
            >
                {chat.messages
                    .sort((a, b) => new Date(a.createDate) - new Date(b.createDate))
                    .map((message, index) => (
                        <React.Fragment
                            key={index}
                        >
                            <Stack
                                className={`${styles.message} ${message.isFromMe ? styles.from_me : undefined}`}
                                extraStyles={{ maxWidth: width <= 440 ? "90%" : "60%" }}
                                direction="row"
                                alignItems="start"
                            >
                                <Stack
                                    alignItems="start"
                                    className={styles.message_content}
                                >
                                    <p>
                                        {message.content}
                                    </p>

                                    <Stack
                                        className={styles.message_info}
                                        direction="row"
                                    >
                                        <span>
                                            {formatDateTime(message.createDate, t)}
                                        </span>

                                        <span>
                                            {!message.isFromMe ? (isChatBot ? "Coachy" : chat.contact?.name) : t("you")}
                                        </span>
                                    </Stack>
                                </Stack>

                                {!isChatBot && (
                                    <span
                                        className={`${styles.view_indicator} ${message.isViewed ? styles.viewed : undefined}`}
                                        title={message.isViewed ? t("viewed") : t("notViewed")}
                                    ></span>
                                )}
                            </Stack>
                        </React.Fragment>
                    ))
                }

                <div 
                    ref={messagesEndRef} 
                />
            </Stack>

            <Stack
                className={styles.message_form}
            >
                <MessageForm
                    chatFormContext={chatFormContext}
                    setChatFormContext={setChatFormContext}
                    isChatBot={isChatBot}
                    setMessageError={setMessageError}
                    handleSubmit={handleSendMessage}
                />
            </Stack>
        </Stack>
    );
}

export default ChatLayout;