import useWindowSize from "../../hooks/useWindowSize";
import Stack from "../containers/Stack";
import ClickableIcon from "../form/buttons/ClickableIcon";
import RankedComplaintCard from "../cards/user/RankedComplaintCard";
import { useMemo } from "react";
import RankedRatingCard from "../cards/user/RankedRatingCard";

function TopComplaintAndRatingCardLogic({
    topList,
    rank,
    isRating = false
}) {
    const { width } = useWindowSize();

    const topElement = useMemo(() => {
        return topList?.length ? topList[rank - 1] : undefined;
    }, [topList, rank]);

    return (
        <Stack
            extraStyles={{ 
                marginTop: width <= 640 ? undefined : `${5 * (rank - 1)}em`
            }}
        >
            <ClickableIcon
                iconSrc={`/images/icons/top${rank}.png`}
                name={`Top ${rank}`}
                hasTheme={false}
                size="large"
            />

            {topElement && (
                <Stack
                    extraStyles={
                        width <= 640 && width > 440 
                        ? { width: "80%", marginLeft: rank === 3 ? "auto" : "0", marginRight: rank === 2 ? "auto" : "0" }
                        : undefined
                    }
                >
                    {isRating ? (
                        <RankedRatingCard
                            rating={topElement.rating}
                            comment={topElement.comment}
                            createDate={topElement.createDate}
                            likesNumber={topElement.likesNumber}
                            raterID={topElement.raterID}
                            raterName={topElement.rater?.name}
                            raterPhotoUrl={topElement.rater?.photoUrl}
                        />
                    ) : (
                        <RankedComplaintCard
                            reason={topElement.reason}
                            createDate={topElement.createDate}
                            likesNumber={topElement.likesNumber}
                            complainterID={topElement.complainterID}
                            complainterName={topElement.complainter?.name}
                            complainterPhotoUrl={topElement.complainter?.photoUrl}
                        />
                    )}
                </Stack>
            )}
        </Stack>
    )
}

export default TopComplaintAndRatingCardLogic;