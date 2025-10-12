import { useCallback, useEffect, useRef, useState } from "react";
import NavBarLayout from "../containers/NavBarLayout";
import ChatLayout from "../layout/ChatLayout";
import { useSelector } from "react-redux";
import api from "../../api/axios";
import { validateMessage } from "../../utils/validators/formValidator";
import useRequest from "../../hooks/useRequest";
import { useTranslation } from "react-i18next";
import { useSocket } from "../../app/useSocket";
import { useNavigate, useParams } from "react-router-dom";
import usePresence from "../../hooks/usePresence";
import Loader from "../layout/Loader";

function ChatClientTrainer() {
    const { t } = useTranslation();
    
    const user = useSelector(state => state.user);

    const { id } = useParams();

    const socket = useSocket();

    const navigate = useNavigate()

    const hasRun = useRef(false);
    const typingTimeout = useRef(null);
    const isTyping = useRef(false);
    const cachedUserID = useRef(null);

    const onlineUsers = usePresence();

    const { request: postMessage } = useRequest();
    const { request: joinChatReq, loading: joinLoading } = useRequest();
    const { request: getChatReq, loading: getChatLoading } = useRequest();
    const { request: getMessagesReq, loading: getMessagesLoading } = useRequest();
    const { request: getUserID } = useRequest();

    const messagesLimit = 20;

    const [chatFormContext, setChatFormContext] = useState({
        message: "",
        document: null
    });
    const [chat, setChat] = useState({
        ID: null,
        messages: [],
        contact: {
            ID: null,
            isOnline: false,
            isPresent: false,
            isTyping: false,
            name: "",
            photoUrl: null
        },
        lastMessage: null
    });
    const [messagesOffset, setMessagesOffset] = useState(0);
    const [messagesError, setMessagesError] = useState(false);
    const [messageError, setMessageError] = useState(false);
    const [messagesEnding, setMessagesEnding] = useState(false);
    const [firstMessageItemIndex, setFirstMessageItemIndex] = useState(10000000000);

    const loadMessages = useCallback(() => {
        if (messagesError || messagesOffset === 0) return;

        if ((chat.messages.length < messagesLimit) || messagesEnding) return;

        const getMessages = () => {
            return api.get(`/users/me/chats/${id}/messages`, { 
                params: { 
                    offset: messagesOffset, 
                    limit: messagesLimit
                }
            });
        }
        
        const handleOnGetMessagesSuccess = (data) => {
            const orderedData = [...data].reverse();

            setChat(prevChat => ({
                ...prevChat,
                messages: [...orderedData, ...prevChat.messages]
            }));

            setMessagesOffset(messagesOffset + messagesLimit);

            if (data.length < messagesLimit) setMessagesEnding(true);

            setFirstMessageItemIndex(prevIndex => Math.max(prevIndex - orderedData.length, 0));
        };
    
        const handleOnGetMessagesError = () => {
            setMessagesError(true);
        };
    
        getMessagesReq(
            getMessages, 
            handleOnGetMessagesSuccess, 
            handleOnGetMessagesError, 
            undefined, 
            undefined, 
            t("errorChatMessages")
        );
    }, [chat.messages.length, getMessagesReq, id, messagesEnding, messagesError, messagesOffset, t]);

    const getUserIdForCache = useCallback((handleSuccess) => {
        if (cachedUserID.current) {
            handleSuccess(cachedUserID.current);

            return cachedUserID.current;
        }

        const GetID = () => {
            return api.get(`/users/me/id`);
        }
    
        const handleOnGetIDSuccess = (data) => {                    
            cachedUserID.current = data.ID;

            handleSuccess(data.ID);

            return cachedUserID.current;
        };

        const handleOnGetIDError = () => {                    
            navigate(user.config.isClient ? "/" : "/trainers/me/clients");

            return null;
        };

        getUserID(
            GetID, 
            handleOnGetIDSuccess, 
            handleOnGetIDError, 
            undefined, 
            undefined, 
            t("errorGetId")
        );
    }, [getUserID, navigate, t, user.config.isClient]);

    useEffect(() => { 
        if (!socket) return;

        if (hasRun.current) return;
                
        hasRun.current = true;
        
        const fetchData = async () => {
            getUserIdForCache((ID) => {
                const joinChat = () => {
                    return api.post(`/users/me/chats/${id}/join`);
                }
            
                const handleOnJoinChatSuccess = () => {
                    console.log("Emitindo evento join_chat")

                    socket.emit("join_chat", { 
                        chatID: id, 
                        userID: ID 
                    });
    
                    const getChat = () => {
                        return api.get(`/users/me/chats/${id}`, {
                            params: {
                                messagesLimit: messagesLimit
                            }
                        });
                    }
                
                    const handleOnGetChatSuccess = (data) => {   
                        const orderedMessages = [...data.messages].reverse();

                        setChat({
                            ...data,
                            messages: orderedMessages
                        });
    
                        setTimeout(() => {
                            setMessagesOffset(data.messages.length);
                        }, 1000); 
                    };
    
                    const handleOnGetChatError = () => {
                        navigate(user.config.isClient ? "/" : "/trainers/me/clients");
                    };
    
                    getChatReq(
                        getChat, 
                        handleOnGetChatSuccess, 
                        handleOnGetChatError, 
                        undefined, 
                        undefined, 
                        t("errorGetChat")
                    );
                };
    
                const handleOnJoinChatError = () => {
                    navigate(user.config.isClient ? "/" : "/trainers/me/clients");
                };
    
                joinChatReq(
                    joinChat, 
                    handleOnJoinChatSuccess, 
                    handleOnJoinChatError, 
                    undefined, 
                    undefined, 
                    t("errorJoinChat")
                );
            })
        }

        fetchData();
    }, [getChatReq, getUserIdForCache, id, joinChatReq, navigate, socket, t, user.config.isClient]);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        if (!validateMessage(messageError, setMessageError, chatFormContext.message, false)) return;

        const formData = new FormData();    

        formData.append("content", chatFormContext.message);
        
        setChatFormContext(prevChatForm => ({
            ...prevChatForm,
            message: ""
        }));

        const postMsg = () => {
            return api.post(`/users/me/chats/${id}/messages`, formData);
        };
        
        const handleOnPostMsgSuccess = (data) => {
           setChat(prevChat => ({
                ...prevChat,
                messages: [...prevChat.messages, { ...data, isPending: false }]
            }));

            setMessagesOffset(prev => prev + 1);

            socket.emit("send_message", {
                chatID: data.chatID,
                message: data,
                receiverID: chat.contact.ID
            });
        };

        const handleOnPostMsgError = () => {
            setMessageError(true);
        };

        postMessage(
            postMsg, 
            handleOnPostMsgSuccess, 
            handleOnPostMsgError, 
            undefined, 
            undefined, 
            t("errorSendMessage")
        );
    }, [chat.contact.ID, chatFormContext.message, id, messageError, postMessage, socket, t]);

    useEffect(() => {
        if (!socket) return;

        const handleOnLeaveChat = () => {
            console.log("Emitindo evento leave_chat");

            socket.emit("leave_chat", { chatID: id, userID: cachedUserID.current });
        };

        window.addEventListener("beforeunload", handleOnLeaveChat);

        return () => {
            handleOnLeaveChat();

            window.removeEventListener("beforeunload", handleOnLeaveChat);
        };
    }, [socket, id]);

    useEffect(() => {
        if (!socket) return;

        console.log("Evento user_in_chat")

        const handleOnUserEnterChat = ({ userID, isPresent }) => {
            if (String(userID) === String(chat.contact.ID)) {
                setChat(prevChat => ({
                    ...prevChat,
                    contact: {
                        ...prevChat.contact,
                        isPresent
                    }
                }))

                console.log("Setando chat no evento user_in_chat")
            }
        };

        socket.on("user_in_chat", handleOnUserEnterChat);

        return () => {
            socket.off("user_in_chat", handleOnUserEnterChat);
        };
    }, [chat.contact.ID, socket]);

    useEffect(() => {
        setChat(prevChat => ({
            ...prevChat,
            contact: {
                ...prevChat.contact,
                isOnline: onlineUsers[String(prevChat.contact.ID)] || false
            }
        }))
    }, [onlineUsers]);

    useEffect(() => {
        if (!socket) return;
        
        console.log("Evento user_typing")

        const handleOnUserTyping = ({ chatID, userID, isTyping }) => {
            if (String(chat.ID) === String(chatID) && String(userID) === String(chat.contact.ID)) {
                setChat(prevChat => ({
                    ...prevChat,
                    contact: {
                        ...prevChat.contact,
                        isTyping,
                    },
                }));

                console.log("Setando chat no evento user_typing")
            }
        };

        socket.on("user_typing", handleOnUserTyping);

        return () => {
            socket.off("user_typing", handleOnUserTyping);
        };
    }, [chat.ID, chat.contact.ID, socket]);

    useEffect(() => {
        if (!socket) return;

        console.log("Evento new_message")

        const handleOnNewMessage = ({ chatID, message }) => {
            if (String(chat.ID) === String(chatID)) {
                setChat(prevChat => ({
                    ...prevChat,
                    messages: [...(prevChat.messages || []), { ...message, isFromMe: false }],
                    lastMessage: message.createDate
                }));
    
                setMessagesOffset(prev => prev + 1);
    
                console.log("Setando chat no evento new_message")
            };
        };

        socket.on("new_message", handleOnNewMessage);

        return () => {
            socket.off("new_message", handleOnNewMessage);
        };
    }, [chat.ID, socket]);

    useEffect(() => {
        if (!socket) return;

        console.log("Evento messages_viewed")        

        const handleOnMessagesViewed = ({ chatID, userID, messageIDs }) => {
            if (String(chat.ID) === String(chatID) && String(userID) === String(chat.contact.ID)) {
                setChat(prevChat => ({
                    ...prevChat,
                    messages: prevChat.messages.map(msg =>
                        messageIDs.includes(msg.ID)
                            ? { ...msg, isViewed: true }
                            : msg
                    )
                }));

                console.log("Setando chat no evento messages_viewed")
            }
        };

        socket.on("messages_viewed", handleOnMessagesViewed);

        return () => {
            socket.off("messages_viewed", handleOnMessagesViewed);
        };
    }, [chat.ID, chat.contact.ID, socket]);

    const handleOnTyping = () => {
        if (!socket) return;
        
        if (!isTyping.current) {
            console.log("Emitindo evento typing: true");

            socket.emit("typing", { chatID: id, userID: cachedUserID.current, isTyping: true });

            isTyping.current = true;
        }

        if (typingTimeout.current) clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {
            console.log("Emitindo evento typing: false");

            socket.emit("typing", { chatID: id, userID: cachedUserID.current, isTyping: false });

            isTyping.current = false;
        }, 2000);
    };

    useEffect(() => {
        if (user.config.isClient) {
            document.title = t("chatWithTrainer");
        } else {
            document.title = `${t("chatWith")} ${chat.contact?.name}`;
        }
    }, [user.config.isClient, t, chat.contact?.name]);

    return (
        <NavBarLayout
            isClient={user.config.isClient}
        >
            <main>
                {!(joinLoading || getChatLoading || !chat.ID) ? (
                    <ChatLayout
                        isChatBot={false}
                        chat={chat}
                        chatFormContext={chatFormContext}
                        setChatFormContext={setChatFormContext}
                        setMessageError={setMessageError}
                        handleSendMessage={handleOnSubmit}
                        loadMessages={loadMessages}
                        handleTyping={handleOnTyping}
                        messagesError={messagesError}
                        messagesLoading={getMessagesLoading}
                        firstItemIndex={firstMessageItemIndex}
                    />
                ) : (
                    <Loader/>
                )}
            </main>
        </NavBarLayout>
    );
}

export default ChatClientTrainer;
