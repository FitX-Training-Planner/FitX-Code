import { useTranslation } from "react-i18next";
import useWindowSize from "../../hooks/useWindowSize";
import Stack from "../containers/Stack";
import ClickableIcon from "../form/buttons/ClickableIcon";
import Title from "../text/Title";
import PieChart from "../charts/PieChart";
import { useMemo } from "react";
import TinyBarChart from "../charts/TinyBarChart";
import ProgressBar from "../charts/ProgressBar";
import Alert from "../messages/Alert";
import ContractCard from "../cards/contracts/ContractCard";
import { translateDatabaseData } from "../../utils/formatters/text/translate";
import { useSelector } from "react-redux";

function HomeContractsContainer({
    contractsInfo,
    contractsInfoError
}) {
    const { t } = useTranslation();

    const user = useSelector(state => state.user);

    const { width } = useWindowSize();

    const contractCounts = useMemo(() => {
        return [
            {
                name: t("actives"),
                value: contractsInfo?.counts?.actives || 0
            },
            {
                name: t("expireds"),
                value: contractsInfo?.counts?.expiredsInLast180Days || 0
            },
            {
                name: t("canceleds"),
                value: contractsInfo?.counts?.canceledsInLast180Days || 0
            },
            {
                name: t("rescindeds"),
                value: contractsInfo?.counts?.rescindedsInLast180Days || 0
            }
        ]
    }, [contractsInfo?.counts, t]);

    function ContractExample({ contract, user, t, hasOtherInLine = false }) {
        return (
            <ContractCard
                userName={contract?.client?.name} 
                userPhoto={contract?.client?.photoUrl} 
                startDate={contract?.startDate} 
                endDate={contract?.endDate} 
                status={translateDatabaseData(contract?.status, "contractStatus", "name", user, t)} 
                canceledOrRescindedDate={contract?.canceledOrRescindedDate}
                paymentPlanName={contract?.paymentPlan?.name} 
                transactionAmount={contract?.paymentTransaction?.amount} 
                transactionAppFee={contract?.paymentTransaction?.appFee}
                paymentMethod={contract?.paymentTransaction?.paymentMethod}
                transactionDate={contract?.paymentTransaction?.createDate} 
                transactionMpFee={contract?.paymentTransaction?.mpFee}
                transactionTrainerReceived={contract?.paymentTransaction?.trainerReceived}
                mercadoPagoTransactionId={contract?.paymentTransaction?.mercadopagoTransactionID} 
                transactionReceiptUrl={contract?.paymentTransaction?.receiptUrl} 
                forClient={false}
                hasOtherInLine={hasOtherInLine}
            />
        )
    }

    return (
        <Stack
            gap="3em"
        >
            <Stack
                direction="row"
                justifyContent="space-evenly"
            >
                <ClickableIcon
                    iconSrc="/images/icons/contracts.png"
                    hasTheme={false}
                    size={width <= 440 ? "medium" : "large"}
                />

                <Title
                    headingNumber={2}
                    text={t("contracts")}
                />

                <ClickableIcon
                    iconSrc="/images/icons/contracts.png"
                    hasTheme={false}
                    size={width <= 440 ? "medium" : "large"}
                />
            </Stack>

            {contractsInfoError ? (
                <p
                    style={{ textAlign: "center", hyphens: "none" }}
                >
                    {t("contractsStatsErrorAlert")}
                </p>
            ) : (
                <Stack
                    gap="5em"
                >
                    <Stack
                        gap="3em"
                    >
                        <Stack
                            alignItems="start"
                        >
                            <Title
                                headingNumber={3}
                                text={t("last180DaysResume")}
                                varColor="--light-theme-color"
                            />
                        </Stack>

                        <Stack
                            gap={width <= 440 ? "1em" : "3em"}
                        >
                            {contractsInfo?.counts?.totalInLast180Days > 0 && (
                                <Stack
                                    direction={width <= 440 ? "column" : "row"}
                                    gap="0"
                                >
                                    <PieChart
                                        data={contractCounts}
                                        colors={["#3bc33fff", "#FF9800", "#f41e0fff", "#fff01bff"]}
                                        size={width <= 640 ? (width <= 440 ? "max-content" : "200px") : "300px"}
                                    />

                                    <TinyBarChart
                                        data={contractCounts}
                                        colors={["#3bc33fff", "#FF9800", "#f41e0fff", "#fff01bff"]}
                                        orientation="h"
                                        barSize={width <= 840 ? ( width <= 640 ? (width <= 440 ? undefined : 20) : 30) : 36}
                                        size={width <= 840 ? ( width <= 640 ? (width <= 440 ? "max-content" : "170px") : "250px") : "300px"}
                                    />
                                </Stack>
                            )}

                            <Stack
                                direction={width <= 440 ? "column-reverse" : "row"}
                                gap={width <= 440 ? "2em" : "4em"}
                                alignItems={width <= 440 ? "start" : "center"}
                            >
                                <Stack>
                                    <Stack
                                        justifyContent="start"
                                        direction="row"
                                    >
                                        <Alert
                                            alertMessage={t("contractsLimitAlert")}
                                        />

                                        <Title
                                            headingNumber={4}
                                            text={t("contractsLimit")}
                                        />
                                    </Stack>

                                    <Stack>
                                        <ProgressBar
                                            value={contractsInfo?.counts?.actives || 0}
                                            max={contractsInfo?.maxActiveContracts || 30}
                                            valueLabel={t("actives")}
                                            maxLabel={t("limit")}
                                            orientation="h"
                                        />

                                        <Stack
                                            direction="row"
                                        >
                                            <Stack
                                                direction="row"
                                                extraStyles={{ width: "max-content" }}
                                            >
                                                <span
                                                    style={{ fontSize: "var(--title-size)", color: "var(--theme-color)" }}
                                                >
                                                    <strong>
                                                        {Math.abs((contractsInfo?.maxActiveContracts || 30) - (contractsInfo?.counts?.actives || 0))}
                                                    </strong>
                                                </span>

                                                <p
                                                    style={{ hyphens: "none", width: "min-content" }}
                                                >
                                                    {
                                                        contractsInfo?.maxActiveContracts < contractsInfo?.counts?.actives
                                                        ? t("hiresExcededs") 
                                                        : t("hiresAvailable")
                                                    }
                                                </p>
                                            </Stack>

                                            {contractsInfo?.isContractsPaused && (
                                                <strong>
                                                    <p
                                                        style={{ hyphens: "none", color: "var(--alert-color)", width: "min-content", textAlign: "center" }}
                                                    >
                                                        {t("hiresPaused")}
                                                    </p>
                                                </strong>
                                            )}
                                        </Stack>
                                    </Stack>
                                </Stack>

                                <Stack
                                    direction="row"
                                    extraStyles={{ width: "max-content" }}
                                >
                                    <span
                                        style={{ fontSize: "var(--large-title-size)", color: "var(--theme-color)" }}
                                    >
                                        <strong>
                                            {contractsInfo?.counts?.totalInLast180Days || 0}
                                        </strong>
                                    </span>

                                    <p
                                        style={{ hyphens: "none", width: "8em" }}
                                    >
                                        {t("contractsInLast180Days")}
                                    </p>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                    
                    {(contractsInfo?.lastNotActive || contractsInfo?.lastActive) && (
                        <Stack
                            direction={width <= 440 ? "column" : "row"}
                            alignItems="end"
                            justifyContent="center"
                            gap={width <= 440 ? "3em" : "1em"}
                        >    
                            {contractsInfo?.lastNotActive && (
                                <Stack
                                    extraStyles={{ maxWidth: width > 440 ? "calc(50% - 0.5em)" : undefined }}
                                >
                                    <Stack>
                                        <Title
                                            headingNumber={3}
                                            text={t("lastFinishedContract")}
                                            varColor="--light-theme-color"
                                        />
                                    </Stack>

                                    <ContractExample
                                        contract={contractsInfo?.lastNotActive}
                                        user={user}
                                        t={t}
                                        hasOtherInLine={width > 440}
                                    />
                                </Stack>
                            )}
                            
                            {contractsInfo?.lastActive && (
                                <Stack
                                    extraStyles={{ maxWidth: width > 440 ? "calc(50% - 0.5em)" : undefined }}
                                >
                                    <Stack>
                                        <Title
                                            headingNumber={3}
                                            text={t("lastActiveContract")}
                                            varColor="--light-theme-color"
                                        />
                                    </Stack>

                                    <ContractExample
                                        contract={contractsInfo?.lastActive}
                                        user={user}
                                        t={t}
                                        hasOtherInLine={width > 440}
                                    />
                                </Stack>
                            )}
                        </Stack>
                    )}

                    {(contractsInfo?.nextToExpire || contractsInfo?.lastToExpire) && (
                        <Stack
                            direction={width <= 440 ? "column" : "row"}
                            alignItems="end"
                            justifyContent="center"
                            gap={width <= 440 ? "3em" : "1em"}
                        >    
                            {contractsInfo?.nextToExpire && (
                                <Stack
                                    extraStyles={{ maxWidth: width > 440 ? "calc(50% - 0.5em)" : undefined }}
                                >
                                    <Stack>
                                        <Title
                                            headingNumber={3}
                                            text={t("nextContractToExpire")}
                                            varColor="--light-theme-color"
                                        />
                                    </Stack>

                                    <ContractExample
                                        contract={contractsInfo?.nextToExpire}
                                        user={user}
                                        t={t}
                                        hasOtherInLine={width > 440}
                                    />
                                </Stack>
                            )}
                            
                            {contractsInfo?.lastToExpire && (
                                <Stack
                                    extraStyles={{ maxWidth: width > 440 ? "calc(50% - 0.5em)" : undefined }}
                                >
                                    <Stack>
                                        <Title
                                            headingNumber={3}
                                            text={t("lastContractToExpire")}
                                            varColor="--light-theme-color"
                                        />
                                    </Stack>

                                    <ContractExample
                                        contract={contractsInfo?.lastToExpire}
                                        user={user}
                                        t={t}
                                        hasOtherInLine={width > 440}
                                    />
                                </Stack>
                            )}
                        </Stack>
                    )}
                </Stack>
            )}
        </Stack>
    )
}

export default HomeContractsContainer;