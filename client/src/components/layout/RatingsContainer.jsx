import { useTranslation } from "react-i18next";
import styles from "./TrainerPageContainers.module.css";
import Stack from "../containers/Stack";
import Title from "../text/Title";
import ClickableIcon from "../form/buttons/ClickableIcon";
import { formatNumberShort } from "../../utils/formatters/text/formatNumber";
import RatingForm from "../form/forms/RatingForm";
import RatingCard from "../cards/user/RatingCard";
import LoadMoreButton from "../form/buttons/LoadMoreButton";
import React from "react";

function RatingsContainer({
    ratings,
    ratingsError,
    ratingsOffset,
    ratingsLoading,
    handleLoadRatings,
    trainerRate,
    trainerRatesNumber,
    viewerIsClient,
    handleLikeRating,
    handleRemoveRating,
    rating,
    setRating,
    setRatingError,
    handleRating
}) {
    const { t } = useTranslation();

    return (
        <Stack
            alignItems="start"
            className={styles.ratings_container}
            gap="2em"
        >
            <Title
                headingNumber={2}
                text={t("ratings")}
            />

            <Stack
                alignItems="start"
            >
                <Stack
                    direction="row"
                    gap="0.5em"
                    justifyContent="start"
                >
                    <ClickableIcon
                        iconSrc="/images/icons/rated.png"
                        name={t("averageGrade")}
                        hasTheme={false}
                    />

                    <span>
                        {Number(trainerRate).toFixed(2)}
                    </span>
                </Stack>

                <span>
                    {formatNumberShort(trainerRatesNumber)} {t("ratings")}
                </span>
            </Stack>

            <Stack
                gap="3em"
            >
                {viewerIsClient && (
                    <RatingForm
                        rating={rating}
                        setRating={setRating}
                        setRatingError={setRatingError}
                        handleSubmit={handleRating}
                    />
                )}

                <Stack
                    gap="2em"
                >
                    <Stack>
                        <Stack
                            gap="2em"
                        >
                            {ratings.length !== 0 ? (
                                ratings.map((r, index) => (
                                    <React.Fragment
                                        key={index} 
                                    >
                                        <RatingCard
                                            rating={r.rating}
                                            comment={r.comment}
                                            createDate={r.createDate}
                                            likesNumber={r.likesNumber}
                                            raterID={r.raterID}
                                            raterName={r.rater?.name}
                                            raterPhotoUrl={r.rater?.photoUrl}
                                            handleLike={viewerIsClient ? () => handleLikeRating(r.ID) : undefined}
                                            hasLiked={r.hasLiked}
                                            handleRemoveRating={viewerIsClient ? () => handleRemoveRating(r.ID, r.rating) : undefined}
                                        />
                                    </React.Fragment>
                                ))
                            ) : (
                                <p>
                                    {t("noRatingsFinded")}
                                </p>
                            )}
                        </Stack>
                    </Stack>

                    {ratingsError ? (
                        <p>
                            <>
                                {t("errorOcurredRatings")}

                                <br/>
                                
                                {t("reloadOrTryLater")}
                            </>
                        </p>
                    ) : (
                        <LoadMoreButton
                            handleLoad={() => handleLoadRatings(ratingsError, ratings, ratingsOffset)}
                            loading={ratingsLoading}
                        />
                    )}
                </Stack>
            </Stack>
        </Stack>
    )
}

export default RatingsContainer;