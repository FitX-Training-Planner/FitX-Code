import Stack from "../containers/Stack";
import ClickableIcon from "../form/buttons/ClickableIcon";
import styles from "./NavBar.module.css";
import CommonNavBar from "./CommonNavBar";
import { useTranslation } from "react-i18next";

function TrainerNavBar({
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
                            name={t("trainingPlans")}
                        />
                    </Stack>

                    <span>
                        {t("trainingPlans")}
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
                            name={t("clients")}
                        />
                    </Stack>

                    <span>
                        {t("clients")}
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
                            name={t("paymentsAndContracts")}
                        />
                    </Stack>

                    <span>
                        {t("paymentsAndContracts")}
                    </span>
                </Stack>
            </li>

            <li
                onClick={() => navigate("/trainers/me/dashboard")}
                className={isActive("/trainers/me/dashboard") ? styles.selected : undefined}
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
                            iconSrc="/images/icons/dashboard.png"
                            name={t("dashboard")}
                        />
                    </Stack>

                    <span>
                        {t("dashboard")}
                    </span>
                </Stack>
            </li>
        </CommonNavBar>
    );
}

export default TrainerNavBar;