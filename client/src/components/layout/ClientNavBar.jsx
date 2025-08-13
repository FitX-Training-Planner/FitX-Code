import Stack from "../containers/Stack";
import ClickableIcon from "../form/buttons/ClickableIcon";
import styles from "./NavBar.module.css";
import CommonNavBar from "./CommonNavBar";
import { useTranslation } from "react-i18next";

function ClientNavBar({
    navigate,
    isActive
}) {
    const { t } = useTranslation();

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
                            name={t("myWorkout")}
                        />
                    </Stack>

                    <span>
                        {t("myWorkout")}
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
                            name={t("chatWithTrainer")}
                        />
                    </Stack>

                    <span>
                        {t("chatWithTrainer")}
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
                            name={t("myProgress")}
                        />
                    </Stack>

                    <span>
                        {t("myProgress")}
                    </span>
                </Stack>
            </li>

            <li
                onClick={() => navigate("/me/saved-trainers")}
                className={isActive("/me/saved-trainers") ? styles.selected : undefined}
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
                            iconSrc="/images/icons/save.png"
                            name={t("savedTrainers")}
                        />
                    </Stack>

                    <span>
                        {t("savedTrainers")}
                    </span>
                </Stack>
            </li>
        </CommonNavBar>
    );
}

export default ClientNavBar;