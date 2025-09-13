import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSystemMessage } from "../../app/useSystemMessage";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getCacheData, setCacheData } from "../../utils/cache/operations";
import styles from "./ClientContract.module.css";
import api from "../../api/axios";
import useRequest from "../../hooks/useRequest";
import NavBarLayout from "../containers/NavBarLayout";
import FooterLayout from "../containers/FooterLayout";
import { useConfirmIdentityCallback } from "../../app/useConfirmIdentityCallback";
import LoadMoreButton from "../form/buttons/LoadMoreButton";
import Stack from "../containers/Stack";
import Title from "../text/Title";
import ContractCard from "../cards/contracts/ContractCard";
import useWindowSize from "../../hooks/useWindowSize";
import { useSelector } from "react-redux";
import DateInput from "../form/fields/DateInput";
import { formatDateToExtend, getDaysLeft } from "../../utils/formatters/text/formatDate";
import PhotoInput from "../form/fields/PhotoInput";
import ClickableIcon from "../form/buttons/ClickableIcon";
import PaymentPlanCard from "../cards/contracts/PaymentPlanCard";
import SubmitFormButton from "../form/buttons/SubmitFormButton";
import Link from "../text/Link";
import { formatPriceToBR } from "../../utils/formatters/payments/formatOnChange";
import Alert from "../messages/Alert";
import { translateDatabaseData } from "../../utils/formatters/text/translate";

