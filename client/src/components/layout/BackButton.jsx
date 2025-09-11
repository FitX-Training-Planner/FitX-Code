import { useNavigate } from "react-router-dom";
import ClickableIcon from "../form/buttons/ClickableIcon";
import styles from "./BackButton.module.css";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

const BackButton = ({ 
    destiny = null,
    state
}) => {
    const { t } = useTranslation();
    
    const navigate = useNavigate();

    const handleClick = useCallback(() => {
        if (destiny) {
            navigate(destiny, state);
        } else {
            if (window.history.length > 1) {
                navigate(-1);
            } else {
                navigate("/");
            }
        }
    }, [destiny, navigate, state]);

    return (
        <div
            className={styles.back_button}
            onClick={handleClick}
        >
            <ClickableIcon
                iconSrc="/images/icons/back.png"
                name={t("goBack")}
                size="small"
            />
        </div>
    );
};

export default BackButton;
