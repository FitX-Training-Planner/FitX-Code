import styles from "./BodyMuscles.module.css";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { translateDatabaseData } from "../../utils/formatters/text/translate";
import Stack from "../containers/Stack";

function BodyMuscles({
    muscleGroups,
    isMale,
    figuresDirection = "row",
    hasSecondaryMuscles = false
}) {
    const { t } = useTranslation();

    const user = useSelector(state => state.user);

    return (
        <Stack
            direction={figuresDirection}
            extraStyles={{ width: "max-content", maxWidth: "100%" }}
            gap="0"
        >
            <Stack
                className={styles.muscle_groups}
            >
                <img
                    src={`/images/body/${isMale ? "male" : "female"}/anterior_view.png`}
                    alt={t("anteriorBodyView")}
                    title={t("anteriorBodyView")}
                    style={{ filter: user.config.isDarkTheme ? "invert(1)" : "none" }}
                />

                {muscleGroups?.filter(group => !group.isPosteriorMuscle && (hasSecondaryMuscles ? true : group.isSelected)).map((group, index) => (
                    <img
                        key={index}
                        src={`/${isMale ? group.maleMedia?.url : group.femaleMedia?.url}${hasSecondaryMuscles ? (group.isPrimary ? "primary" : "secondary") : "primary"}.png`}
                        title={translateDatabaseData(group, "muscleGroups", "name", user, t)}
                        alt={translateDatabaseData(group, "muscleGroups", "name", user, t)}
                    />                    
                ))}
            </Stack>

            <Stack
                className={styles.muscle_groups}
            >
                <img
                    src={`/images/body/${isMale ? "male" : "female"}/posterior_view.png`}
                    alt={t("posteriorBodyView")}
                    title={t("posteriorBodyView")}
                    style={{ filter: user.config.isDarkTheme ? "invert(1)" : "none" }}
                />

                {muscleGroups?.filter(group => group.isPosteriorMuscle && (hasSecondaryMuscles ? true : group.isSelected)).map((group, index) => (
                    <img
                        key={index}
                        src={`/${isMale ? group.maleMedia?.url : group.femaleMedia?.url}${hasSecondaryMuscles ? (group.isPrimary ? "primary" : "secondary") : "primary"}.png`}
                        title={translateDatabaseData(group, "muscleGroups", "name", user, t)}
                        alt={translateDatabaseData(group, "muscleGroups", "name", user, t)}
                        style={{ zIndex: !isMale && group.name === "Glúteos" ? "2" : "1"}}
                    />                    
                ))}
            </Stack>
        </Stack>
    );
}

export default BodyMuscles;