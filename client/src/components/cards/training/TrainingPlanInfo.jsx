import { useTranslation } from "react-i18next";
import Stack from "../../containers/Stack";
import Title from "../../text/Title";
import styles from "./TrainingCards.module.css";

function TrainingPlanInfo({
    children,
    planID,
    name,
    note,
    headingNumber,
    titleColor = "--text-color",
    bgTitleColor = "--bg-color" 
}) {
    const { t } = useTranslation();

    return (
        <Stack>
            <Stack
                gap="0.2em"
                className={styles.training_plan_title}
                extraStyles={{ backgroundColor: `var${bgTitleColor}` }}
            >          
                <Title
                    headingNumber={headingNumber}
                    text={name}
                    varColor={titleColor}
                />
                
                {planID && (
                    <span>
                        ID: {planID}
                    </span>
                )}    
            </Stack>

            {children}

            {note && (
                <p
                    className={styles.plan_note}
                >
                    <span>
                        {t("trainingPlanNote")}: 
                    </span>
                    
                    {` ${note}`}
                </p>
            )}
        </Stack>
    );
}

export default TrainingPlanInfo;