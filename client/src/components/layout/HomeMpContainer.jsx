import { useTranslation } from "react-i18next";
import useWindowSize from "../../hooks/useWindowSize";
import React from "react";
import MpPaymentCard from "../cards/contracts/MpPaymentCard";
import Stack from "../containers/Stack";
import MercadopagoConnectButton from "./MercadopagoConnectButton";
import Alert from "../messages/Alert";
import ClickableIcon from "../form/buttons/ClickableIcon";
import Title from "../text/Title";
import styles from "./TrainerHomePageContainer.module.css";
import LoadMoreButton from "../form/buttons/LoadMoreButton";

function HomeMpContainer({
    mpInfo,
    mpInfoError,
    handleOnConnectMP,
    handleOnDisconnectMP,
    transactions,
    transactionsLoading,
    transactionsError,
    loadTransactions
}) {
    const { t } = useTranslation();

    const { width } = useWindowSize();

    return (
        <Stack
            gap="3em"
        >
            <Stack
                direction="row"
            >
                <Title
                    headingNumber={2}
                    text="Mercado Pago"
                    textAlign="start"
                />

                <img
                    src="/images/icons/mercadopago.png"
                    alt=""
                    style={{ height: "8em" }}
                />
            </Stack>

            <Stack
                direction={width <= 840 ? "column-reverse" : "row"}
                alignItems={width <= 840 ? "center" : "start"}
                gap={width <= 840 ? "5em" : "1em"}
            >
                <Stack>
                    {mpInfoError ? (
                        <p
                            style={{ textAlign: "center", hyphens: "none" }}
                        >
                            {t("mpInfoErrorAlert")}
                        </p>      
                    ) : (
                        <Stack
                            gap="2em"
                            alignItems="start"
                        >
                            <Title
                                headingNumber={3}
                                text={t("accountDetails")}
                                varColor="--theme-color"
                            />
                        
                            <Stack
                                gap="3em"
                            >
                                {mpInfo.hasConnected && (
                                    <Stack
                                        alignItems="start"
                                    >
                                        <Stack
                                            direction="row"
                                            className={styles.descriptioned_item}
                                        >
                                            <ClickableIcon
                                                iconSrc="/images/icons/user2.png"
                                                size="small"
                                                name={t("name")}
                                            />

                                            <Stack
                                                gap="0.5em"
                                                alignItems="start"
                                                className={styles.mp_user_name}
                                            >
                                                <span>
                                                    {mpInfo.nickname}
                                                </span>

                                                <span>
                                                    {mpInfo.firstName} {mpInfo.lastName}
                                                </span>
                                            </Stack>
                                        </Stack>
                                                                                
                                        <Stack
                                            direction="row"
                                            className={styles.descriptioned_item}
                                        >
                                            <ClickableIcon
                                                iconSrc="/images/icons/email.png"
                                                size="small"
                                                name={t("email")}
                                            />

                                            <span>
                                                {mpInfo.email}
                                            </span>
                                        </Stack>
                                    </Stack>
                                )}

                                <Stack
                                    alignItems="start"
                                >
                                    <p>
                                        {mpInfo.hasConnected ? t("alreadyMPConnected") : t("connectMPInstruction")}
                                    </p>

                                    <Stack
                                        alignItems="start"
                                        gap="0.5em"
                                    >
                                        <MercadopagoConnectButton
                                            handleConnect={mpInfo.hasConnected ? handleOnDisconnectMP : handleOnConnectMP}
                                            text={mpInfo.hasConnected ? t("mercadopagoDisconnect") : t("mercadopagoConnect")}
                                        />

                                        <Stack
                                            gap="0.5em"
                                            extraStyles={{ fontSize: "var(--small-text-size)", hyphens: "none" }}
                                            >                

                                            <Stack
                                                extraStyles={{ hyphens: "none", color: "var(--light-theme-color)" }}
                                                direction="row"
                                                justifyContent="start"
                                            >
                                                <Alert
                                                    varColor="--light-theme-color"
                                                />
                
                                                {t("merchantAccountInstruction")}
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    )}
                </Stack>

                <Stack
                    gap="2em"
                >
                    <Title
                        headingNumber={3}
                        text={t("payments")}
                        varColor="--theme-color"
                    />

                    <Stack
                        gap="2em"
                        className={width > 840 ? styles.mp_payments : undefined}
                    >
                        {transactions.length === 0 ? (
                            (!transactionsLoading && !transactionsError) && (
                                <p
                                    style={{ textAlign: "center", hyphens: "none" }}
                                >
                                    {t("noPayments")}
                                </p>
                            )
                        ) : (
                            <Stack>
                                {transactions.map((transaction, index) => (
                                    <React.Fragment
                                        key={index}
                                    >
                                        <MpPaymentCard
                                            mercadopagoTransactionID={transaction.mercadopagoTransactionID}
                                            createDate={transaction.createDate}
                                            mpFee={transaction.mpFee}
                                            trainerReceived={transaction.trainerReceived}
                                            payerEmail={transaction.payerEmail}
                                        />
                                    </React.Fragment>
                                ))}
                            </Stack>
                        )}

                        {transactionsError ? (
                            <p
                                style={{ textAlign: "center", hyphens: "none" }}
                            >
                                <>
                                    {t("errorOcurredPayments")}

                                    <br/>
                                    
                                    {t("reloadOrTryLater")}
                                </>
                            </p>
                        ) : (
                            <LoadMoreButton
                                handleLoad={() => loadTransactions()}
                                loading={transactionsLoading}
                            />
                        )}
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default HomeMpContainer;