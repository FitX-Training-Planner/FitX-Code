import Stack from "../../containers/Stack";
import PhotoInput from "../../form/fields/PhotoInput";
import styles from "./SmallTrainerProfessionalCard.module.css";
import useWindowSize from "../../../hooks/useWindowSize";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import FlexWrap from "../../containers/FlexWrap";
import { formatPriceToBR } from "../../../utils/formatters/payments/formatOnChange";
import React from "react";
import { useTranslation } from "react-i18next";
import TrainerCRCInfo from "../../layout/TrainerCRCInfo";
import Alert from "../../messages/Alert";

function SmallTrainerProfessionalCard({
    name,
    photoUrl,
    crefNumber,
    rate,
    contractsNumber,
    complaintsNumber,
    paymentPlans,
    handleExpand,
    handleSave,
    canBeContracted,
    hasSaved
}) {
    const { t } = useTranslation();

    const { width } = useWindowSize();

    return (
        <Stack
            direction="column"
            className={styles.small_professional_card}
        >
            <Stack
                direction="row"
            >
                <ClickableIcon
                    iconSrc={`/images/icons/${hasSaved ? "saved" : "save"}.png`}
                    name={t("saveTrainer")}
                    handleClick={handleSave}
                    size="small"
                />

                <ClickableIcon
                    iconSrc="/images/icons/expand.png"
                    name={t("seeProfile")}
                    handleClick={handleExpand}
                    size="small"
                />
            </Stack>

            <Stack
                // gap="0.5em"
                alignItems="start"
                direction={width <= 640 ? "column" : "row"}
                className={styles.professional_name_container}
            >
                <Stack
                    direction={width <= 640 ? "column" : "row"}
                    className={styles.descriptioned_item}
                    justifyContent={width <= 640 ? "center" : "start"}
                >
                    <PhotoInput
                        blobUrl={photoUrl}
                        disabled
                        size={width <= 440 ? "small" : "medium"}
                    />

                    <span>
                        {name}
                    </span>
                </Stack>

                {crefNumber && (
                    <Stack
                        direction={width <= 440 ? "column" : "row"}
                        justifyContent={width <= 640 ? "center" : "end"}
                        gap="0.5em"
                    >
                        CREF

                        <span>
                            {crefNumber}
                        </span>
                    </Stack>
                )}
            </Stack>

            <TrainerCRCInfo
                rate={rate}
                complaintsNumber={complaintsNumber}
                contractsNumber={contractsNumber}
            />

            {paymentPlans.length !== 0 ? (
                <Stack
                    className={styles.payment_plans_container}
                    gap="2em"
                >
                    <span>
                        {t("paymentPlans")}
                    </span>

                    <FlexWrap
                        maxElements={width <= 640 ? (width <= 440 ? 2 : 3) : 4} 
                        direction="row" 
                        alignItems="center" 
                        justifyContent="center" 
                        uniformWidth={false}
                    >
                        {paymentPlans.map((plan, index) => (
                            <React.Fragment
                                key={index}
                            >
                                <Stack>
                                    <Stack
                                        gap="0.2em"
                                        className={styles.payment_plan_info}
                                    >
                                        <span>
                                            {formatPriceToBR(plan.fullPrice)}
                                        </span>

                                        <span>
                                            {plan.durationDays} {t("days")}
                                        </span>
                                    </Stack>
                                </Stack>
                            </React.Fragment>
                        ))}
                    </FlexWrap>

                    {!canBeContracted && (
                        <Stack>
                            <hr/>

                            <Stack
                                direction="row"
                                justifyContent="center"
                                className={styles.trainer_cannot_be_contracted}
                            >
                                <Alert
                                    varColor="--light-theme-color"
                                />

                                {t("trainerCannotBeContracted")}
                            </Stack>

                            <hr/>
                        </Stack>
                    )}
                </Stack>
            ) : (
                <p>
                    {t("noTrainerPaymentPlans")}
                </p>
            )}
        </Stack>
    );
}

export default SmallTrainerProfessionalCard;