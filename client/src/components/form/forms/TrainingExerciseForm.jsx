import { useCallback, useMemo, useState } from "react";
import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import ClickableIcon from "../buttons/ClickableIcon";
import styles from "./TrainingForm.module.css";
import TextArea from "../fields/TextArea";
import { formattNameAndNote } from "../../../utils/formatters/training/formatOnChange";
import { isNoteValid } from "../../../utils/validators/trainingValidator";
import Select from "../fields/Select";
import SortableItem from "../../sortable/SortableItem";
import Title from "../../text/Title";
import { handleOnChangeSelect, handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import DndContextContainer from "../../sortable/DndContextContainer";
import useWindowSize from "../../../hooks/useWindowSize";
import SetCard from "../../cards/training/SetCard";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function TrainingExerciseForm({
    exercise,
    setExercise,
    setExerciseError,
    handleSubmit,
    handleAddSet,
    handleDuplicateSet,
    handleModifySet,
    handleRemoveSet,
    exercises,
    exerciseEquipments,
    bodyPositions,
    pulleyHeights,
    pulleyAttachments,
    gripTypes,
    gripWidths,
    lateralities
}) {
    const { t } = useTranslation();

    const user = useSelector(state => state.user);

    const { width } = useWindowSize();
    
    const arrays = useMemo(() => ({
        "exercises": exercises,
        "exerciseEquipments": exerciseEquipments,
        "bodyPositions": bodyPositions,
        "pulleyHeights": pulleyHeights,
        "pulleyAttachments": pulleyAttachments,
        "gripTypes": gripTypes,
        "gripWidths": gripWidths,
        "lateralities": lateralities
    }), [bodyPositions, exerciseEquipments, exercises, gripTypes, gripWidths, lateralities, pulleyAttachments, pulleyHeights]);
    
    const [errors, setErrors] = useState({
        note: false
    });

    const handleOnChangeExercise = useCallback((e) => {
        handleOnChangeSelect(e, arrays.exercises, "name", exercise, setExercise, setExerciseError);

        if (exercises.find(ex => ex.name === e.target.value)?.isFixed) {
            setExercise(prevExercise => ({
                ...prevExercise,
                exerciseEquipment: null,
                bodyPosition: null,
                pulleyHeight: null,
                pulleyAttachment: null,
                gripType: null,
                gripWidth: null,
                laterality: null
            }));
        }
    }, [arrays.exercises, exercise, exercises, setExercise, setExerciseError]);

    return (
        <form
            onSubmit={handleSubmit}
        >
            <Stack
                gap="3em"
            >
                <p>
                    - {t("mandatoryFields")}
                </p>
                
                <Stack>
                    <Stack
                        gap="2em"
                    >
                        <Title
                            headingNumber={3}
                            text={t("sets")}
                        />

                        <Stack>
                            <DndContextContainer
                                stackDirection={
                                    width <= 640 ? (                                
                                        exercise.sets.length <= 3 
                                        ? "row"
                                        : "column"
                                    ) : (
                                        exercise.sets.length <= 4 
                                        ? "row" 
                                        : "column"
                                    )
                                }
                                itemsClassName={styles.sets}
                                items={exercise.sets}
                                orderPropName="orderInExercise"
                                setObjectWithSortables={setExercise}
                                sortablesPropName="sets"
                            >
                                {exercise.sets
                                    .sort((a, b) => a.orderInExercise - b.orderInExercise)
                                    .map(set => (
                                        <SortableItem
                                            key={set.ID} 
                                            id={String(set.ID)}
                                        >
                                            <SetCard
                                                restSeconds={set.restSeconds}
                                                durationSeconds={set.durationSeconds}
                                                setTypeName={
                                                    set.setType?.ID
                                                    ? (
                                                        user.config.isEnglish 
                                                        ? t(`databaseData.setTypes.${set.setType.ID}.name`) 
                                                        : set.setType.name
                                                    )
                                                    : undefined
                                                }
                                                trainingTechniqueName={
                                                    set.trainingTechnique?.ID
                                                    ? (
                                                        user.config.isEnglish 
                                                        ? t(`databaseData.trainingTechniques.${set.trainingTechnique.ID}.name`) 
                                                        : set.trainingTechnique.name
                                                    )
                                                    : undefined
                                                }
                                                minReps={set.minReps}
                                                maxReps={set.maxReps}
                                                orderInExercise={set.orderInExercise}
                                                headingNumber={4}
                                                handleModifySet={() => handleModifySet(set)}
                                                handleRemoveSet={() => handleRemoveSet(set.orderInExercise)}
                                                handleDuplicateSet={() => handleDuplicateSet(set)}
                                            />
                                        </SortableItem>
                                    ))
                                }
                            </DndContextContainer>

                            <ClickableIcon
                                iconSrc="/images/icons/add.png"
                                name={t("addSet")}
                                handleClick={handleAddSet}
                            />
                        </Stack>
                    </Stack>

                    <Select
                        name="exercise"
                        placeholder={t("exercisePlaceholder")}
                        labelText={`${t("exercise")} *`}
                        value={exercises.find(ex => String(ex.ID) === String(exercise.exercise?.ID))?.name}
                        handleChange={handleOnChangeExercise}
                        options={exercises.map(ex => ex.name)}    
                    />

                    {!exercise.exercise?.isFixed ? (
                        <>
                            <Select
                                name="exerciseEquipment"
                                placeholder={t("exerciseEquipmentPlaceholder")}
                                labelText={`${t("exerciseEquipment")} *`}
                                value={exerciseEquipments.find(equipment => String(equipment.ID) === String(exercise.exerciseEquipment?.ID))?.name}
                                handleChange={(e) => {
                                    handleOnChangeSelect(e, arrays.exerciseEquipments, "name", exercise, setExercise, setExerciseError);
                                    setExercise(prevExercise => ({ ...prevExercise, pulleyHeight: {}, pulleyAttachment: {} }));
                                }}
                                options={exerciseEquipments.map(equipment => equipment.name)}    
                            />

                            <Select
                                name="bodyPosition"
                                placeholder={t("bodyPositionPlaceholder")}
                                labelText={t("bodyPosition")}
                                value={bodyPositions.find(position => String(position.ID) === String(exercise.bodyPosition?.ID))?.description}
                                handleChange={(e) => handleOnChangeSelect(e, arrays.bodyPositions, "description", exercise, setExercise, setExerciseError)}
                                options={bodyPositions.map(position => position.description)}    
                            />

                            {exercise.exerciseEquipment?.name.toLowerCase() === "polia" && (
                                <Stack
                                    direction={width <= 440 ? "column" : "row"}
                                    alignItems="end"
                                >
                                    <Select
                                        name="pulleyHeight"
                                        placeholder={t("pulleyHeightPlaceholder")}
                                        labelText={t("pulleyHeight")}
                                        value={pulleyHeights.find(height => String(height.ID) === String(exercise.pulleyHeight?.ID))?.description}
                                        handleChange={(e) => handleOnChangeSelect(e, arrays.pulleyHeights, "description", exercise, setExercise, setExerciseError)}
                                        options={pulleyHeights.map(height => height.description)}    
                                    />

                                    <Select
                                        name="pulleyAttachment"
                                        placeholder={t("pulleyAttachmentPlaceholder")}
                                        labelText={t("pulleyAttachment")}
                                        value={pulleyAttachments.find(attachment => String(attachment.ID) === String(exercise.pulleyAttachment?.ID))?.name}
                                        handleChange={(e) => handleOnChangeSelect(e, arrays.pulleyAttachments, "name", exercise, setExercise, setExerciseError)}
                                        options={pulleyAttachments.map(attachment => attachment.name)}    
                                    />
                                </Stack>
                            )} 

                            <Stack
                                direction={width <= 440 ? "column" : "row"}
                                alignItems="end"
                            >
                                <Select
                                    name="gripType"
                                    placeholder={t("gripTypePlaceholder")}
                                    labelText={t("gripType")}
                                    value={gripTypes.find(type => String(type.ID) === String(exercise.gripType?.ID))?.name}
                                    handleChange={(e) => handleOnChangeSelect(e, arrays.gripTypes, "name", exercise, setExercise, setExerciseError)}
                                    options={gripTypes.map(type => type.name)}    
                                />

                                <Select
                                    name="gripWidth"
                                    placeholder={t("gripWidthPlaceholder")}
                                    labelText={t("gripWidth")}
                                    value={gripWidths.find(width => String(width.ID) === String(exercise.gripWidth?.ID))?.description}
                                    handleChange={(e) => handleOnChangeSelect(e, arrays.gripWidths, "description", exercise, setExercise, setExerciseError)}
                                    options={gripWidths.map(width => width.description)}    
                                />
                            </Stack>

                            <Select
                                name="laterality"
                                placeholder={t("lateralityPlaceholder")}
                                labelText={t("laterality")}
                                value={lateralities.find(laterality => String(laterality.ID) === String(exercise.laterality?.ID))?.type}
                                handleChange={(e) => handleOnChangeSelect(e, arrays.lateralities, "type", exercise, setExercise, setExerciseError)}
                                options={lateralities.map(laterality => laterality.type)}    
                            />
                        </>
                    ) : (
                        <p
                            className={styles.exercise_alert}
                        >
                            {t("impersonalizableExercise")}
                        </p>
                    )}

                    <TextArea
                        name="note"
                        placeholder={t("notePlaceholder")}
                        labelText={t("note")}
                        value={exercise.note}
                        handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, isNoteValid, exercise, setExercise, setExerciseError, setErrors)}
                        alertMessage={t("alertNote500")}
                        error={errors.note}
                        maxLength={500}
                    />
                </Stack>

                <SubmitFormButton
                    text={t("createExercise")}
                />
            </Stack>
        </form>
    );
}

export default TrainingExerciseForm;