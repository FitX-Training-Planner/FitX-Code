import React, { useEffect, useRef, useState } from "react";
import NavBarLayout from "../containers/NavBarLayout";
import { useSelector } from "react-redux";
import api from "../../api/axios";
import useRequest from "../../hooks/useRequest";
import { useTranslation } from "react-i18next";
import { useSocket } from "../../app/useSocket";
import { useNavigate } from "react-router-dom";
import Loader from "../layout/Loader";
import { useSystemMessage } from "../../app/useSystemMessage";
import FooterLayout from "../containers/FooterLayout";
import ChatCard from "../cards/user/ChatCard";
import Stack from "../containers/Stack";

function Chats() {
    const { t } = useTranslation();
    
    const user = useSelector(state => state.user);

    const socket = useSocket();

    const navigate = useNavigate()

    const hasRun = useRef(false);

    const { notify } = useSystemMessage();

    const { request: getChatsReq, loading: getChatsLoading } = useRequest();
    const { request: isTrainer } = useRequest();

    const [chats, setChats] = useState([]);

    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;
        
        const fetchData = async () => {
            const getChats = () => {
                return api.get("/users/me/chats");
            }
        
            const handleOnGetChatsSuccess = (data) => {                    
                setChats(data);
            };

            const handleOnGetChatsError = () => {
                navigate("/");
            };

            getChatsReq(
                getChats, 
                handleOnGetChatsSuccess, 
                handleOnGetChatsError, 
                t("loadingChats"), 
                undefined, 
                t("errorChats")
            );
        }

        fetchData();
    }, [getChatsReq, isTrainer, navigate, notify, t, user]);

    useEffect(() => {
        if (!socket) return;

        const handleOnNewMessage = ({ chatID, message }) => {
            setChats(prevChats =>
                prevChats.map(chat => 
                    chat.ID === chatID 
                    ? {
                        ...chat,
                        newMessages: Number(chat.newMessages) + 1,
                        lastMessage: { ...message, isFromMe: false },
                        updateDate: message.createDate
                    } 
                    : chat
                )
            );
        };

        socket.on("new_message", handleOnNewMessage);

        return () => {
            socket.off("new_message", handleOnNewMessage);
        };
    }, [socket]);

    useEffect(() => {
        document.title = t("chats");
    }, [t]);

    return (
        <NavBarLayout
            isClient={user.config.isClient}
        >
            <FooterLayout>
                <main
                    style={{ padding: "3em 1em" }}
                >
                    <Stack
                        gap="0.5em"
                    >
                        {!getChatsLoading ? (
                            chats.map((chat, index) => (
                                <React.Fragment
                                    key={index}
                                >
                                    <ChatCard
                                        contactName={chat.contact?.name}
                                        contactPhotoUrl={chat.contact?.photoUrl}
                                        updateDate={chat.updateDate}
                                        newMessages={chat.newMessages}
                                        lastMessageContent={chat.lastMessage?.content}
                                        lastMessageIsFromMe={chat.lastMessage?.isFromMe}
                                        handleExpand={() => navigate(`/me/chats/${chat.ID}`)}
                                    />
                                </React.Fragment>
                            ))
                        ) : (
                            <Loader/>
                        )}
                    </Stack>
                </main>
            </FooterLayout>
        </NavBarLayout>
    );
}

export default Chats;
