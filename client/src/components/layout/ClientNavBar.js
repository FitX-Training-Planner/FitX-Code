import Stack from "../containers/Stack";
import ClickableIcon from "../form/buttons/ClickableIcon";
import styles from "./NavBar.module.css";
import CommonNavBar from "./CommonNavBar";

function ClientNavBar({ navigate, isActive }) {
    return (
        <CommonNavBar
            navigate={navigate}
            isActive={isActive}
        >           
            <li
                onClick={() => navigate("/me/training-plan")}
                className={`${styles.nav_bar_item} ${isActive("/me/training-plan") ? styles.selected : undefined}`}
            >
                <Stack
                    justifyContent="start"
                    direction="row"
                    className={styles.nav_bar_item}
                >
                    <Stack
                        className={styles.nav_bar_item_icon}
                    >
                        <ClickableIcon
                            iconSrc="/images/icons/training_plan.png"
                            name="Meu Treino"
                        />
                    </Stack>

                    <span>
                        Meu Treino
                    </span>
                </Stack>
            </li>

            <li
                onClick={() => navigate("/me/trainer-chat")}
                className={isActive("/me/trainer-chat") ? styles.selected : undefined}
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
                            name="Conversa com Treinador"
                        />
                    </Stack>

                    <span>
                        Conversa com Treinador
                    </span>
                </Stack>
            </li>

            <li
                onClick={() => navigate("/me/progress")}
                className={isActive("/me/progress") ? styles.selected : undefined}
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
                            iconSrc="/images/icons/progress.png"
                            name="Meu Progresso"
                        />
                    </Stack>

                    <span>
                        Meu Progresso
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
                            name="Chatbot"
                        />
                    </Stack>

                    <span>
                        Dúvidas com Chatbot
                    </span>
                </Stack>
            </li>
        </CommonNavBar>
    );
}

export default ClientNavBar;