function ClientContract() {
    const { t, i18n } = useTranslation();

    const { confirm, notify } = useSystemMessage();

    const { width } = useWindowSize();

    const user = useSelector(state => state.user);

    const { setHandleOnConfirmed } = useConfirmIdentityCallback();

    const navigate = useNavigate();

    const hasRun = useRef();

    const { request: getUserEmailReq } = useRequest();
    const { request: cancelClientContract } = useRequest();
    const { request: getContract, loading: contractLoading } = useRequest();
    const { request: getContracts, loading: contractsLoading } = useRequest();

    const emailStorageKey = "fitxEmail";
    const contractsLimit = 8;

    const refundDeadlineDescription = useMemo(() => {
        return [
            t("firstRefundDeadlineDescription"),
            t("secondRefundDeadlineDescription"),
            t("thirdRefundDeadlineDescription"),
        ]
    }, [t]);

    const [contract, setContract] = useState({});
    const [contractError, setContractError] = useState(false);
    const [contracts, setContracts] = useState([]);
    const [contractsError, setContractsError] = useState(false);
    const [contractsOffset, setContractsOffset] = useState(0);
    const [searchDate, setSearchDate] = useState({
        day: "",
        month: null,
        year: "",
        validYear: "",
        fullDate: ""
    });
    const [searchDateError, setSearchDateError] = useState(false);
    const [email, setEmail] = useState("");

    const loadContracts = useCallback((hasError, updatedContracts, offset) => {
        if (hasError) return;

        if ((updatedContracts.length < contractsLimit && updatedContracts.length !== 0) || updatedContracts.length % contractsLimit !== 0 || (offset !== 0 && updatedContracts.length === 0)) {
            notify(t("contractsEnding"));

            return;
        }

        const getClientContracts = () => {
            return api.get(`/me/contracts`, { 
                params: { 
                    offset: offset, 
                    limit: contractsLimit, 
                    fullDate: searchDate.fullDate || undefined,
                    month: searchDate.month?.value,
                    year: searchDate.validYear || undefined
                }
            });
        }
        
        const handleOnGetContractsSuccess = (data) => {
            const newContracts = [...updatedContracts, ...data];

            setContracts(newContracts);

            setContractsOffset(offset + contractsLimit);
        };
    
        const handleOnGetContractsError = () => {
            setContractsError(true);
        };

        const isFirstLoading = offset === 0;
    
        getContracts(
            getClientContracts, 
            handleOnGetContractsSuccess, 
            handleOnGetContractsError, 
            !isFirstLoading ? t("loadingContracts") : undefined, 
            !isFirstLoading ? t("successContracts") : undefined, 
            t("errorContracts")
        );
    }, [getContracts, notify, searchDate.fullDate, searchDate.month?.value, searchDate.validYear, t]);
    
    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;
        
        const fetchData = async () => {
            const cachedEmailData = getCacheData(emailStorageKey);

            if (cachedEmailData) {
                setEmail(cachedEmailData);
            } else {
                const getEmail = () => {
                    return api.get(`/users/me/email`);
                }
            
                const handleOnGetEmailSuccess = (data) => {
                    setEmail(data.email);

                    setCacheData(emailStorageKey, data.email);
                };
    
                getUserEmailReq(
                    getEmail, 
                    handleOnGetEmailSuccess, 
                    () => undefined, 
                    undefined, 
                    undefined, 
                    t("errorLoadingUserInfo")
                );
            }

            const getClientContract = () => {
                return api.get(`/me/training-contract`);
            }
        
            const handleOnGetContractSuccess = (data) => {
                setContract(data);
            };
            
            const handleOnGetContractError = () => {
                setContractError(true);
            };

            getContract(
                getClientContract, 
                handleOnGetContractSuccess, 
                handleOnGetContractError, 
                t("loadingTrainingContract"), 
                undefined, 
                t("errorTrainingContract")
            );

            loadContracts(contractsError, contracts, contractsOffset);
        }

        fetchData();
    }, [contracts, contractsError, contractsOffset, getContract, getUserEmailReq, loadContracts, t]);

    const handleOnReloadContracts = useCallback((e) => {
        if (e) e.preventDefault();

        setContracts([]);
        setContractsOffset(0);
        setContractsError(false);

        loadContracts(false, [], 0);
    }, [loadContracts]);
    
    const handleOnCancelContract = useCallback(async (e) => {
        e.preventDefault();

        const userConfirmed = await confirm(t("cancelContractConfirm"));
        
        if (userConfirmed) {
            navigate("/code-confirmation", { state: { localUser: { email: email }, origin: "cancelContract" } });

            setHandleOnConfirmed(() => () => {
                const cancelContract = () => {
                    return api.put(`/me/cancel-contract`);
                }
            
                const handleOnCancelContractSuccess = () => {
                    setContract(null);

                    navigate("/");
                };

                cancelClientContract(
                    cancelContract, 
                    handleOnCancelContractSuccess, 
                    () => undefined, 
                    t("loadingCancelContract"), 
                    t("successCancelContract"),
                    t("errorCancelContract")
                );
            });
        }
    }, [cancelClientContract, confirm, email, navigate, setContract, setHandleOnConfirmed, t]);

    useEffect(() => {
        document.title = t("contract");
    }, [t]);

    return (
        <NavBarLayout>
            <FooterLayout>
                <main>
                    <Stack
                        gap="4em"
                        className={styles.client_contract_page}
                    >
                        <Title
                            headingNumber={1}
                            text={t("contract")}
                        />
                        
                        <Stack
                            gap="6em"
                        >
                            <Stack
                                gap="3em"
                            >
                                <Title
                                    headingNumber={2}
                                    text={t("currentContract")}
                                    varColor="--theme-color"
                                />

                                <Stack
                                    gap="2em"
                                >
                                    <Stack>
                                        {!contractError && !contract?.ID ? (
                                            !contractLoading && (
                                                <p>
                                                    {t("noContractActive")}
                                                </p>
                                            )
                                        ) : (
                                            <Stack
                                                gap="3em"
                                            >
                                                <Stack
                                                    direction={width <= 440 ? "column" : "row"}
                                                >
                                                    <Stack>
                                                        <Stack
                                                            alignItems="start"
                                                            gap="0.5em"
                                                            className={styles.descriptioned_item}
                                                        >
                                                            <span>
                                                                {t("startingOn")}:
                                                            </span>
                                                            
                                                            <span>
                                                                {formatDateToExtend(contract.contract.startDate, i18n.language)}
                                                            </span>
                                                        </Stack>

                                                        <Stack
                                                            alignItems="start"
                                                            gap="0.5em"
                                                            className={styles.descriptioned_item}
                                                        >
                                                            <span>
                                                                {t("endingOn")}:
                                                            </span>

                                                            <span>
                                                                {formatDateToExtend(contract.contract.endDate, i18n.language)}
                                                            </span>
                                                        </Stack>
                                                    </Stack>

                                                    <Stack
                                                        alignItems="end"
                                                        gap="0.5em"
                                                        direction="column-reverse"
                                                        className={styles.descriptioned_item}
                                                    >
                                                        <span>
                                                            {t("daysLeft")}
                                                        </span>

                                                        <span>
                                                            {getDaysLeft(contract.contract.endDate)}
                                                        </span>
                                                    </Stack>
                                                </Stack>

                                                <Stack
                                                    gap="0.5em"
                                                >
                                                    <Stack
                                                        direction="row"
                                                    >
                                                        <Title
                                                            headingNumber={3}
                                                            text={t("trainer")}
                                                        />

                                                        <Stack
                                                            direction="row"
                                                            gap="0.5em"
                                                            justifyContent="end"
                                                        >
                                                            <ClickableIcon
                                                                iconSrc="/images/icons/rated.png"
                                                                name={t("averageGrade")}
                                                                size={width <= 440 ? "small" : "medium"}
                                                                hasTheme={false}
                                                            />

                                                            <span>
                                                                {Number(contract.trainer.rate).toFixed(2)}
                                                            </span>
                                                        </Stack>
                                                    </Stack>

                                                    <Stack
                                                        alignItems="start"
                                                        direction={width <= 640 ? "column" : "row"}
                                                        className={styles.professional_name_container}
                                                    >
                                                        <Stack
                                                            direction={width <= 640 ? "column" : "row"}
                                                            justifyContent={width <= 640 ? "center" : "start"}
                                                        >
                                                            <PhotoInput
                                                                blobUrl={contract.trainer.photoUrl}
                                                                disabled
                                                                size={width <= 440 ? "small" : "medium"}
                                                            />

                                                            <span>
                                                                {contract.trainer.name}
                                                            </span>
                                                        </Stack>

                                                        {contract.trainer.crefNumber && (
                                                            <Stack
                                                                direction={width <= 440 ? "column" : "row"}
                                                                justifyContent={width <= 640 ? "center" : "end"}
                                                                gap="0.5em"
                                                            >
                                                                CREF

                                                                <span>
                                                                    {contract.trainer.crefNumber}
                                                                </span>
                                                            </Stack>
                                                        )}
                                                    </Stack>
                                                </Stack>

                                                <Stack
                                                    direction={width <= 840 ? "column" : "row"}
                                                    alignItems="start"
                                                    gap={width <= 840 ? "3em" : "1em"}
                                                >
                                                    <Stack
                                                        gap="2em"
                                                    >
                                                        <Title
                                                            headingNumber={3}
                                                            text={t("training")}
                                                        />

                                                        <Stack
                                                            gap="3em"
                                                        >
                                                            <p
                                                                className={styles.center_description}
                                                            >
                                                                {t("trainingPlanClientInstruction")}
                                                            </p>

                                                            <Stack
                                                                gap="2em"
                                                            >
                                                                <Title
                                                                    headingNumber={4}
                                                                    text={t("yourTraining")}
                                                                    varColor="--light-theme-color"
                                                                />

                                                                {contract.trainingPlan?.ID ? (
                                                                    <Stack
                                                                        gap="2em"
                                                                    >
                                                                        <Stack>
                                                                            <Stack
                                                                                alignItems="start"
                                                                                gap="0.5em"
                                                                                className={styles.descriptioned_item}
                                                                            >
                                                                                <span>
                                                                                    {t("trainingPlan")}:
                                                                                </span>

                                                                                <span>
                                                                                    {contract.trainingPlan?.name}                                                                 
                                                                                </span>
                                                                            </Stack>
                                                                            
                                                                            {contract.trainingPlan?.note && (
                                                                                <Stack
                                                                                    alignItems="start"
                                                                                    gap="0.5em"
                                                                                >
                                                                                    <span>
                                                                                        {t("note")}:
                                                                                    </span>

                                                                                    <span>
                                                                                        {contract.trainingPlan?.note}                                                                        
                                                                                    </span>
                                                                                </Stack>
                                                                            )}
                                                                        </Stack>

                                                                        <form
                                                                            onSubmit={(e) => {
                                                                                e.preventDefault();
                                                                                navigate("/me/training-plan");
                                                                            }}
                                                                        >
                                                                            <SubmitFormButton
                                                                                text={t("viewCurrentTrainingPlan")}
                                                                            />
                                                                        </form>
                                                                    </Stack>
                                                                ) : (
                                                                    <p
                                                                        className={styles.center_description}
                                                                    >
                                                                        {t("noTrainingSended")}
                                                                    </p>
                                                                )}

                                                                <hr/>
                                                                
                                                                <Stack
                                                                    gap="2em"
                                                                >
                                                                    <Stack>
                                                                        <p
                                                                            className={styles.center_description}
                                                                        >
                                                                            {t("clientDataInstruction1")}
                                                                        </p>
                                                                        
                                                                        <p
                                                                            className={styles.center_description}
                                                                        >
                                                                            {t("clientDataInstruction2")}
                                                                        </p>
                                                                    </Stack>

                                                                    <form
                                                                        onSubmit={(e) => {
                                                                            e.preventDefault();
                                                                            navigate("/me");
                                                                        }}
                                                                        style={{ width: "max-content" }}
                                                                    >
                                                                        <SubmitFormButton
                                                                            text={t("seeProfile")}
                                                                        />
                                                                    </form>
                                                                </Stack>
                                                            </Stack>
                                                        </Stack>
                                                    </Stack>

                                                    <Stack
                                                        gap="2em"
                                                    >
                                                        <Title
                                                            headingNumber={3}
                                                            text={t("paymentPlan")}
                                                        />

                                                        {contract.paymentPlan?.ID ? (
                                                            <Stack>
                                                                <PaymentPlanCard
                                                                    name={contract.paymentPlan?.name} 
                                                                    fullPrice={contract.paymentPlan?.fullPrice} 
                                                                    durationDays={contract.paymentPlan?.durationDays} 
                                                                    description={contract.paymentPlan?.description} 
                                                                    benefits={contract.paymentPlan?.benefits}
                                                                    appFee={contract.paymentPlan?.appFee}
                                                                />

                                                                <p
                                                                    style={{ fontSize: "var(--small-text-size)" }}
                                                                >
                                                                    {t("modifiedPaymentPlanAlert")}
                                                                </p>
                                                            </Stack>
                                                        ) : (
                                                            <p
                                                                className={styles.center_description}
                                                            >
                                                                {t("deletedPaymentPlanAlert")}
                                                            </p>
                                                        )}
                                                    </Stack>
                                                </Stack>

                                                <Stack
                                                    gap="2em"
                                                >
                                                    <Title
                                                        headingNumber={3}
                                                        text={t("refundAndCancellation")}
                                                    />

                                                    <Stack
                                                        gap="3em"
                                                    >
                                                        <Stack>
                                                            <p
                                                                className={styles.center_description}
                                                            >
                                                                {t("fitxCancellationAndRefundDescription")}
                                                            </p>

                                                            <p
                                                                className={styles.center_description}
                                                            >
                                                                {t("checkThe")} 
                                                                
                                                                <Link
                                                                    destiny="/"
                                                                    text={t("refundAndCancellationPolicy")}
                                                                />

                                                                {t("forMoreInfo")}.
                                                            </p>
                                                        </Stack>

                                                        <Stack
                                                            direction={width <= 640 ? "column" : "row"}
                                                            gap="5em"
                                                            alignItems={width <= 640 ? "end" : "center"}
                                                        >
                                                            <Stack
                                                                gap="2em"
                                                            >
                                                                <Title
                                                                    headingNumber={4}
                                                                    text={t("refundDeadlines")}
                                                                    varColor="--light-theme-color"
                                                                />

                                                                <Stack
                                                                    alignItems="start"
                                                                >
                                                                    <Stack>
                                                                        <Stack
                                                                            gap="0.5em"
                                                                        >
                                                                            {refundDeadlineDescription.map((description, index) => (
                                                                                <React.Fragment
                                                                                    key={index}
                                                                                >
                                                                                    <Stack
                                                                                        direction="row"
                                                                                        alignItems="start"
                                                                                        gap="0.5em"
                                                                                    >
                                                                                        <span
                                                                                            style={{ fontWeight: "bold" }}
                                                                                        >
                                                                                            {index + 1}.
                                                                                        </span>

                                                                                        <p
                                                                                            key={index}
                                                                                            style={{ hyphens: "none" }}
                                                                                        >
                                                                                            {description}
                                                                                        </p>
                                                                                    </Stack>
                                                                                </React.Fragment>
                                                                            ))}
                                                                        </Stack>

                                                                        <p
                                                                            style={{ hyphens: "none" }}
                                                                        >
                                                                            {t("trainerCancellationRefundDescription")}
                                                                        </p>
                                                                    </Stack>

                                                                    <p>
                                                                        {t("checkThe")} 
                                                                        
                                                                        <Link
                                                                            destiny="/"
                                                                            text={t("refundAndCancellationPolicy")}
                                                                        />

                                                                        {t("forMoreInfo")}.
                                                                    </p>
                                                                </Stack>
                                                            </Stack>

                                                            <Stack
                                                                gap="2em"
                                                                alignItems="end"
                                                                extraStyles={{ width: "max-content" }}
                                                            >
                                                                <Stack>
                                                                    <Stack
                                                                        gap="0.5em"
                                                                        alignItems="end"
                                                                        className={styles.descriptioned_item}
                                                                    >
                                                                        <span>
                                                                            {t("refundValue")}:
                                                                        </span>

                                                                        <span>
                                                                            {formatPriceToBR(String(contract.refundInfo.refund))}  
                                                                        </span>
                                                                    </Stack>

                                                                    <Stack
                                                                        gap="0.5em"
                                                                        alignItems="end"
                                                                        className={styles.descriptioned_item}
                                                                    >
                                                                        <Stack
                                                                            direction="row"
                                                                            justifyContent="end"
                                                                            gap="0.5em"
                                                                        >
                                                                            <Alert
                                                                                alertMessage={t("refundFeeAlert")}
                                                                            />

                                                                            <span>
                                                                                {t("fee")}:
                                                                            </span>
                                                                        </Stack>
                                                                        
                                                                        <span>
                                                                            {formatPriceToBR(String(contract.refundInfo.fee))}  
                                                                        </span>
                                                                    </Stack>
                                                                </Stack>

                                                                <form
                                                                    onSubmit={handleOnCancelContract}
                                                                    style={{ width: "max-content" }}
                                                                >
                                                                    <SubmitFormButton
                                                                        text={t("cancelContract")}
                                                                        varBgColor="--alert-color"
                                                                    />
                                                                </form>
                                                            </Stack>
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        )}
                                    </Stack>

                                    {contractError && (
                                        <p>
                                            <>
                                                {t("errorOcurredClientContract")}

                                                <br/>
                                                
                                                {t("reloadOrTryLater")}
                                            </>
                                        </p>
                                    )}
                                </Stack>
                            </Stack>

                            <Stack
                                className={styles.contracts_container}
                                gap="3em"
                            >
                                <Title
                                    headingNumber={2}
                                    text={t("pastContracts")}
                                    varColor="--theme-color"
                                />

                                <Stack
                                    className={styles.contracts}
                                    gap="2em"
                                >
                                    <Stack>
                                        <Stack
                                            direction={width <= 440 ? "column" : "row"}
                                            alignItems={width <= 440 ? "end" : "start"}
                                        >
                                            <LoadMoreButton
                                                handleLoad={(e) => handleOnReloadContracts(e)}
                                                text={t("reload")}
                                                loading={contractsLoading}
                                            />

                                            <DateInput
                                                dateValuesObject={searchDate}
                                                setDateValuesObject={setSearchDate}
                                                error={searchDateError}
                                                setError={setSearchDateError}
                                            />
                                        </Stack>
                                        
                                        {!contractsError && contracts.length === 0 ? (
                                            !contractsLoading && (
                                                <p>
                                                    {t("noContracts")}
                                                </p>
                                            )
                                        ) : (
                                            <Stack
                                                gap="2em"
                                            >
                                                {contracts.length !== 0 ? (
                                                    contracts.map((contract, index) => (
                                                        <React.Fragment
                                                            key={index}
                                                        >
                                                            <ContractCard
                                                                userName={contract.trainer?.name} 
                                                                userPhoto={contract.trainer?.photoUrl} 
                                                                startDate={contract.startDate} 
                                                                endDate={contract.endDate} 
                                                                status={translateDatabaseData(contract.status, "contractStatus", "name", user, t)} 
                                                                canceledOrRescindedDate={contract.canceledOrRescindedDate}
                                                                paymentPlanName={contract.paymentPlan?.name} 
                                                                transactionAmount={contract.paymentTransaction?.amount} 
                                                                transactionAppFee={contract.paymentTransaction?.appFee}
                                                                paymentMethod={contract.paymentTransaction?.paymentMethod}
                                                                transactionDate={contract.paymentTransaction?.createDate} 
                                                                mercadoPagoTransactionId={contract.paymentTransaction?.mercadopagoTransactionID} 
                                                                transactionReceiptUrl={contract.paymentTransaction?.receiptUrl} 
                                                                forClient
                                                            />
                                                        </React.Fragment>
                                                    ))
                                                ) : (
                                                    <p>
                                                        {t("noResult")}
                                                    </p>
                                                )}
                                            </Stack>
                                        )}
                                    </Stack>

                                    {contractsError ? (
                                        <p>
                                            <>
                                                {t("errorOcurredContracts")}

                                                <br/>
                                                
                                                {t("reloadOrTryLater")}
                                            </>
                                        </p>
                                    ) : (
                                        <LoadMoreButton
                                            handleLoad={() => loadContracts(contractsError, contracts, contractsOffset)}
                                            loading={contractsLoading}
                                        />
                                    )}
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </main>
            </FooterLayout>
        </NavBarLayout>
    )
}

export default ClientContract;