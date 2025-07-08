import Stack from "../containers/Stack";
import ClickableIcon from "../form/buttons/ClickableIcon";
import styles from "./NavBar.module.css";
import CommonNavBar from "./CommonNavBar";

function TrainerNavBar({ navigate, isActive }) {
    return (
        <CommonNavBar
            navigate={navigate}
            isActive={isActive}
        >
            <li
                onClick={() => navigate("/trainers/me/training-plans")}
                className={`${styles.nav_bar_item} ${isActive("/trainers/me/training-plans") ? styles.selected : undefined}`}
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
                            name="Planos de Treino"
                        />
                    </Stack>

                    <span>
                        Planos de Treino
                    </span>
                </Stack>
            </li>

            <li
                onClick={() => navigate("/trainers/me/clients")}
                className={isActive("/trainers/me/clients") ? styles.selected : undefined}
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
                            iconSrc="/images/icons/clients.png"
                            name="Clientes"
                        />
                    </Stack>

                    <span>
                        Clientes
                    </span>
                </Stack>
            </li>

            <li
                onClick={() => navigate("/trainers/me/chats")}
                className={isActive("/trainers/me/chats") ? styles.selected : undefined}
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
                            name="Conversas com Clientes"
                        />
                    </Stack>

                    <span>
                        Conversas com Clientes
                    </span>
                </Stack>
            </li>

            <li
                onClick={() => navigate("/trainers/me/payments")}
                className={isActive("/trainers/me/payments") ? styles.selected : undefined}
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
                            iconSrc="/images/icons/transaction.png"
                            name="Pagamentos"
                        />
                    </Stack>

                    <span>
                        Pagamentos
                    </span>
                </Stack>
            </li>
        </CommonNavBar>
    );
}

export default TrainerNavBar;