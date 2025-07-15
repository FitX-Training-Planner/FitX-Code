import Stack from "../../containers/Stack";
import PhotoInput from "../../form/fields/PhotoInput";
import styles from "./SmallTrainerProfessionalCard.module.css";
import useWindowSize from "../../../hooks/useWindowSize";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import FlexWrap from "../../containers/FlexWrap";
import { formatPriceToBR } from "../../../utils/formatters/payments/formatOnChange";
import React from "react";
import { formatNumberShort } from "../../../utils/formatters/text/formatNumber";

function SmallTrainerProfessionalCard({
    name,
    photoUrl,
    crefNumber,
    rate,
    contractsNumber,
    complaintsNumber,
    paymentPlans,
    handleExpand
}) {
    const { width } = useWindowSize();

    return (
        <Stack
            direction="column"
            className={styles.small_professional_card}
        >
            <Stack
                alignItems="end"
            >
                <ClickableIcon
                    iconSrc="/images/icons/expand.png"
                    name="Ver Perfil"
                    handleClick={handleExpand}
                    size="small"
                />
            </Stack>

            <Stack
                gap="0.5em"
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
                    <span>
                        CREF {crefNumber}
                    </span>
                )}
            </Stack>

            <hr/>

            <Stack
                direction="row"
            >
                <Stack
                    direction="row"
                    gap="0.5em"
                    justifyContent="center"
                >
                    <ClickableIcon
                        iconSrc="/images/icons/rated.png"
                        name="Nota Média"
                        size={width <= 440 ? "small" : "medium"}
                        hasTheme={false}
                    />

                    <span>
                        {formatNumberShort(rate)}
                    </span>
                </Stack>

                <Stack
                    direction="row"
                    gap="0.5em"
                    justifyContent="center"
                >
                    <ClickableIcon
                        iconSrc="/images/icons/contracts.png"
                        name="Contratações"
                        size={width <= 440 ? "small" : "medium"}
                        hasTheme={false}
                    />

                    <span>
                        {formatNumberShort(contractsNumber)}
                    </span>
                </Stack>

                <Stack
                    direction="row"
                    gap="0.5em"
                    justifyContent="center"
                >
                    <ClickableIcon
                        iconSrc="/images/icons/complaints.png"
                        name="Denúncias"
                        size={width <= 440 ? "small" : "medium"}
                        hasTheme={false}
                    />

                    <span>
                        {formatNumberShort(complaintsNumber)}
                    </span>
                </Stack>
            </Stack>

            {paymentPlans.length !== 0 && (
                <hr/>
            )}

            {paymentPlans.length !== 0 ? (
                <Stack
                    className={styles.payment_plans_container}
                    gap="2em"
                >
                    <span>
                        Planos
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
                                            {plan.durationDays} dias
                                        </span>
                                    </Stack>
                                </Stack>
                            </React.Fragment>
                        ))}
                    </FlexWrap>
                </Stack>
            ) : (
                <p>
                    O treinador ainda não possui nenhum plano de pagamento
                </p>
            )}
        </Stack>
    );
}

export default SmallTrainerProfessionalCard;