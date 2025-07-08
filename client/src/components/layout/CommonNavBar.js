import Stack from "../containers/Stack";
import ClickableIcon from "../form/buttons/ClickableIcon";
import styles from "./NavBar.module.css";
import PhotoInput from "../form/fields/PhotoInput";
import { useSelector } from "react-redux";

function CommonNavBar({ children, navigate, isActive }) {
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
                                    name="Mais Informações"
                                    size="large"
                                    hasTheme={false}
                                />
                            </Stack>

                            <span>
                                Mais Informações
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
                                    name="Início"
                                />
                            </Stack>

                            <span>
                                Início
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
                                    name="Explorar Dados"
                                />
                            </Stack>

                            <span>
                                Explorar Dados
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