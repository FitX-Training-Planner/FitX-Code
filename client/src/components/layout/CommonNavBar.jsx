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
                        onClick={() => navigate("/app/data")}
                        className={isActive("/app/data") ? styles.selected : undefined}
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
                                    iconSrc="/images/icons/database.png"
                                    name={t("exploreFitX")}
                                />
                            </Stack>

                            <span>
                                {t("exploreFitX")}
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
                        onClick={() => navigate("/me/profile")}
                        className={isActive("/me/profile") ? styles.selected : undefined}
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