import { useTranslation } from "react-i18next";
import Stack from "../../containers/Stack";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import ExerciseInfo from "./ExerciseInfo";

function ExerciseCard({
    sets,
    exerciseName,
    exerciseEquipmentName,
    pulleyHeightDescription,
    pulleyAttachmentName,
    gripTypeName,
    gripWidthDescription,
    bodyPositionDescription,
    lateralityType,
    note,
    headingNumber,
    handleModifyExercise,
    handleRemoveExercise,
    handleDuplicateExercise
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
                    handleClick={handleModifyExercise}
                    size="small"
                />

                <ClickableIcon
                    iconSrc="/images/icons/remove.png"
                    name={t("remove")}
                    handleClick={handleRemoveExercise}
                    size="small"
                />
            </Stack>

            <hr/>

            <ExerciseInfo
                sets={sets}
                exerciseName={exerciseName}
                exerciseEquipmentName={exerciseEquipmentName}
                pulleyHeightDescription={pulleyHeightDescription}
                pulleyAttachmentName={pulleyAttachmentName}
                gripTypeName={gripTypeName}
                gripWidthDescription={gripWidthDescription}
                bodyPositionDescription={bodyPositionDescription}
                lateralityType={lateralityType}
                note={note}
                maxNoteLines={5}
                headingNumber={headingNumber}
            />

            <hr/>

            <ClickableIcon
                iconSrc="/images/icons/duplicate.png"
                name={t("duplicate")}
                handleClick={handleDuplicateExercise}
                size="small"
            />
        </Stack>
    );
}

export default ExerciseCard;