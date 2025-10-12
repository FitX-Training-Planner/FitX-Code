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
import { useState } from "react";
import BodyMuscles from "../../layout/BodyMuscles";

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
    weekMuscles,
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

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Stack
            className={styles.client_card}
        >
            <Stack
                className={styles.client_main_info}
                direction={width <= 440 ? "column" : "row"}
                alignItems={width <= 440 ? "center" : "end"}
            >
                <Stack
                    justifyContent="start"
                    className={styles.descriptioned_item}
                    direction={width <= 440 ? "column" : "row"}
                    gap={width <= 440 ? "0.5em" : "1em"}
                >
                    <PhotoInput
                        blobUrl={photoUrl}
                        disabled
                        size="small"
                    />     

                    <span
                        style={{ fontSize: "var(--large-text-size)" }}
                    >
                        {name}
                    </span>
                </Stack>
                
                {!["male", "female"].includes(sex) && (
                    <ClickableIcon
                        iconSrc={`/images/icons/${sex === "male" ? "male" : "female"}.png`}
                        name={t(sex)}
                        hasTheme={false}
                        size={width <= 440 ? "small" : "medium"}
                    />
                )}

                <ClickableIcon
                    iconSrc={`/images/icons/${isExpanded ? "exit" : "expand"}.png`}
                    handleClick={() => setIsExpanded(prevIsExpanded => !prevIsExpanded)}
                    size="tiny"
                    name={t(isExpanded ? "close" : "expand")}
                />
                
                <span
                    className={`${isActive ? styles.active : undefined} ${styles.active_badge}`}
                    title={isActive ? t("active") : t("deactive")}
                ></span>
            </Stack>

            {!isExpanded ? (
                <Stack
                    direction="row"
                    alignItems="start"
                >
                    {(weight || height || age) && (
                        <Stack>
                            {age && (
                                <Stack
                                    direction="row"
                                    justifyContent="start"
                                >
                                    <ClickableIcon
                                        iconSrc={`/images/icons/age.png`}
                                        size="small"
                                    />

                                    <span>
                                        {age} {t("years")}
                                    </span>
                                </Stack>
                            )}

                            {height && (
                                <Stack
                                    direction="row"
                                    justifyContent="start"
                                >
                                    <ClickableIcon
                                        iconSrc={`/images/icons/height.png`}
                                        size="small"
                                    />

                                    <span>
                                        {height} cm
                                    </span>
                                </Stack>
                            )}

                            {weight && (
                                <Stack
                                    direction="row"
                                    justifyContent="start"
                                >
                                    <ClickableIcon
                                        iconSrc={`/images/icons/weight.png`}
                                        size="small"
                                    />

                                    <span>
                                        {weight} Kg
                                    </span>
                                </Stack>
                            )}
                        </Stack>
                    )}

                    <Stack
                        extraStyles={{ textAlign: "end" }}
                    > 
                        <Stack
                            gap="0.2em"
                            alignItems="end"
                            className={styles.descriptioned_item}
                        >
                            <span>
                                {t("paymentPlan")}:
                            </span>
                            
                            {paymentPlanName ? (                        
                                <span>
                                    {paymentPlanName}
                                </span> 
                            ) : (
                                <p>
                                    {t("deletedPaymentPlanAlert")}
                                </p>
                            )}
                        </Stack>

                        <Stack
                            gap="0.2em"
                            alignItems="end"
                            className={styles.descriptioned_item}
                        >
                            <span
                                style={{ fontSize: width < 440 ? "var(--text-size)" : undefined }}
                            >
                                {t("endingOn")}:
                            </span>
                            
                            <span>
                                {formatDateToExtend(contractEndDate)}
                            </span>
                        </Stack>
                    </Stack>
                </Stack>
            ) : (
                <Stack
                    gap="3em"
                >
                    <Stack
                        gap="2em"
                    >
                        <Stack
                            direction={width <= 440 ? "column" : "row"}
                            gap="2em"
                            alignItems="start"
                            justifyContent="center"
                        >
                            {(availableDays || limitationsDescription) && (
                                <Stack>
                                    {availableDays && (
                                        <Stack
                                            direction="row"
                                            justifyContent="start"
                                        >
                                            <ClickableIcon
                                                iconSrc={`/images/icons/calendar.png`}
                                                size="small"
                                            />

                                            <span
                                                style={{ hyphens: "none" }}
                                            >
                                                {availableDays} {t("availableDays")}
                                            </span>
                                        </Stack>
                                    )}

                                    {limitationsDescription && (
                                        <Stack
                                            className={styles.limitations_description}
                                            alignItems="start"
                                            gap="0.5em"
                                        >
                                            <span>
                                                {t("limitations")}:
                                            </span>

                                            <p
                                                style={{ textAlign: "left", hyphens: "none" }}
                                            >
                                                {limitationsDescription}
                                            </p>
                                        </Stack>
                                    )}
                                </Stack>
                            )}

                            {weekMuscles.length !== 0 && (
                                <Stack
                                    className={styles.descriptioned_item}
                                >
                                    <span>
                                        {t("weaknesses")}
                                    </span>

                                    <BodyMuscles
                                        muscleGroups={weekMuscles}
                                        isMale={sex === "male"}
                                        figuresDirection="row"
                                    />
                                </Stack>
                            )}
                        </Stack>
                    </Stack>

                    <hr/>

                    <Stack
                        className={styles.descriptioned_item}
                        gap="2em"
                    >
                        <span
                            style={{ 
                                textAlign: "center", 
                                fontSize: width <= 640 ? "var(--large-text-size)" : "var(--small-title-size)",
                                color: "var(--light-theme-color)"   
                            }}
                        >
                            {t("trainingPlan")} 
                        </span>

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
                                            gap="0.5em"
                                            extraStyles={{ textAlign: "center" }}
                                        >
                                            <span>
                                                {trainingPlanName}
                                            </span>

                                            <span
                                                style={{ fontWeight: "bold" }}
                                            >
                                                ID {trainingPlanID}
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
                    </Stack>

                    <hr/>

                    <Stack
                        direction={width <= 440 ? "column" : "row"}
                        gap="3em"
                        alignItems="start"
                    >
                        <Stack
                            className={styles.descriptioned_item}
                            extraStyles={{ textAlign: "center", hyphens: "none" }}
                            gap="2em"
                        >
                            <span
                                style={{ 
                                    textAlign: "center", 
                                    fontSize: width <= 640 ? "var(--large-text-size)" : "var(--small-title-size)",
                                    color: "var(--light-theme-color)"   
                                }}
                            >
                                {t("paymentPlan")} 
                            </span>

                            {(paymentPlanName && paymentPlanFullPrice) ? (                        
                                <Stack
                                    className={styles.payment_plan_data}
                                >
                                    <span>
                                        {paymentPlanName}
                                    </span>

                                    <span>
                                        {formatPriceToBR(paymentPlanFullPrice)}
                                    </span>
                                </Stack>
                            ) : (
                                t("deletedPaymentPlanAlert")
                            )}
                        </Stack>

                        <Stack
                            className={styles.descriptioned_item}
                            gap="2em"
                        >
                            <span
                                style={{ 
                                    textAlign: "center", 
                                    fontSize: width <= 640 ? "var(--large-text-size)" : "var(--small-title-size)",
                                    color: "var(--light-theme-color)"   
                                }}
                            >
                                {t("contract")} 
                            </span>

                            <Stack
                                extraStyles={{ textAlign: "center" }}
                            >
                                <Stack
                                    gap="0.2em"
                                    className={styles.descriptioned_item}
                                >
                                    <span
                                        style={{ fontSize: width < 440 ? "var(--text-size)" : undefined }}
                                    >
                                        {t("startingOn")}
                                    </span>
                                    
                                    <span>
                                        {formatDateToExtend(contractStartDate)}
                                    </span>
                                </Stack>

                                <Stack
                                    gap="0.2em"
                                    className={styles.descriptioned_item}
                                >
                                    <span
                                        style={{ fontSize: width < 440 ? "var(--text-size)" : undefined }}
                                    >
                                        {t("endingOn")}:
                                    </span>
                                    
                                    <span>
                                        {formatDateToExtend(contractEndDate)}
                                    </span>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>

                    <hr/>

                    <Stack
                        className={styles.descriptioned_item}
                        gap="2em"
                    >
                        <span
                            style={{ 
                                textAlign: "center", 
                                fontSize: width <= 640 ? "var(--large-text-size)" : "var(--small-title-size)"
                            }}
                        >
                            {t("refundAndCancellation")} 
                        </span>
                        
                        <Stack
                            gap="2em"
                        >
                            <Stack
                                direction="row"
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
                                <span
                                    style={{ fontSize: "var(--large-text-size)" }}
                                >
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
                    </Stack>
                </Stack>
            )}
        </Stack>
    );
}

export default ActiveClientCard;