import styles from "./Home.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import NavBarLayout from "../containers/NavBarLayout";
import FooterLayout from "../containers/FooterLayout";
import { useTranslation } from "react-i18next";
import Stack from "../containers/Stack";
import useRequest from "../../hooks/useRequest";
import api from "../../api/axios";
import { verifyIsTrainer } from "../../utils/requests/verifyUserType";
import { useSystemMessage } from "../../app/useSystemMessage";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { cleanCacheData, getCacheData, setCacheData } from "../../utils/cache/operations";
import HomeMpContainer from "../layout/HomeMpContainer";
import HomeComplaintsContainer from "../layout/HomeComplaintsContainer";
import HomeRatingsContainer from "../layout/HomeRatingsContainer";
import HomeContractsContainer from "../layout/HomeContractsContainer";

function TrainerHome() {
    const { t } = useTranslation();

    const hasRun = useRef(false);

    const navigate = useNavigate();

    const { notify } = useSystemMessage();

    const { request: getIdReq } = useRequest();
    const { request: disconnectMpReq } = useRequest();
    const { request: isTrainer } = useRequest();
    const { request: getMpUserInfoReq } = useRequest();
    const { request: getRatingsInfoReq } = useRequest();
    const { request: getComplaintsInfoReq } = useRequest();
    const { request: getContractsInfoReq } = useRequest();
    const { request: getTrainerTransactions, loading: transactionsLoading } = useRequest();

    const user = useSelector(state => state.user);

    const mpUserInfoKey = "mpUserInfo";
    const ratingsStatsKey = "ratingsStats";
    const complaintsStatsKey = "complaintsStats";
    const contractsStatsKey = "contractsStats";
    const transactionsLimit = 6;

    const [ratingsInfo, setRatingsInfo] = useState({});
    const [ratingsInfoError, setRatingsInfoError] = useState(false);
    const [complaintsInfo, setComplaintsInfo] = useState({});
    const [complaintsInfoError, setComplaintsInfoError] = useState(false);
    const [contractsInfo, setContractsInfo] = useState({});
    const [contractsInfoError, setContractsInfoError] = useState(false);
    const [mpInfo, setMpInfo] = useState({
        hasConnected: false 
    });
    const [mpInfoError, setMpInfoError] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [transactionsOffset, setTransactionsOffset] = useState(0);
    const [transactionsError, setTransactionsError] = useState(false);

    const loadTransactions = useCallback(() => {
        if (transactionsError) return;

        if ((transactions.length < transactionsLimit && transactions.length !== 0) || transactions.length % transactionsLimit !== 0 || (transactionsOffset !== 0 && transactions.length === 0)) {
            notify(t("transactionsEnding"));

            return;
        }

        const getTransactions = () => {
            return api.get(`/trainers/me/transactions`, { 
                params: { 
                    offset: transactionsOffset, 
                    limit: transactionsLimit
                }
            });
        }
        
        const handleOnGetTransactionsSuccess = (data) => {
            setTransactions(prevTransactions => [ ...prevTransactions, ...data ]);

            setTransactionsOffset(transactionsOffset + transactionsLimit);
        };
    
        const handleOnGetTransactionsError = () => {
            setTransactionsError(true);
        };

        const isFirstLoading = transactionsOffset === 0;
    
        getTrainerTransactions(
            getTransactions, 
            handleOnGetTransactionsSuccess, 
            handleOnGetTransactionsError, 
            !isFirstLoading ? t("loadingTransactions") : undefined, 
            !isFirstLoading ? t("successTransactions") : undefined, 
            t("errorTransactions")
        );
    }, [getTrainerTransactions, notify, t, transactions.length, transactionsError, transactionsOffset]);

    useEffect(() => {
        if (hasRun.current || !user.ID) return;
                
        hasRun.current = true;
        
        const fetchData = async () => {
            const success = await verifyIsTrainer(isTrainer, user, navigate, notify, t);

            if (!success) return;

            const mpUserCachedData = getCacheData(mpUserInfoKey);
            
            if (mpUserCachedData) {
                setMpInfo(mpUserCachedData);
            } else {
                const getMpUserInfo = () => {
                    return api.get(`/trainers/me/mercadopago/user`);
                }
            
                const handleOngetMpUserInfoSuccess = (data) => {
                    const info = data ? { ...data, hasConnected: true } : { hasConnected: false };
    
                    setMpInfo(info);
    
                    setCacheData(mpUserInfoKey, info);
                };
            
                const handleOngetMpUserInfoError = () => {
                    setMpInfoError(true);
                };
    
                getMpUserInfoReq(
                    getMpUserInfo, 
                    handleOngetMpUserInfoSuccess, 
                    handleOngetMpUserInfoError, 
                    undefined, 
                    undefined, 
                    t("errorMpUserInfo")
                );
            }
            
            const ratingsStatsCachedData = getCacheData(ratingsStatsKey);
            
            if (ratingsStatsCachedData) {
                setRatingsInfo(ratingsStatsCachedData);
            } else {
                const getRatingsInfo = () => {
                    return api.get(`/trainers/me/ratings/stats`);
                }
            
                const handleOngetRatingsInfoSuccess = (data) => {    
                    setRatingsInfo(data);
    
                    setCacheData(ratingsStatsKey, data);
                };
            
                const handleOngetRatingsInfoError = () => {
                    setRatingsInfoError(true);
                };
    
                getRatingsInfoReq(
                    getRatingsInfo, 
                    handleOngetRatingsInfoSuccess, 
                    handleOngetRatingsInfoError, 
                    undefined, 
                    undefined, 
                    t("errorRatingsStats")
                );
            }

            const complaintsStatsCachedData = getCacheData(complaintsStatsKey);
            
            if (complaintsStatsCachedData) {
                setComplaintsInfo(complaintsStatsCachedData);
            } else {
                const getComplaintsInfo = () => {
                    return api.get(`/trainers/me/complaints/stats`);
                }
            
                const handleOngetComplaintsInfoSuccess = (data) => {    
                    setComplaintsInfo(data);
    
                    setCacheData(complaintsStatsKey, data);
                };
            
                const handleOngetComplaintsInfoError = () => {
                    setComplaintsInfoError(true);
                };
    
                getComplaintsInfoReq(
                    getComplaintsInfo, 
                    handleOngetComplaintsInfoSuccess, 
                    handleOngetComplaintsInfoError, 
                    undefined, 
                    undefined, 
                    t("errorComplaintsStats")
                );
            }
            
            const contractsStatsCachedData = getCacheData(contractsStatsKey);
            
            if (contractsStatsCachedData) {
                setContractsInfo(contractsStatsCachedData);
            } else {
                const getContractsInfo = () => {
                    return api.get(`/trainers/me/contracts/stats`);
                }
            
                const handleOngetContractsInfoSuccess = (data) => {    
                    setContractsInfo(data);
    
                    setCacheData(contractsStatsKey, data);
                };
            
                const handleOngetContractsInfoError = () => {
                    setContractsInfoError(true);
                };
    
                getContractsInfoReq(
                    getContractsInfo, 
                    handleOngetContractsInfoSuccess, 
                    handleOngetContractsInfoError, 
                    undefined, 
                    undefined, 
                    t("errorContractsStats")
                );
            }

            loadTransactions();
        }

        fetchData();
    }, [getComplaintsInfoReq, getContractsInfoReq, getMpUserInfoReq, getRatingsInfoReq, isTrainer, loadTransactions, navigate, notify, t, user]);

    const handleOnConnectMP = useCallback(async () => {
        const getId = () => {
            return api.get(`/me/used-id`);
        }
    
        const handleOnGetIdSuccess = (data) => {
            window.location.href = `${import.meta.env.VITE_API_URL}/mercadopago/connect/${data.ID}`;

            cleanCacheData(mpUserInfoKey);
        };

        getIdReq(
            getId, 
            handleOnGetIdSuccess, 
            () => undefined, 
            undefined, 
            undefined, 
            t("errorGetId")
        );
    }, [getIdReq, t]);

    const handleOnDisconnectMP = useCallback(async () => {
        const disconnectMp = () => {
            return api.delete(`/mercadopago/disconnect`);
        }
    
        const handleOnDisconnectMpSuccess = () => {
            setMpInfo(prevMpInfo => ({ ...prevMpInfo, hasConnected: false }));

            cleanCacheData(mpUserInfoKey);
        };

        disconnectMpReq(
            disconnectMp, 
            handleOnDisconnectMpSuccess, 
            () => undefined, 
            t("loadingDisconnectMp"), 
            undefined, 
            t("errorDisconnectMp")
        );
    }, [disconnectMpReq, t]);

    useEffect(() => {
        document.title = t("home");
    }, [t]);

    return (
        <NavBarLayout
            isClient={false}
        >
            <FooterLayout>
                <main
                    className={styles.trainer_home}
                >
                    <Stack
                        gap="6em"
                    >
                        <HomeContractsContainer
                            contractsInfo={contractsInfo}
                            contractsInfoError={contractsInfoError}
                        />

                        <HomeRatingsContainer
                            ratingsInfo={ratingsInfo}
                            ratingsInfoError={ratingsInfoError}
                        />   

                        <HomeComplaintsContainer
                            complaintsInfo={complaintsInfo}
                            complaintsInfoError={complaintsInfoError}
                        />
                        
                        <HomeMpContainer
                            mpInfo={mpInfo}
                            mpInfoError={mpInfoError}
                            handleOnConnectMP={handleOnConnectMP}
                            handleOnDisconnectMP={handleOnDisconnectMP}
                            transactions={transactions}
                            transactionsLoading={transactionsLoading}
                            transactionsError={transactionsError}
                            loadTransactions={loadTransactions}
                        />
                    </Stack>
                </main>
            </FooterLayout>
        </NavBarLayout>
    );
}

export default TrainerHome;