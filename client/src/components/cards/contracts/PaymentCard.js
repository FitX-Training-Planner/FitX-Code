import useWindowSize from "../../../hooks/useWindowSize";
import { formatPriceToBR } from "../../../utils/formatters/payments/formatOnChange";
import { formatDateToExtend } from "../../../utils/formatters/text/formatDate";
import Stack from "../../containers/Stack";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import Alert from "../../messages/Alert";
import styles from "./ContractCard.module.css";

function PaymentCard({
    amount,
    method,
    transactionDate,
    mercadoPagoTransactionId,
    receiptUrl
}) {
    const { width } = useWindowSize();
    
    return (
        <Stack
            className={styles.payment_card}
        >
            <Stack
                gap="2em"
            >
                <Stack
                    className={styles.descriptioned_item}
                >
                    <span>
                        Transação:
                    </span>

                    <Stack
                        gap="0.5em"
                    >
                        <span>
                            {formatDateToExtend(transactionDate)}
                        </span>

                        <Stack
                            direction="row"
                            justifyContent="center"
                        >
                            <span>
                                ID: {mercadoPagoTransactionId}
                            </span>

                            <Alert
                                alertMessage="Este ID é útil para rastrear e comprovar o pagamento, especialmente em casos de suporte. use-o como referência."
                            />
                        </Stack>
                    </Stack>
                </Stack>

                <Stack
                    direction={width <= 440 ? "column" : "row"}
                >
                    <Stack
                        gap="0.2em"
                        alignItems="start"
                        className={styles.descriptioned_item}
                    >
                        <span>
                            Valor:
                        </span>

                        <span>
                            {formatPriceToBR(amount)}
                        </span>
                    </Stack>

                    <Stack
                        gap="0.2em"
                        className={styles.descriptioned_item}
                        alignItems={width <= 440 ? "start" : "end"}
                        extraStyles={{ textAlign: width <= 440 ? "start" : "end" }}
                    >
                        <span>
                            Método de Pagamento:
                        </span>

                        <span>
                            {method}
                        </span>
                    </Stack>
                </Stack>
            </Stack>

            <hr/>

            <Stack
                gap="0.2em"
                alignItems="start"
                className={styles.descriptioned_item}
            >
                <span>
                    URL do Recibo:
                </span>

                <Stack
                    direction="row"
                >
                    <p
                        className={styles.receipt_url}
                    >
                        {receiptUrl}
                    </p>

                    <ClickableIcon
                        iconSrc="/images/icons/redirect.png"
                        name="Ver Recibo"
                        handleClick={() => window.open(receiptUrl, "_blank", "noopener,noreferrer")}
                        size="small"
                    />
                </Stack>
            </Stack>
        </Stack>
    );
}

export default PaymentCard;