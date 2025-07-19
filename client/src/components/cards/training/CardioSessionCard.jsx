import { useTranslation } from "react-i18next";
import Stack from "../../containers/Stack";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import CardioSessionInfo from "./CardioSessionInfo";

function CardioSessionCard({
    usedID,
    note,
    cardioOptionName,
    cardioIntensityType,
    durationMinutes,
    sessionTime,
    headingNumber,
    handleModifyCardioSession,
    handleRemoveCardioSession,
    handleDuplicateCardioSession
}) {
    const { t } = useTranslation();

    return (
        <Stack>
            <Stack
                direction="row"
                gap="0.5em"
            >
                <ClickableIcon
                    iconSrc="/images/icons/edit.png"
                    name={t("edit")}
                    handleClick={handleModifyCardioSession}
                    size="small"
                />

                <ClickableIcon
                    iconSrc="/images/icons/remove.png"
                    name={t("remove")}
                    handleClick={handleRemoveCardioSession}
                    size="small"
                />
            </Stack>

            <hr/>

            <CardioSessionInfo
                usedID={usedID}
                note={note}
                cardioOptionName={cardioOptionName}
                cardioIntensityType={cardioIntensityType}
                durationMinutes={durationMinutes}
                sessionTime={sessionTime}
                headingNumber={headingNumber}
            />

            <hr/>
            
            <ClickableIcon
                iconSrc="/images/icons/duplicate.png"
                name={t("duplicate")}
                handleClick={handleDuplicateCardioSession}
                size="small"
            />
        </Stack>
    );
}

export default CardioSessionCard;