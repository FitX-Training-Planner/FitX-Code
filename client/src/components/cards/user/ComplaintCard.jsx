import { useTranslation } from "react-i18next";
import PhotoInput from "../../form/fields/PhotoInput";
import { formatDateToExtend } from "../../../utils/formatters/text/formatDate";
import Stack from "../../containers/Stack";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import { formatNumberShort } from "../../../utils/formatters/text/formatNumber";
import { useSelector } from "react-redux";
import styles from "./TrainerPageCards.module.css";

function ComplaintCard({
    reason,
    createDate,
    likesNumber,
    complainterID,
    complainterName,
    complainterPhotoUrl,
    handleLike,
    hasLiked,
    handleRemoveComplaint
}) {
    const { t } = useTranslation();

    const user = useSelector(state => state.user);
    
    return (
        <Stack
            className={styles.complaint_card}
        >
            <Stack
                direction="row"
                className={styles.complainter_container}
            >
                <Stack
                    direction="row"
                    justifyContent="start"
                    gap="0.5em"
                    className={styles.complainter}
                >
                    {complainterName ? (
                        <>
                            <PhotoInput
                                blobUrl={complainterPhotoUrl}
                                size="tiny"
                                disabled
                            />

                            <span>
                                {complainterName}
                            </span>
                        </>
                    ) : (
                        <p>
                            {t("anonymousComplaint")}
                        </p>
                    )}
                </Stack>

                <span>
                    {formatDateToExtend(createDate)}
                </span>
            </Stack>

            <Stack>
                <Stack
                    alignItems="start"
                >
                    <p>
                        {reason}
                    </p>
                </Stack>

                <Stack
                    direction="row"
                    gap="2em"
                >
                    <Stack
                        direction="row"
                        justifyContent="start"
                    >
                        <ClickableIcon
                            iconSrc={`/images/icons/${hasLiked || !handleLike ? "liked" : "like"}.png`}
                            size="small"
                            name={t("like")}
                            hasTheme={false}
                            handleClick={handleLike || undefined}
                        />

                        <span>
                            {formatNumberShort(likesNumber)}
                        </span>
                    </Stack>

                    {String(complainterID) === String(user.ID) && handleRemoveComplaint && (
                        <Stack
                            alignItems="end"
                        >
                            <ClickableIcon
                                iconSrc="/images/icons/remove.png"
                                name={t("remove")}
                                handleClick={handleRemoveComplaint}
                                size="small"
                            />
                        </Stack>
                    )}
                </Stack>
            </Stack>
        </Stack>
    );
}

export default ComplaintCard;