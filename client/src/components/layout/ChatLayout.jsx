import Stack from "../containers/Stack";
import styles from "./ChatLayout.module.css";
import PhotoInput from "../form/fields/PhotoInput";
import { formatDateTime } from "../../utils/formatters/text/formatDate";
import MessageForm from "../form/forms/MessageForm";
// import SendDocumentForm from "../form/forms/SendDocumentForm";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import ChatMessage from "./ChatMessage";
import Loader from "./Loader";
import { Virtuoso } from "react-virtuoso";

function ChatLayout({
    isChatBot = true,
    chat,
    chatFormContext,
    setChatFormContext,
    setMessageError,
    // setDocumentError,
    // handleSendDocument,
    handleSendMessage,
    chatbotLoading,
    loadMessages,
    handleTyping,
    messagesError,
    messagesLoading,
    firstItemIndex
}) {
    const { t } = useTranslation();

    const virtuosoRef = useRef(null);
    const previousLengthRef = useRef(0);

    useEffect(() => {
        if (!virtuosoRef.current || chat.messages.length === 0) return;

        const previousLength = previousLengthRef.current || 0;
        const hasNewMessage = chat.messages.length > previousLength;
        const hasLoadMessage = previousLengthRef.currentFirstID !== undefined && chat.messages[0]?.ID !== previousLengthRef.currentFirstID;

        if (hasNewMessage && !hasLoadMessage) {
            const lastMessage = chat.messages[chat.messages.length - 1];

            if (lastMessage.isFromMe) {
                setTimeout(() => {
                    virtuosoRef.current.scrollToIndex({
                        index: chat.messages.length - 1,
                        align: "end",
                        behavior: "auto"
                    });

                    virtuosoRef.current.scrollTo({ top: Number.MAX_SAFE_INTEGER, behavior: "auto" });
                }, 50);
            }
        }

        previousLengthRef.current = chat.messages.length;
        previousLengthRef.currentFirstID = chat.messages[0]?.ID;
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
                                : (
                                    chat.contact.isOnline
                                    ? (
                                        chat.contact.isPresent 
                                        ? (
                                            chat.contact.isTyping
                                            ? t("typing")
                                            : t("inChat")
                                        )
                                        : "Online"
                                    ) : chat.lastMessage ? formatDateTime(chat.lastMessage, t, true) : "Offline"
                                )
                            }
                        </span>
                    </Stack>
                </Stack>

                <Stack
                    className={styles.chat_actions}
                >
                    {/* {!isChatBot && (
                        <Stack>
                            <SendDocumentForm
                                chatFormContext={chatFormContext}
                                setChatFormContext={setChatFormContext}
                                setDocumentError={setDocumentError}
                                handleSubmit={handleSendDocument}
                            />
                        </Stack>
                    )} */}
                </Stack>
            </Stack>

            <Virtuoso
                ref={virtuosoRef}
                style={{ height: "100%", width: "100%" }}
                data={chat.messages}
                followOutput={true}
                increaseViewportBy={{ top: 25, bottom: 300 }}
                firstItemIndex={firstItemIndex || 0}
                initialTopMostItemIndex={chat.messages?.length - 1}
                atTopStateChange={(atTop) => {
                    if (!isChatBot && atTop && !messagesLoading && !messagesError) {
                        loadMessages(); 
                    }
                }}
                components={{
                    Header: () => (
                        <Stack
                            extraStyles={{ marginBottom: "3em" }}
                        >
                            {messagesError ? (
                                <p>{t("errorMessagesAlert")}</p>
                            ) : (
                                messagesLoading ? (
                                    <Loader />
                                ) : (
                                    <p style={{ color: "var(--light-theme-color)" }}>
                                        {t("chatStart")}
                                    </p>
                                )
                            )}
                        </Stack>
                    )
                }}
                itemContent={(_, message) => (
                    <Stack
                        key={message.ID}
                        className={styles.message_container}
                        gap="0"
                    >
                        <ChatMessage
                            content={message.content}
                            createDate={message.createDate}
                            isFromMe={message.isFromMe}
                            isChatBot={isChatBot}
                            isViewed={message.isViewed}
                            isPending={message.isPending}
                        />
                    </Stack>
                )}
            />

            <Stack
                className={styles.message_form}
            >
                <MessageForm
                    chatFormContext={chatFormContext}
                    setChatFormContext={setChatFormContext}
                    isChatBot={isChatBot}
                    setMessageError={setMessageError}
                    handleSubmit={handleSendMessage}
                    handleTyping={handleTyping}
                />
            </Stack>
        </Stack>
    );
}

export default ChatLayout;