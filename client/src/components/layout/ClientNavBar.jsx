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
                onClick={() => navigate("/me/contract")}
                className={isActive("/me/contract") ? styles.selected : undefined}
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
                            iconSrc="/images/icons/training_plan.png"
                            name={t("contract")}
                        />
                    </Stack>

                    <span>
                        {t("contract")}
                    </span>
                </Stack>
            </li>

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
                            iconSrc="/images/icons/dumbell.png"
                            name={t("myWorkout")}
                        />
                    </Stack>

                    <span>
                        {t("myWorkout")}
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