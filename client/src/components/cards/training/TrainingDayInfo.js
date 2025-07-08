import Stack from "../../containers/Stack";
import Title from "../../text/Title";
import styles from "./TrainingCards.module.css";

function TrainingDayInfo({
    children,
    name,
    orderInPlan,
    note,
    headingNumber,
    titleColor = "--text-color",
    bgTitleColor = "--bg-color" 
}) {
    return (
        <Stack>
            <Stack
                gap="0.2em"
                className={styles.item_title}
                extraStyles={{ backgroundColor: `var${bgTitleColor}` }}
            >              
                <span>
                    Dia {orderInPlan}
                </span>

                <Title
                    headingNumber={headingNumber}
                    text={name}
                    varColor={titleColor}
                />
            </Stack>

            <hr/>

            {children}

            {note && 
                <p
                    className={styles.note}
                >
                    <span>
                        Nota do dia: 
                    </span>
                    
                    {` ${note}`}
                </p>
            }
        </Stack>
    );
}

export default TrainingDayInfo;