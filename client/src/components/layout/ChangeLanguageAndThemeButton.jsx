import ClickableIcon from "../form/buttons/ClickableIcon";
import styles from "./ChangeLanguageAndThemeButton.module.css";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import Stack from "../containers/Stack";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../slices/user/userSlice";

const ChangeLanguageAndThemeButton = () => {
    const { t } = useTranslation();

    const user = useSelector(state => state.user);

    const dispatch = useDispatch();

    const handleOnChangeTheme = useCallback(() => {
        dispatch(updateUser({ config: { isDarkTheme: !user.config.isDarkTheme } }));
    }, [user]);
    
    const handleOnChangeLang = useCallback(() => {
        dispatch(updateUser({ config: { isEnglish: !user.config.isEnglish } }));
    }, [user]);

    return (
        <Stack
            className={styles.change_language_and_theme_button}
            direction="row"
            justifyContent="center"
        >
            {
                user.config.isEnglish ? (
                    <ClickableIcon 
                        iconSrc="/images/icons/english.png" 
                        name={t("english")} 
                        size="small"
                        hasTheme={false}
                        handleClick={handleOnChangeLang}
                    />
                ) : (
                    <ClickableIcon 
                        iconSrc="/images/icons/portuguese.png" 
                        name={t("portuguese")} 
                        size="small"
                        hasTheme={false}
                        handleClick={handleOnChangeLang}
                    />
                )
            }

            <hr/>
        
            {
                !user.config.isDarkTheme ? (
                    <ClickableIcon 
                        iconSrc="/images/icons/sun.png" 
                        name={t("lightTheme")} 
                        size="small"
                        hasTheme={false}
                        handleClick={handleOnChangeTheme}
                    />
                ) : (
                    <ClickableIcon 
                        iconSrc="/images/icons/moon.png" 
                        name={t("darkTheme")} 
                        size="small"
                        hasTheme={false}
                        handleClick={handleOnChangeTheme}
                    />
                )
            }
        </Stack>
    );
};

export default ChangeLanguageAndThemeButton;
