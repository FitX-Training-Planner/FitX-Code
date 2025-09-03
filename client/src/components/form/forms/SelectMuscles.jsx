import styles from "./SelectMuscles.module.css";
import Stack from "../../containers/Stack";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import SelectBoxes from "../fields/SelectBoxes";

function SelectMuscles({
    muscleGroups,
    setMuscleGroups,
    isMale,
    figuresDirection = "row"
}) {
    const { t } = useTranslation();

    const user = useSelector(state => state.user);

    return (
        <Stack
            direction="row"
            justifyContent="center"
        >
            <SelectBoxes
                options={muscleGroups}
                setOptions={setMuscleGroups}
                isMultipleSelects
            />
            
            <Stack
                direction={figuresDirection}
                extraStyles={{ width: "max-content" }}
                gap="0"
            >
                <Stack
                    className={styles.muscle_groups_select}
                >
                    <img
                        src={`/images/body/${isMale ? "male" : "female"}/anterior_view.png`}
                        alt={t("anteriorBodyView")}
                        title={t("anteriorBodyView")}
                        style={{ filter: user.config.isDarkTheme ? "invert(1)" : "none" }}
                    />

                    {muscleGroups?.filter(group => !group.isPosteriorMuscle && group.isSelected).map((group, index) => (
                        <img
                            key={index}
                            src={`/${isMale ? group.maleMedia?.url : group.femaleMedia?.url}primary.png`}
                            title={
                                user.config.isEnglish 
                                ? t(`databaseData.muscleGroups.${group.ID}.name`) 
                                : group.name
                            }
                            alt={
                                user.config.isEnglish 
                                ? t(`databaseData.muscleGroups.${group.ID}.name`) 
                                : group.name
                            }
                        />                    
                    ))}
                </Stack>

                <Stack
                    className={styles.muscle_groups_select}
                >
                    <img
                        src={`/images/body/${isMale ? "male" : "female"}/posterior_view.png`}
                        alt={t("posteriorBodyView")}
                        title={t("posteriorBodyView")}
                        style={{ filter: user.config.isDarkTheme ? "invert(1)" : "none" }}
                    />

                    {muscleGroups?.filter(group => group.isPosteriorMuscle && group.isSelected).map((group, index) => (
                        <img
                            key={index}
                            src={`/${isMale ? group.maleMedia?.url : group.femaleMedia?.url}primary.png`}
                            title={
                                user.config.isEnglish 
                                ? t(`databaseData.muscleGroups.${group.ID}.name`) 
                                : group.name
                            }
                            alt={
                                user.config.isEnglish 
                                ? t(`databaseData.muscleGroups.${group.ID}.name`) 
                                : group.name
                            }
                            style={{ zIndex: !isMale && group.name === "Glúteos" ? "2" : "1"}}
                        />                    
                    ))}
                </Stack>
            </Stack>
        </Stack>
    );
}

export default SelectMuscles;