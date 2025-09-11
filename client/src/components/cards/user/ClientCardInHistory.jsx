import Stack from "../../containers/Stack";
import PhotoInput from "../../form/fields/PhotoInput";
import styles from "./ClientCard.module.css";
import useWindowSize from "../../../hooks/useWindowSize";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import { formatPriceToBR } from "../../../utils/formatters/payments/formatOnChange";
import { useTranslation } from "react-i18next";
import { formatNumberShort } from "../../../utils/formatters/text/formatNumber";
import { formatDateToExtend } from "../../../utils/formatters/text/formatDate";
import Alert from "../../messages/Alert";

function ClientCardInHistory({
    name,
    photoUrl,
    sex,
    firstContractDate,
    lastContractDate,
    contractsNumber,
    daysInContract,
    completedContracts,
    canceledContracts,
    amountPaid
}) {
    const { t, i18n } = useTranslation();

    const { width } = useWindowSize();

    return (
        <Stack
            gap="2em"
            className={styles.client_card}
        >
            <Stack
                direction={width <= 640 && width > 440 ? "row" : "column"}
            >
                <Stack
                    direction={width <= 640 ? "column" : "row"}
                    className={styles.client_main_info}
                    alignItems={width <= 640 ? "start" : "center"}
                    gap="2em"
                >
                    <Stack
                        direction="row"
                        justifyContent={width <= 440 ? "center" : "start"}
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

                    <Stack
                        direction="column-reverse"
                        gap="0.5em"
                        alignItems={width <= 640 ? "start" : "end"}
                        className={`${styles.descriptioned_item} ${styles.amount_paid_container}`}
                    >
                        <Stack
                            direction="row"
                            gap="0.5em"
                            justifyContent={width <= 640 ? (width <= 440 ? "center" : "start") : "end"}
                        >
                            <Alert
                                alertMessage={t("clientAmountPaidAlert")}
                            />

                            <span>
                                {t("amountPaid")}
                            </span>
                        </Stack>
                        
                        <span>
                            {formatPriceToBR(amountPaid)}
                        </span>
                    </Stack>
                </Stack>

                <Stack
                    extraStyles={{ width: width <= 640 && width > 440 ? "max-content" : "100%" }}
                >
                    {(width > 640 || width <= 440) && (
                        <hr/>
                    )}

                    <Stack
                        direction={width <= 640 && width > 440 ? "column" : "row"}
                        gap={width <= 440 ? "1em" : "3em"}
                    >
                        <Stack
                            direction="row"
                            gap="0.5em"
                            justifyContent="center"
                        >
                            <ClickableIcon
                                iconSrc="/images/icons/contracts.png"
                                name={t("hirings")}
                                hasTheme={false}
                                size={width <= 440 ? "small" : "medium"}
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
                                iconSrc="/images/icons/completed_contract.png"
                                name={t("completedContracts")}
                                hasTheme={false}
                                size={width <= 440 ? "small" : "medium"}
                            />

                            <span>
                                {formatNumberShort(completedContracts)}
                            </span>
                        </Stack>

                        <Stack
                            direction="row"
                            gap="0.5em"
                            justifyContent="center"
                        >
                            <ClickableIcon
                                iconSrc="/images/icons/canceled_contract.png"
                                name={t("canceledContracts")}
                                hasTheme={false}
                                size={width <= 440 ? "small" : "medium"}
                            />

                            <span>
                                {formatNumberShort(canceledContracts)}
                            </span>
                        </Stack>
                    </Stack>

                    {(width > 640 || width <= 440) && (
                        <hr/>
                    )}
                </Stack>
            </Stack>

            <Stack
                direction={width <= 440 ? "column" : "row"}
            >
                <Stack>
                    <Stack
                        gap="0.5em"
                        alignItems="start"
                        className={styles.descriptioned_item}
                    >
                        <span>
                            {t("firstContract")}:
                        </span>

                        <span
                            style={{ fontSize: width <= 640 ? "var(--large-text-size)" : "var(--small-title-size)" }}
                        >
                            {formatDateToExtend(firstContractDate, i18n.language)}
                        </span>
                    </Stack>

                    <Stack
                        gap="0.5em"
                        alignItems="start"
                        className={styles.descriptioned_item}
                    >
                        <span>
                            {t("lastContract")}:
                        </span>

                        <span
                            style={{ fontSize: width <= 640 ? "var(--large-text-size)" : "var(--small-title-size)" }}
                        >
                            {formatDateToExtend(lastContractDate, i18n.language)}
                        </span>
                    </Stack>
                </Stack>

                <Stack
                    direction="column-reverse"
                    gap="0"
                    alignItems="end"
                    className={`${styles.descriptioned_item} ${styles.days_in_contract}`}
                >
                    <span>
                        {t("daysInContract")}
                    </span>

                    <span>
                        {daysInContract}
                    </span>
                </Stack>
            </Stack>
        </Stack>
    );
}

export default ClientCardInHistory;