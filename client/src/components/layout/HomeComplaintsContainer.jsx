import { useTranslation } from "react-i18next";
import useWindowSize from "../../hooks/useWindowSize";
import Stack from "../containers/Stack";
import ClickableIcon from "../form/buttons/ClickableIcon";
import Title from "../text/Title";
import RankedComplaintCard from "../cards/user/RankedComplaintCard";
import TopComplaintAndRatingCardLogic from "./TopComplaintAndRatingCard";

function HomeComplaintsContainer({
    complaintsInfo,
    complaintsInfoError
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
                    iconSrc="/images/icons/complaints.png"
                    hasTheme={false}
                    size={width <= 440 ? "medium" : "large"}
                />

                <Title
                    headingNumber={2}
                    text={t("complaints")}
                />

                <ClickableIcon
                    iconSrc="/images/icons/complaints.png"
                    hasTheme={false}
                    size={width <= 440 ? "medium" : "large"}
                />
            </Stack>

            {complaintsInfoError ? (
                <p
                    style={{ textAlign: "center", hyphens: "none" }}
                >
                    {t("complaintsStatsErrorAlert")}
                </p>
            ) : (
                complaintsInfo?.top3?.length !== 0 ? (
                    <Stack
                        gap="5em"
                    >
                        {(complaintsInfo?.top3?.length && complaintsInfo?.top3[0]) && (
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
                                        {t("complaintRankingDescription")}
                                    </p>    
                                </Stack>

                                <Stack
                                    direction={width <= 640 ? "column" : "row"}
                                    alignItems="start"
                                    gap={width <= 640 ? "3em" : "1em"}
                                >
                                    {width <= 640 && (
                                        <TopComplaintAndRatingCardLogic
                                            topList={complaintsInfo?.top3}
                                            rank={1}
                                        />
                                    )}

                                    <TopComplaintAndRatingCardLogic
                                        topList={complaintsInfo?.top3}
                                        rank={2}
                                    />
                                    
                                    {width > 640 && (
                                        <TopComplaintAndRatingCardLogic
                                            topList={complaintsInfo?.top3}
                                            rank={1}
                                        />
                                    )}
                                    
                                    <TopComplaintAndRatingCardLogic
                                        topList={complaintsInfo?.top3}
                                        rank={3}
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
                                    {t("complaintTopRecentDescription")}
                                </p>    
                            </Stack>

                            {complaintsInfo?.recentTop ? (
                                <RankedComplaintCard
                                    reason={complaintsInfo?.recentTop?.reason}
                                    createDate={complaintsInfo?.recentTop?.createDate}
                                    likesNumber={complaintsInfo?.recentTop?.likesNumber}
                                    complainterID={complaintsInfo?.recentTop?.complainterID}
                                    complainterName={complaintsInfo?.recentTop?.complainter?.name}
                                    complainterPhotoUrl={complaintsInfo?.recentTop?.complainter?.photoUrl}
                                />
                            ) : (
                                <p
                                    style={{ textAlign: "center", hyphens: "none" }}
                                >
                                    {t("noTopRecentComplaint")}
                                </p>
                            )}
                        </Stack>
                    </Stack>
                ) : (
                    <p
                        style={{ textAlign: "center", hyphens: "none" }}
                    >
                        {t("noComplaintsFinded")}
                    </p>
                )
            )}
        </Stack>
    )
}

export default HomeComplaintsContainer;