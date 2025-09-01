import { useCallback } from "react";
import ClickableIcon from "../form/buttons/ClickableIcon";
import { useTranslation } from "react-i18next";

const ShareTrainer = ({ 
    trainerName,
    trainerID, 
    notify,
    size
}) => {
    const { t } = useTranslation();

    const share = useCallback(async () => {
        if (navigator.share) {
            try {
                const fullUrl = `${import.meta.env.VITE_API_URL}/trainers/${trainerID}/share`;

                await navigator.share({
                    title: `${t("trainer")} ${trainerName}`,
                    text: `${t("seeTheFitXProfileOfTrainer")} ${trainerName}!`,
                    url: fullUrl,
                });
            } catch (err) {
                notify(t("errorShare"));
            }
        } else {
            notify(t("shareAlert"));
        }
    }, []);

    return (
        <ClickableIcon
            iconSrc="/images/icons/share.png"
            name={t("share")}
            size={size}
            handleClick={share}
        />
    );
};

export default ShareTrainer;
