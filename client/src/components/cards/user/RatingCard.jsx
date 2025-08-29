import { useTranslation } from "react-i18next";
import PhotoInput from "../../form/fields/PhotoInput";
import { formatDateToExtend } from "../../../utils/formatters/text/formatDate";
import Stack from "../../containers/Stack";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import React from "react";
import { formatNumberShort } from "../../../utils/formatters/text/formatNumber";
import { useSelector } from "react-redux";
import styles from "./TrainerPageCards.module.css";

function RatingCard({
    rating,
    comment,
    createDate,
    likesNumber,
    raterID,
    raterName,
    raterPhotoUrl,
    handleLike,
    hasLiked,
    handleRemoveRating
}) {
    const { t, i18n } = useTranslation();

    const user = useSelector(state => state.user);
    
    return (
        <Stack
            classname={styles.rating_card}
        >
            <Stack
                direction="row"
                className={styles.rater_container}
            >
                <Stack
                    direction="row"
                    justifyContent="start"
                    gap="0.5em"
                    className={styles.rater}
                >
                    {raterID ? (
                        raterName ? (
                            <>
                                <PhotoInput
                                    blobUrl={raterPhotoUrl}
                                    size="tiny"
                                    disabled
                                />
    
                                <span>
                                    {raterName}
                                </span>
                            </>     
                        ) : (
                            <p>
                                {t("anonymousRating")}
                            </p>
                        )
                    ) : (
                         <p>
                            {t("deletedUser")}
                        </p>
                    )}
                </Stack>

                <span>
                    {formatDateToExtend(createDate, i18n.language)}
                </span>
            </Stack>

            <Stack>
                <Stack
                    alignItems="start"
                >
                    <Stack
                        direction="row"
                        gap="0.5em"
                        justifyContent="start"
                    >
                        {Array.from({ length: Number(rating) }, (_, index) => (
                            <React.Fragment
                                key={index}
                            >
                                <ClickableIcon
                                    iconSrc="/images/icons/rated.png"
                                    hasTheme={false}
                                    size="small"
                                />
                            </React.Fragment>
                        ))}
                    </Stack>

                    <p>
                        {comment}
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
                            hasTheme={false}
                            name={t("like")}
                            handleClick={handleLike || undefined}
                        />

                        <span>
                            {formatNumberShort(likesNumber)}
                        </span>
                    </Stack>

                    {String(raterID) === String(user.ID) && handleRemoveRating && (
                        <Stack
                            alignItems="end"
                        >
                            <ClickableIcon
                                iconSrc="/images/icons/remove.png"
                                name={t("remove")}
                                handleClick={handleRemoveRating}
                                size="small"
                            />
                        </Stack>
                    )}
                </Stack>
            </Stack>
        </Stack>
    );
}

export default RatingCard;