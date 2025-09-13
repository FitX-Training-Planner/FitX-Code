import Stack from "../../containers/Stack";
import PhotoInput from "../../form/fields/PhotoInput";
import styles from "./ClientCard.module.css";
import useWindowSize from "../../../hooks/useWindowSize";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import { formatPriceToBR } from "../../../utils/formatters/payments/formatOnChange";
import { useTranslation } from "react-i18next";
import Select from "../../form/fields/Select";
import { handleOnChangeSelect } from "../../../utils/handlers/changeHandlers";
import SubmitFormButton from "../../form/buttons/SubmitFormButton";
import { formatDateToExtend } from "../../../utils/formatters/text/formatDate";
import Alert from "../../messages/Alert";

function ActiveClientCard({
    isActive,
    name,
    photoUrl,
    sex,
    age,
    height,
    weight,
    limitationsDescription,
    availableDays,
    trainingPlanID,
    trainingPlanName,
    paymentPlanName,
    paymentPlanFullPrice,
    paymentPlanAppFee,
    contractStartDate,
    contractEndDate, 
    trainingPlans,
    handleRefund,
    handleOnModifyClientTrainingPlan,
    client, 
    setClient
}) {
    const { t } = useTranslation();

    const { width } = useWindowSize();

    const PaymentPlanContainer = () => {
        return (
            <Stack>
                <hr/>

                <Stack
                    direction="column-reverse"
                    className={styles.descriptioned_item}
                    gap="2em"
                >
                    <Stack
                        justifyContent="center"
                    >
                        {trainingPlans.length === 0 ? (
                            <p
                                style={{ textAlign: "center" }}
                            >
                                {t("noTrainerTrainingPlans")}
                            </p>
                        ) : (
                            <>
                                {trainingPlanID ? (    
                                    <Stack
                                        direction="row"
                                        alignItems="end"
                                    >
                                        <span>
                                            ID {trainingPlanID}
                                        </span>

                                        <span
                                            style={{ textAlign: "end" }}
                                        >
                                            {trainingPlanName}
                                        </span>
                                    </Stack>
                                ) : (
                                    <p
                                        style={{ textAlign: "center" }}
                                    >
                                        {t("noTrainingSendedTrainer")}
                                    </p>
                                )}

                                {isActive ? (
                                    <form
                                        onSubmit={handleOnModifyClientTrainingPlan}
                                    >
                                        <Stack
                                            alignItems="end"
                                        >
                                            <Select
                                                name="trainingPlan"
                                                placeholder={t("selectATrainingPlan")}
                                                value={trainingPlans.find(plan => String(plan.ID) === String(trainingPlanID))?.name}
                                                handleChange={(e) => handleOnChangeSelect(e, trainingPlans, "name", client, setClient)}
                                                options={trainingPlans.map(plan => plan.name)}
                                            />

                                            <SubmitFormButton
                                                text={t("modify")}
                                            />
                                        </Stack>
                                    </form>
                                ) : (
                                    <p
                                        style={{ textAlign: "center" }}
                                    >
                                        {t("clientDeactivateProfile")}
                                    </p>
                                )}
                            </>
                        )}
                    </Stack>

                    <span
                        style={{ 
                            textAlign: "center", 
                            hyphens: "none", 
                            fontSize: width <= 640 ? "var(--large-text-size)" : "var(--small-title-size)",
                            color: "var(--light-theme-color)"   
                        }}
                    >
                        {t("trainingPlan")} 
                    </span>
                </Stack>

                <hr/>
            </Stack>
        )
    }

    return (
        <Stack
            gap="2em"
            className={styles.client_card}
        >
            <Stack
                direction="row"
                className={styles.client_main_info}
                gap="2em"
            >
                <Stack
                    direction={width <= 440 ? "column" : "row"}
                    justifyContent="start"
                    alignItems={width <= 440 ? "start" : "center"}
                >
                    <PhotoInput
                        blobUrl={photoUrl}
                        disabled
                        size={width <= 640 ? (width <= 440 ? "tiny" : "small") : "medium"}
                    />         

                    <Stack
                        direction="column-reverse"
                        alignItems="start"
                        gap="0.5em"
                        className={`${styles.descriptioned_item} ${styles.client_name_container}`}
                    >
                        <ClickableIcon
                            iconSrc={`/images/icons/${sex === "male" ? "male" : "female"}.png`}
                            name={t(sex)}
                            hasTheme={false}
                            size={width <= 440 ? "small" : "medium"}
                        />

                        <span
                            style={{ fontSize: width <= 840 ? (width <= 440 ? "var(--text-size)" : "var(--large-text-size)") : "var(--small-title-size)" }}
                        >
                            {name}
                        </span>
                    </Stack>
                </Stack>

                {age && (
                    <Stack
                        direction="column-reverse"
                        gap="0.5em"
                        alignItems="end"
                        className={styles.descriptioned_item}
                    >
                        <span>
                            {t("years")}
                        </span>
                        
                        <span>
                            {age}
                        </span>
                    </Stack>
                )}
            </Stack>

            <Stack
                gap="2em"
            >
                <Stack
                    gap="2em"
                >
                    <Stack
                        direction="row"
                    >
                        <Stack>
                            {height && (
                                <Stack
                                    gap="0.5em"
                                    alignItems="start"
                                    className={styles.descriptioned_item}
                                >
                                    <span>
                                        {t("height")}:
                                    </span>
    
                                    <span
                                        style={{ fontSize: width <= 640 ? "var(--large-text-size)" : "var(--small-title-size)" }}
                                    >
                                        {height}
                                    </span>
                                </Stack>
                            )}
    
                            {weight && (
                                <Stack
                                    gap="0.5em"
                                    alignItems="start"
                                    className={styles.descriptioned_item}
                                >
                                    <span>
                                        {t("weight")}:
                                    </span>
    
                                    <span
                                        style={{ fontSize: width <= 640 ? "var(--large-text-size)" : "var(--small-title-size)" }}
                                    >
                                        {weight}
                                    </span>
                                </Stack>
                            )}
    
                            {availableDays && (
                                <Stack
                                    gap="0.5em"
                                    alignItems="start"
                                    className={styles.descriptioned_item}
                                >
                                    <span>
                                        {t("availableDays")}:
                                    </span>
    
                                    <span
                                        style={{ fontSize: width <= 640 ? "var(--large-text-size)" : "var(--small-title-size)" }}
                                    >
                                        {availableDays}
                                    </span>
                                </Stack>
                            )}
                        </Stack>

                        {width > 640 && (
                            <PaymentPlanContainer/>
                        )}
                    </Stack>

                    {limitationsDescription && (
                        <Stack
                            className={styles.limitations_description}
                            alignItems="start"
                            gap="0.5em"
                        >
                            <span>
                                {t("limitations")}:
                            </span>

                            <p>
                                {limitationsDescription}
                            </p>
                        </Stack>
                    )}
                </Stack>

                {width <= 640 && (
                    <PaymentPlanContainer/>
                )}

                <Stack>
                    <hr/>

                    <Stack
                        direction="column-reverse"
                        className={styles.descriptioned_item}
                    >
                        <Stack
                            direction="row"
                            justifyContent="center"
                            className={styles.payment_plan_data}
                        >
                            {paymentPlanName && paymentPlanFullPrice ? (                        
                                <span>
                                    {formatPriceToBR(paymentPlanFullPrice)}
                                </span>
                            ) : (
                                t("deletedPaymentPlanAlert")
                            )}
                        </Stack>

                        <span
                            style={{ 
                                textAlign: "center", 
                                hyphens: "none", 
                                fontSize: width <= 640 ? "var(--large-text-size)" : "var(--small-title-size)"   
                            }}
                        >
                            {t("paymentPlan")} 
                            
                            {paymentPlanName && ` "${paymentPlanName}"`}
                        </span>
                    </Stack>

                    <hr/>
                </Stack>

                <Stack>
                    <Stack>
                        <Stack
                            gap="0.5em"
                            alignItems="end"
                            className={styles.descriptioned_item}
                        >
                            <span>
                                {t("startingOn")}
                            </span>
                            
                            <span>
                                {formatDateToExtend(contractStartDate)}
                            </span>
                        </Stack>

                        <Stack
                            gap="0.5em"
                            alignItems="end"
                            className={styles.descriptioned_item}
                        >
                            <span>
                                {t("endingOn")}
                            </span>
                            
                            <span>
                                {formatDateToExtend(contractEndDate)}
                            </span>
                        </Stack>
                    </Stack>

                    <Stack>
                        <hr/>

                        <Stack
                            direction="column-reverse"
                            className={styles.descriptioned_item}
                        >
                            <Stack
                                justifyContent="center"
                                className={styles.payment_plan_data}
                                gap="2em"
                            >
                                <Stack
                                    direction="row"
                                    gap="0.5em"
                                >
                                    <Alert/>

                                    <p
                                        style={{ textAlign: "left", fontSize: "var(--small-text-size)" }}
                                    >
                                        {t("cancelContractTrainerAlert")}
                                    </p>
                                </Stack>

                                <Stack
                                    direction="row"
                                >
                                    <span>
                                        {formatPriceToBR(String(Number(paymentPlanFullPrice) + Number(paymentPlanAppFee)))}
                                    </span>

                                    <form
                                        onSubmit={handleRefund}
                                        style={{ width: "max-content" }}
                                    >
                                        <SubmitFormButton
                                            text={t("refundClient")}
                                            varBgColor="--alert-color"
                                        />
                                    </form>
                                </Stack>
                            </Stack>

                            <span
                                style={{ 
                                    textAlign: "center", 
                                    hyphens: "none", 
                                    fontSize: width <= 640 ? "var(--large-text-size)" : "var(--small-title-size)"   
                                }}
                            >
                                {t("refundAndCancellation")} 
                            </span>
                        </Stack>

                        <hr/>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
}

export default ActiveClientCard;