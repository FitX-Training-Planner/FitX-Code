import { useTranslation } from "react-i18next";
import PhotoInput from "../../form/fields/PhotoInput";
import { formatDateToExtend } from "../../../utils/formatters/text/formatDate";
import Stack from "../../containers/Stack";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import { formatNumberShort } from "../../../utils/formatters/text/formatNumber";
import styles from "./TrainerPageCards.module.css";
import GenericCard from "../GenericCard";
import useWindowSize from "../../../hooks/useWindowSize";
import React from "react";

function RankedRatingCard({
    rating,
    comment,
    createDate,
    raterID,
    likesNumber,
    raterName,
    raterPhotoUrl
}) {
    const { t, i18n } = useTranslation();

    const { width } = useWindowSize();
    
    return (
        <GenericCard
            border="2px solid var(--theme-color)"
            borderRadius="20px"
            padding="1em"
            extraStyles={{ maxWidth: "40em" }}
        >
            <Stack
                gap="2em"
            >
                <Stack
                    className={styles.rater}
                    extraStyles={{ textAlign: "center" }}
                >
                    {raterID ? (
                        raterName ? (
                            <Stack
                                className={styles.rater}
                            >
                                <PhotoInput
                                    blobUrl={raterPhotoUrl}
                                    disabled
                                    size={width <= 640 ? "small" : "medium"}
                                />
    
                                <span
                                    style={{ fontSize: "var(--large-text-size)" }}
                                >
                                    {raterName}
                                </span>
                            </Stack>
                        ) : (
                            <p>
                                {t("anonymousComplaint")}
                            </p>
                        )
                    ) : (
                        <p>
                            {t("deletedUser")}
                        </p>
                    )}
                </Stack>

                <Stack
                    alignItems="end"
                    gap="2em"
                >
                    <Stack
                        alignItems="start"
                        gap="2em"
                    >
                        <Stack
                            direction="row"
                            justifyContent="center"
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

                        <Stack
                            direction="row"
                            justifyContent="center"
                            gap="0.5em"
                        >
                            <ClickableIcon
                                iconSrc="/images/icons/liked.png"
                                name={t("likes")}
                                hasTheme={false}
                            />

                            <span>
                                {formatNumberShort(likesNumber)}
                            </span>
                        </Stack>
                    </Stack>

                    <span
                        style={{ textAlign: "end", color: "var(--gray-color)", fontSize: width <= 640 ? "var(--small-text-size)" : "var(--text-size)" }}
                    >
                        {formatDateToExtend(createDate, i18n.language)}
                    </span>
                </Stack>
            </Stack>
        </GenericCard>
    );
}

export default RankedRatingCard;