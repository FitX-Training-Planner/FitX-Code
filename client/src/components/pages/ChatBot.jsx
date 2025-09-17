import { useCallback, useEffect, useState } from "react";
import NavBarLayout from "../containers/NavBarLayout";
import ChatLayout from "../layout/ChatLayout";
import { useSelector } from "react-redux";
import api from "../../api/axios";
import { validateMessage } from "../../utils/validators/formValidator";
import useRequest from "../../hooks/useRequest";
import { useTranslation } from "react-i18next";

function ChatBot() {
    const { t } = useTranslation();
    
    const user = useSelector(state => state.user);

    const { request: postMessage, loading } = useRequest();

    const [chatFormContext, setChatFormContext] = useState({
        message: ""
    });
    const [chat, setChat] = useState({
        messages: [
            {
                content: `
                    ${t("hi")}, ${user.name}! ${t("chatbotDescription")} : )
                `,
                createDate: new Date(),
                isFromMe: false
            }
        ]
    });
    const [messageError, setMessageError] = useState(false);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        if (!validateMessage(messageError, setMessageError, chatFormContext.message, true)) return;

        const formData = new FormData();    

        formData.append("message", chatFormContext.message);
        formData.append("history", JSON.stringify(
            chat.messages.slice(-9).map(message => ({
                role: message.isFromMe ? "user" : "assistant",
                content: message.content.trim()
            }))
        ));
        formData.append("isEnglish", user.config.isEnglish);

        setChat(prevChat => ({
            ...prevChat,
            messages: [
                ...prevChat.messages, 
                {
                    content: chatFormContext.message,
                    createDate: new Date(),
                    isFromMe: true
                }
            ]
        }));

        setChatFormContext(prevChatForm => ({
            ...prevChatForm,
            message: ""
        }));

        const postMsg = () => {
            return api.post("/users/chatbot", formData);
        };
        
        const handleOnPostMsgSuccess = (data) => {
            setChat(prevChat => ({
                ...prevChat,
                messages: [
                    ...prevChat.messages,
                    {
                        content: data.message,
                        createDate: new Date(),
                        isFromMe: false
                    }
                ]
            }));
        };

        const handleOnPostMsgError = () => {
            setMessageError(true);

            setChat(prevChat => ({
                ...prevChat,
                messages: prevChat.messages.slice(0, -1)
            }));
        };

        postMessage(
            postMsg, 
            handleOnPostMsgSuccess, 
            handleOnPostMsgError, 
            undefined, 
            undefined, 
            t("errorSendMessage")
        );
    }, [chat.messages, chatFormContext.message, messageError, postMessage, t, user.config.isEnglish]);

    useEffect(() => {
        document.title = "Coachy Chatbot";
    }, []);

    return (
        <NavBarLayout
            isClient={user.config.isClient}
        >
            <main>
                <ChatLayout
                    isChatBot
                    chat={chat}
                    chatFormContext={chatFormContext}
                    setChatFormContext={setChatFormContext}
                    setMessageError={setMessageError}
                    handleSendMessage={handleOnSubmit}
                    chatbotLoading={loading}
                />
            </main>
        </NavBarLayout>
    );
}

export default ChatBot;
