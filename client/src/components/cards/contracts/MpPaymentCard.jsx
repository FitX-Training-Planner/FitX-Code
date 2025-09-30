import { useTranslation } from "react-i18next";
import { formatPriceToBR } from "../../../utils/formatters/payments/formatOnChange";
import { formatDateToExtend } from "../../../utils/formatters/text/formatDate";
import Stack from "../../containers/Stack";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import Alert from "../../messages/Alert";
import styles from "./ContractCard.module.css";
import GenericCard from "../GenericCard";
import useWindowSize from "../../../hooks/useWindowSize";

function MpPaymentCard({
    mercadopagoTransactionID,
    createDate,
    mpFee,
    trainerReceived,
    payerEmail
}) {
    const { t, i18n } = useTranslation();

    const { width } = useWindowSize();
    
    return (
        <GenericCard
            border="2px solid var(--light-theme-color)"
            padding="0.5em 1em"
            boxShadow="-5px 5px 5px var(--gray-color)"
        >
            <Stack
                direction="row"
            >
                <ClickableIcon
                    iconSrc="/images/icons/mercadopago.png"
                    size="large"
                    hasTheme={false}
                />

                <Stack
                    alignItems="end"
                    extraStyles={{ overflowX: "hidden" }}
                >
                    <span
                        className={styles.small_item}
                        style={{ textAlign: "end" }}
                    >
                        {formatDateToExtend(createDate, i18n.language)}
                    </span>

                    <Stack
                        alignItems="start"
                    >
                        <Stack>
                            <Stack
                                alignItems="start"
                                gap="0.5em"
                            >
                                <span
                                    className={styles.mp_payment_value}
                                >
                                    {formatPriceToBR(trainerReceived)}
                                </span>

                                <Stack
                                    direction="row"
                                    justifyContent="start"
                                    gap="0.5em"
                                >
                                    <Alert
                                        alertMessage={t("feeInMpPaymentCardAlert")}
                                        varColor="--light-theme-color"
                                    />

                                    <span>
                                        {t("feeOf")} {formatPriceToBR(mpFee)}
                                    </span>
                                </Stack>
                            </Stack>

                            <Stack
                                justifyContent="end"
                                alignItems="end"
                                direction={width <= 440 ? "column" : "row"}
                                gap="0.5em"
                            >
                                <span
                                    style={{ fontWeight: "bold" }}
                                >
                                    {t("buyer")}: 
                                </span>
                                
                                <span
                                    onClick={() => window.location.href = `mailto:${payerEmail}`}
                                    style={{ 
                                        cursor: "pointer", 
                                        overflowX: "auto", 
                                        maxWidth: "100%",
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    {payerEmail}
                                </span>
                            </Stack>
                        </Stack>

                        <span
                            style={{ fontSize: "var(--small-text-size)" }}
                        >
                            ID {mercadopagoTransactionID}
                        </span>
                    </Stack>
                </Stack>
            </Stack>
        </GenericCard>
    );
}

export default MpPaymentCard;