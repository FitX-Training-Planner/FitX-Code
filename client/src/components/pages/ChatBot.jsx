import { useCallback, useEffect, useRef, useState } from "react";
import NavBarLayout from "../containers/NavBarLayout";
import ChatLayout from "../layout/ChatLayout";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyIsClient } from "../../utils/requests/verifyUserType";
import api from "../../api/axios";
import { validateMessage } from "../../utils/validators/formValidator";
import useRequest from "../../hooks/useRequest";
import { useSystemMessage } from "../../app/useSystemMessage";
import { useTranslation } from "react-i18next";

function ChatBot() {
    const { t } = useTranslation();

    const navigate = useNavigate();
    
    const hasRun = useRef(false);

    const { notify } = useSystemMessage();
    
    const user = useSelector(state => state.user);

    const { request: isClient } = useRequest();
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
                isFromTrainer: true
            }
        ]
    });
    const [messageError, setMessageError] = useState(false);
    
    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;

        const verifyClient = async () => {
            const success = await verifyIsClient(isClient, user, navigate, notify, t);

            if (!success) return;
        }

        verifyClient();
    }, [navigate, notify, isClient, user, t]);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        if (!validateMessage(messageError, setMessageError, chatFormContext.message, true)) return;

        const formData = new FormData();    

        formData.append("message", chatFormContext.message);
        formData.append("history", JSON.stringify(
            chat.messages.map(message => ({
                role: message.isFromTrainer ? "assistant" : "user",
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
                    isFromTrainer: false
                }
            ]
        }));

        setChatFormContext(prevChatForm => ({
            ...prevChatForm,
            message: ""
        }));

        const postMsg = () => {
            return api.post("/chatbot", formData);
        };
        
        const handleOnPostMsgSuccess = (data) => {
            setChat(prevChat => ({
                ...prevChat,
                messages: [
                    ...prevChat.messages,
                    {
                        content: data.message,
                        createDate: new Date(),
                        isFromTrainer: true
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
        <NavBarLayout>
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