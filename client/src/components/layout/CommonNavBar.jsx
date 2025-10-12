import Stack from "../containers/Stack";
import ClickableIcon from "../form/buttons/ClickableIcon";
import styles from "./NavBar.module.css";
import PhotoInput from "../form/fields/PhotoInput";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

function CommonNavBar({
    children,
    navigate,
    isActive
}) {
    const { t } = useTranslation();

    const user = useSelector(state => state.user);

    return (
        <nav 
            className={styles.nav_bar}
        >
            <Stack
                className={styles.nav_bar_subdivision}
                alignItems="start"
            >
                <ul>
                    <li
                        onClick={() => navigate("/app/info")}
                        className={isActive("/app/info") ? styles.selected : undefined}
                    >
                        <Stack
                            justifyContent="start"
                            direction="row"
                            className={styles.nav_bar_item}
                        >
                            <Stack
                                alignItems="center"
                                className={`${styles.nav_bar_item_icon} ${styles.profile_item}`}
                            >
                                <ClickableIcon
                                    iconSrc="/logo180.png"
                                    name={t("moreInformations")}
                                    size="large"
                                    hasTheme={false}
                                />
                            </Stack>

                            <span>
                                {t("moreInformations")}
                            </span>
                        </Stack>
                    </li>
                </ul>
            </Stack>

            <hr/>

            <Stack
                className={styles.nav_bar_subdivision}
                alignItems="start"
            >
                <ul>
                    <li
                        onClick={() => navigate("/")}
                        className={isActive("/") ? styles.selected : undefined}
                    >
                        <Stack
                            justifyContent="start"
                            direction="row"
                            className={styles.nav_bar_item}
                        >
                            <Stack
                                alignItems="center"
                                className={styles.nav_bar_item_icon}
                            >
                                <ClickableIcon
                                    iconSrc="/images/icons/home.png"
                                    name={t("home")}
                                />
                            </Stack>

                            <span>
                                {t("home")}
                            </span>
                        </Stack>
                    </li>

                    {children}

                    <li
                        onClick={() => navigate("/me/chats")}
                        className={isActive("/me/chats") || isActive("/me/chats/:id") ? styles.selected : undefined}
                    >
                        <Stack
                            justifyContent="start"
                            direction="row"
                            className={styles.nav_bar_item}
                        >
                            <Stack
                                alignItems="center"
                                className={styles.nav_bar_item_icon}
                            >
                                <ClickableIcon
                                    iconSrc="/images/icons/chat.png"
                                    name={t("chats")}
                                />
                            </Stack>

                            <span>
                                {t("chats")}
                            </span>
                        </Stack>
                    </li>

                    <li
                        onClick={() => navigate("/questions-chatbot")}
                        className={isActive("/questions-chatbot") ? styles.selected : undefined}
                    >
                        <Stack
                            justifyContent="start"
                            direction="row"
                            className={styles.nav_bar_item}
                        >
                            <Stack
                                alignItems="center"
                                className={styles.nav_bar_item_icon}
                            >
                                <ClickableIcon
                                    iconSrc="/images/icons/chatbot.png"
                                    name="Coachy Chatbot"
                                />
                            </Stack>
        
                            <span>
                                {t("questionsWithCoachy")}
                            </span>
                        </Stack>
                    </li>
                </ul>
            </Stack>

            <hr/>

            <Stack
                alignItems="start"
                className={styles.nav_bar_subdivision}
            >
                <ul>
                    <li
                        onClick={() => navigate("/me")}
                        className={isActive("/me") ? styles.selected : undefined}
                    >
                        <Stack
                            justifyContent="start"
                            direction="row"
                            className={styles.nav_bar_item}
                        >
                            <Stack
                                alignItems="center"
                                className={`${styles.nav_bar_item_icon} ${styles.profile_item}`}
                            >
                                <PhotoInput
                                    blobUrl={user.config.photoUrl}
                                    size="tiny"
                                />
                            </Stack>

                            <span>
                                {user.name}
                            </span>
                        </Stack>    
                    </li>
                </ul>
            </Stack>
        </nav>
    );
}

export default CommonNavBar;