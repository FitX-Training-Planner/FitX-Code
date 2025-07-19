import { useTranslation } from "react-i18next";
import Stack from "../../containers/Stack";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import SetInfo from "./SetInfo";

function SetCard({
    restSeconds,
    durationSeconds,
    trainingTechniqueName,
    setTypeName,
    minReps,
    maxReps,
    orderInExercise,
    headingNumber,
    handleModifySet,
    handleRemoveSet,
    handleDuplicateSet
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
                    handleClick={handleModifySet}
                    size="small"
                />

                <ClickableIcon
                    iconSrc="/images/icons/remove.png"
                    name={t("remove")}
                    handleClick={handleRemoveSet}
                    size="small"
                />
            </Stack>

            <hr/>

            <SetInfo
                orderInExercise={orderInExercise}
                minReps={minReps}
                maxReps={maxReps}
                durationSeconds={durationSeconds}
                restSeconds={restSeconds}
                setTypeName={setTypeName}
                trainingTechniqueName={trainingTechniqueName}
                headingNumber={headingNumber}
            />

            <hr/>

            <ClickableIcon
                iconSrc="/images/icons/duplicate.png"
                name={t("duplicate")}
                handleClick={handleDuplicateSet}
                size="small"
            />
        </Stack>
    );
}

export default SetCard;