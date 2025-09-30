import { useTranslation } from "react-i18next";
import useWindowSize from "../../hooks/useWindowSize";
import Stack from "../containers/Stack";
import ClickableIcon from "../form/buttons/ClickableIcon";
import Title from "../text/Title";
import TopComplaintAndRatingCardLogic from "./TopComplaintAndRatingCard";
import RankedRatingCard from "../cards/user/RankedRatingCard";

function HomeRatingsContainer({
    ratingsInfo,
    ratingsInfoError
}) {
    const { t } = useTranslation();

    const { width } = useWindowSize();

    return (
        <Stack
            gap="3em"
        >
            <Stack
                direction="row"
                justifyContent="space-evenly"
            >
                <ClickableIcon
                    iconSrc="/images/icons/rated.png"
                    hasTheme={false}
                    size={width <= 440 ? "medium" : "large"}
                />

                <Title
                    headingNumber={2}
                    text={t("ratings")}
                />

                <ClickableIcon
                    iconSrc="/images/icons/rated.png"
                    hasTheme={false}
                    size={width <= 440 ? "medium" : "large"}
                />
            </Stack>

            {ratingsInfoError ? (
                <p
                    style={{ textAlign: "center", hyphens: "none" }}
                >
                    {t("ratingsStatsErrorAlert")}
                </p>
            ) : (
                ratingsInfo?.top3?.length !== 0 ? (
                    <Stack
                        gap="5em"
                    >
                        {(ratingsInfo?.top3?.length && ratingsInfo?.top3[0]) && (
                            <Stack
                                gap="3em"
                            >
                                <Stack>
                                    <Title
                                        headingNumber={3}
                                        text={t("ranking")}
                                        varColor="--light-theme-color"
                                    />

                                    <p
                                        style={{ textAlign: "center", hyphens: "none" }}
                                    >
                                        {t("ratingRankingDescription")}
                                    </p>    
                                </Stack>

                                <Stack
                                    direction={width <= 640 ? "column" : "row"}
                                    alignItems="start"
                                    gap={width <= 640 ? "3em" : "1em"}
                                >
                                    {width <= 640 && (
                                        <TopComplaintAndRatingCardLogic
                                            topList={ratingsInfo?.top3}
                                            rank={1}
                                            isRating
                                        />
                                    )}

                                    <TopComplaintAndRatingCardLogic
                                        topList={ratingsInfo?.top3}
                                        rank={2}
                                        isRating
                                    />
                                    
                                    {width > 640 && (
                                        <TopComplaintAndRatingCardLogic
                                            topList={ratingsInfo?.top3}
                                            rank={1}
                                            isRating
                                        />
                                    )}
                                    
                                    <TopComplaintAndRatingCardLogic
                                        topList={ratingsInfo?.top3}
                                        rank={3}
                                        isRating
                                    />
                                </Stack>
                            </Stack>
                        )}
                        
                        <Stack
                            gap="3em"
                        >
                            <Stack>
                                <Stack
                                    direction="row"
                                    justifyContent="space-evenly"
                                >
                                    <ClickableIcon
                                        iconSrc="/images/icons/30days.png"
                                        hasTheme={false}
                                        size={width <= 440 ? "medium" : "large"}
                                    />

                                    <Title
                                        headingNumber={3}
                                        text={t("topRecent")}
                                        varColor="--light-theme-color"
                                    />

                                    <ClickableIcon
                                        iconSrc="/images/icons/30days.png"
                                        hasTheme={false}
                                        size={width <= 440 ? "medium" : "large"}
                                    />
                                </Stack>

                                <p
                                    style={{ textAlign: "center", hyphens: "none" }}
                                >
                                    {t("ratingTopRecentDescription")}
                                </p>    
                            </Stack>

                            {ratingsInfo?.recentTop ? (
                                <RankedRatingCard
                                    rating={ratingsInfo?.recentTop?.rating}
                                    comment={ratingsInfo?.recentTop?.comment}
                                    createDate={ratingsInfo?.recentTop?.createDate}
                                    likesNumber={ratingsInfo?.recentTop?.likesNumber}
                                    raterID={ratingsInfo?.recentTop?.raterID}
                                    raterName={ratingsInfo?.recentTop?.rater?.name}
                                    raterPhotoUrl={ratingsInfo?.recentTop?.rater?.photoUrl}
                                />
                            ) : (
                                <p
                                    style={{ textAlign: "center", hyphens: "none" }}
                                >
                                    {t("noTopRecentRating")}
                                </p>
                            )}
                        </Stack>

                        <Stack
                            direction={width <= 640 ? "column" : "row"}
                            gap={width <= 640 ? "5em" : "1em"}
                        >
                            {ratingsInfo?.topHighestScore && (
                                <Stack
                                    gap="3em"
                                >
                                    <Stack>
                                        <Stack
                                            direction="row"
                                            justifyContent="center"
                                        >
                                            <ClickableIcon
                                                iconSrc="/images/icons/happy.png"
                                                hasTheme={false}
                                                size={width <= 440 ? "medium" : "large"}
                                            />

                                            <Title
                                                headingNumber={3}
                                                text={t("bestRating")}
                                                varColor="--light-theme-color"
                                            />
                                        </Stack>

                                        <p
                                            style={{ textAlign: "center", hyphens: "none", fontSize: "var(--small-text-size)" }}
                                        >
                                            {t("bestRatingDescription")}
                                        </p>    
                                    </Stack>

                                    <RankedRatingCard
                                        rating={ratingsInfo?.topHighestScore?.rating}
                                        comment={ratingsInfo?.topHighestScore?.comment}
                                        createDate={ratingsInfo?.topHighestScore?.createDate}
                                        likesNumber={ratingsInfo?.topHighestScore?.likesNumber}
                                        raterID={ratingsInfo?.topHighestScore?.raterID}
                                        raterName={ratingsInfo?.topHighestScore?.rater?.name}
                                        raterPhotoUrl={ratingsInfo?.topHighestScore?.rater?.photoUrl}
                                    />
                                </Stack>
                            )}

                            {(width > 640 && ratingsInfo?.topLowestScore && ratingsInfo?.topHighestScore) && (
                                <span
                                    style={{ alignSelf: "stretch", width: "2px", backgroundColor: "var(--text-color)" }}
                                ></span>
                            )}
                        
                            {ratingsInfo?.topLowestScore && (
                                <Stack
                                    gap="3em"
                                >
                                    <Stack>
                                        <Stack
                                            direction="row"
                                            justifyContent="center"
                                        >
                                            <ClickableIcon
                                                iconSrc="/images/icons/sad3.png"
                                                hasTheme={false}
                                                size={width <= 440 ? "medium" : "large"}
                                            />

                                            <Title
                                                headingNumber={3}
                                                text={t("worstRating")}
                                                varColor="--light-theme-color"
                                            />
                                        </Stack>

                                        <p
                                            style={{ textAlign: "center", hyphens: "none", fontSize: "var(--small-text-size)" }}
                                        >
                                            {t("worstRatingDescription")}
                                        </p>    
                                    </Stack>

                                    <RankedRatingCard
                                        rating={ratingsInfo?.topLowestScore?.rating}
                                        comment={ratingsInfo?.topLowestScore?.comment}
                                        createDate={ratingsInfo?.topLowestScore?.createDate}
                                        likesNumber={ratingsInfo?.topLowestScore?.likesNumber}
                                        raterID={ratingsInfo?.topLowestScore?.raterID}
                                        raterName={ratingsInfo?.topLowestScore?.rater?.name}
                                        raterPhotoUrl={ratingsInfo?.topLowestScore?.rater?.photoUrl}
                                    />
                                </Stack>    
                            )}
                        </Stack>
                    </Stack>
                ) : (
                    <p
                        style={{ textAlign: "center", hyphens: "none" }}
                    >
                        {t("noRatingsFinded")}
                    </p>
                )
            )}
        </Stack>
    )
}

export default HomeRatingsContainer;