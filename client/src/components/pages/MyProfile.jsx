import { useTranslation } from "react-i18next";
import Stack from "../containers/Stack";
import styles from "./MyProfile.module.css";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import Title from "../text/Title";
import useRequest from "../../hooks/useRequest";
import { useSystemMessage } from "../../app/useSystemMessage";
import api from "../../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import RatingsContainer from "../layout/RatingsContainer";
import ComplaintsContainer from "../layout/ComplaintsContainer";
import ModifyUserForm from "../form/forms/ModifyUserForm";
import ModifyConfigForm from "../form/forms/ModifyConfigForm";
import ModifyTrainerForm from "../form/forms/ModifyTrainerForm";
import SubmitFormButton from "../form/buttons/SubmitFormButton";
import NonBackgroundButton from "../form/buttons/NonBackgroundButton";
import { resetUser, updateUser } from "../../slices/user/userSlice";
import { useConfirmIdentityCallback } from "../../app/useConfirmIdentityCallback";
import { validateModifyUserRequestData, validateTrainerPostRequestData } from "../../utils/validators/formValidator";
import TrainerCRCInfo from "../layout/TrainerCRCInfo";
import PhotoInput from "../form/fields/PhotoInput";
import BackButton from "../form/buttons/BackButton";
import Alert from "../messages/Alert";
import MercadopagoConnectButton from "../layout/MercadopagoConnectButton";
import ClientTrainingContractCard from "../cards/user/ClientTrainingContractCard";
import { cleanCacheData, getCacheData, setCacheData } from "../../utils/cache/operations";
import { verifyIsClient, verifyIsTrainer } from "../../utils/requests/verifyUserType";

function MyProfile() {
    const { t } = useTranslation();
    
    const navigate = useNavigate();

    const location = useLocation();

    const dispatch = useDispatch();

    const { setHandleOnConfirmed } = useConfirmIdentityCallback();

    const { notify, confirm } = useSystemMessage();

    const hasRun = useRef(false);

    const { request: getRatings, loading: ratingsLoading } = useRequest();
    const { request: getComplaints, loading: complaintsLoading } = useRequest();
    const { request: cancelClientContract } = useRequest();
    const { request: getTrainerInfoReq } = useRequest();
    const { request: getUserEmailReq } = useRequest();
    const { request: deactivateProfileReq } = useRequest();
    const { request: deleteAccountReq } = useRequest();
    const { request: logoutReq } = useRequest();
    const { request: modifyUserReq } = useRequest();
    const { request: modifyConfigReq } = useRequest();
    const { request: modifyTrainerReq } = useRequest();
    const { request: modifyPhotoReq } = useRequest();
    const { request: getIdReq } = useRequest();
    const { request: verifyEmailReq } = useRequest();
    const { request: toggleContractsPauseReq } = useRequest();
    const { request: isClient } = useRequest();
    const { request: isTrainer } = useRequest();
    const { request: getClientTraining, loading: trainingLoading } = useRequest();

    const user = useSelector(state => state.user);

    const clientTrainingStorageKey = "clientTraining";
    const ratingsLimit = 10;
    const complaintsLimit = 10;

    const [usedEmail, setUsedEmail] = useState("");
    const [changedUser, setChangedUser] = useState({
        name: user.name,
        email: "",
        isDarkTheme: user.config.isDarkTheme,
        isComplainterAnonymous: user.config.isComplainterAnonymous,
        isRaterAnonymous: user.config.isRaterAnonymous,
        emailNotificationPermission: user.config.emailNotificationPermission,
        isEnglish: user.config.isEnglish,
    });
    const [trainerInfo, setTrainerInfo] = useState({
        crefNumber: user.crefNumber,
        newCrefNumber: "",
        newCrefUF: "",
        description: user.description || "",
        rate: "",
        ratesNumber: "",
        contractsNumber: "",
        complaintsNumber: "",
        maxActiveContracts: "",
        hasConnectedMP: false,
        isContractsPaused: false
    });
    const [prevMaxActiveContracts, setPrevMaxActiveContracts] = useState("");
    const [ratings, setRatings] = useState([]);
    const [ratingsError, setRatingsError] = useState(false);
    const [ratingsOffset, setRatingsOffset] = useState(0);
    const [complaints, setComplaints] = useState([]);
    const [complaintsError, setComplaintsError] = useState(false);
    const [complaintsOffset, setComplaintsOffset] = useState(0);
    const [modifyUserError, setModifyUserError] = useState(false);
    const [modifyTrainerError, setModifyTrainerError] = useState(false);
    const [clientTraining, setClientTraining] = useState(null);
    const [clientTrainingError, setClientTrainingError] = useState(false);

    const loadRatings = useCallback((hasError, updatedRatings, offset) => {
        if (hasError) return;

        if ((updatedRatings.length < ratingsLimit && updatedRatings.length !== 0) || updatedRatings.length % ratingsLimit !== 0 || (offset !== 0 && updatedRatings.length === 0)) {
            notify(t("noRatings"));

            return;
        }

        const getMoreRatings = () => {
            return api.get(`/trainers/me/ratings`, { 
                params: { 
                    offset: offset, 
                    limit: ratingsLimit
                }
            });
        }
        
        const handleOnGetRatingsSuccess = (data) => {            
            setRatings(prevRatings => [...prevRatings, ...data]);

            setRatingsOffset(offset + ratingsLimit);
        };
    
        const handleOnGetRatingsError = () => {
            setRatingsError(true);
        };

        const isFirstLoading = offset === 0;
    
        getRatings(
            getMoreRatings, 
            handleOnGetRatingsSuccess, 
            handleOnGetRatingsError, 
            !isFirstLoading ? t("loadingRatings") : undefined, 
            !isFirstLoading ? t("successRatings") : undefined, 
            t("errorRatings")
        );
    }, [getRatings, notify, t]);
    
    const loadComplaints = useCallback((hasError, updatedComplaints, offset) => {
        if (hasError) return;

        if ((updatedComplaints.length < complaintsLimit && updatedComplaints.length !== 0) || updatedComplaints.length % complaintsLimit !== 0 || (offset !== 0 && updatedComplaints.length === 0)) {
            notify(t("noComplaints"));

            return;
        }

        const getMoreComplaints = () => {
            return api.get(`/trainers/me/complaints`, { 
                params: { 
                    offset: offset, 
                    limit: complaintsLimit
                }
            });
        }
        
        const handleOnGetComplaintsSuccess = (data) => {            
            setComplaints(prevComplaints => [...prevComplaints, ...data]);

            setComplaintsOffset(offset + complaintsLimit);
        };
    
        const handleOnGetComplaintsError = () => {
            setComplaintsError(true);
        };
    
        const isFirstLoading = offset === 0;

        getComplaints(
            getMoreComplaints, 
            handleOnGetComplaintsSuccess, 
            handleOnGetComplaintsError, 
            !isFirstLoading ? t("loadingComplaints") : undefined, 
            !isFirstLoading ? t("successComplaints") : undefined, 
            t("errorComplaints")
        );
    }, [getComplaints, notify, t]);

    useEffect(() => {
        if (hasRun.current) return;
                
        hasRun.current = true;
        
        const fetchData = async () => {
            const updatedEmail = location.state?.updatedEmail;

            if (updatedEmail) {
                setUsedEmail(updatedEmail);

                setChangedUser(prevUser => ({ ...prevUser, email: updatedEmail }));
            } else {
                const getEmail = () => {
                    return api.get(`/users/me/email`);
                }
            
                const handleOnGetEmailSuccess = (data) => {
                    setUsedEmail(data.email);
    
                    setChangedUser(prevUser => ({ ...prevUser, email: data.email }));
                };
    
                const handleOnGetEmailError = () => {
                    navigate("/");
                };
    
                getUserEmailReq(
                    getEmail, 
                    handleOnGetEmailSuccess, 
                    handleOnGetEmailError, 
                    t("loadingUserInfo"), 
                    undefined, 
                    t("errorLoadingUserInfo")
                );
            }

            if (user.config.isClient) {
                const success = await verifyIsClient(isClient, user, navigate, notify, t);

                if (!success) return;

                const cachedData = getCacheData(clientTrainingStorageKey);
                
                if (cachedData) {
                    setClientTraining(cachedData);
                    
                    return;
                }
                
                const getTraining = () => {
                    return api.get(`/me/training-contract`);
                }
                
                const handleOnGetClientTrainingSuccess = (data) => {
                    setClientTraining(data);

                    setCacheData(clientTrainingStorageKey, data);
                };
            
                const handleOnGetClientTrainingError = () => {
                    setClientTrainingError(true);
                };

                getClientTraining(
                    getTraining, 
                    handleOnGetClientTrainingSuccess, 
                    handleOnGetClientTrainingError, 
                    undefined, 
                    undefined, 
                    t("errorTrainingContract")
                );
            } else {
                const success = await verifyIsTrainer(isTrainer, user, navigate, notify, t);

                if (!success) return;

                const getTrainerInfo = () => {
                    return api.get(`/trainers/me/base-info`);
                }
            
                const handleOnGetTrainerInfoSuccess = (data) => {
                    setTrainerInfo(prevInfo => ({ ...prevInfo, ...data }));
    
                    setPrevMaxActiveContracts(data.maxActiveContracts);
                };
    
                getTrainerInfoReq(
                    getTrainerInfo, 
                    handleOnGetTrainerInfoSuccess, 
                    () => undefined, 
                    t("loadingTrainer"), 
                    undefined, 
                    t("errorLoadingTrainer")
                );
    
                loadRatings(ratingsError, ratings, ratingsOffset);
    
                loadComplaints(complaintsError, complaints, complaintsOffset);
            }
        }

        fetchData();
    }, [complaints, complaintsError, complaintsOffset, getClientTraining, getTrainerInfoReq, getUserEmailReq, isClient, isTrainer, loadComplaints, loadRatings, location.state?.updatedEmail, navigate, notify, ratings, ratingsError, ratingsOffset, t, user, user.config.isClient]);

    const handleOnToggleContractsPaused = useCallback(async (e) => {
        e.preventDefault();

        const userConfirmed = await confirm(t(trainerInfo.isContractsPaused ? "unpauseContractsConfirm" : "pauseContractsConfirm"));
        
        if (userConfirmed) {
            const toggleContractsPause = () => {
                return api.put(`/trainers/me/toggle-contracts-paused`);
            }
        
            const handleOnToggleSuccess = (data) => {
                setTrainerInfo(prevTrainer => ({ ...prevTrainer, isContractsPaused: data.isPaused }));
            };
    
            toggleContractsPauseReq(
                toggleContractsPause, 
                handleOnToggleSuccess, 
                () => undefined, 
                t(trainerInfo.isContractsPaused ? "loadingContractsUnpaused" : "loadingContractsPaused"), 
                undefined, 
                t(trainerInfo.isContractsPaused ? "errorContractsUnpaused" : "errorContractsPaused")
            );
        }
    }, [confirm, t, trainerInfo.isContractsPaused, toggleContractsPauseReq]);

    const handleOnDeactivateProfile = useCallback(async (e) => {
        e.preventDefault();

        const userConfirmed = await confirm(t("deactivateProfileConfirm"));
        
        if (userConfirmed) {
            const deactivateProfile = () => {
                return api.put(`/users/me/deactivate-profile`);
            }
        
            const handleOnDeactivateSuccess = () => {
                dispatch(resetUser());

                navigate("/login");
            };
    
            deactivateProfileReq(
                deactivateProfile, 
                handleOnDeactivateSuccess, 
                () => undefined, 
                t("loadingDeactivateProfile"), 
                t("successDeactivateProfile"), 
                t("errorDeactivateProfile")
            );
        }
    }, [confirm, deactivateProfileReq, dispatch, navigate, t]);

    const handleOnDeleteAcount = useCallback(async (e) => {
        e.preventDefault();

        const userConfirmed = await confirm(t("deleteAccountConfirm"));
        
        if (userConfirmed) {
            navigate("/code-confirmation", { state: { localUser: { email: usedEmail }, origin: "deleteAccount" } });

            setHandleOnConfirmed(() => () => {
                const deleteAccount = () => {
                    return api.delete(`/users/me`);
                }
            
                const handleOnDeleteSuccess = () => {
                    dispatch(resetUser());

                    navigate("/login");
                };
        
                deleteAccountReq(
                    deleteAccount, 
                    handleOnDeleteSuccess, 
                    () => undefined, 
                    t("loadingDeleteAccount"), 
                    t("successDeleteAccount"), 
                    t("errorDeleteAccount")
                );
            });
        }
    }, [confirm, deleteAccountReq, dispatch, navigate, setHandleOnConfirmed, t, usedEmail]);
    
    const handleOnLogout = useCallback(async () => {
        const userConfirmed = await confirm(t("logoutConfirm"));
        
        if (userConfirmed) {
            const logout = () => {
                return api.delete(`/logout`);
            }
        
            const handleOnLogoutSuccess = () => {
                dispatch(resetUser());

                navigate("/login");
            };
    
            logoutReq(
                logout, 
                handleOnLogoutSuccess, 
                () => undefined, 
                t("loadingLogout"), 
                undefined, 
                t("errorLogout")
            );
        }
    }, [confirm, dispatch, logoutReq, navigate, t]);

    const handleOnModifyPhoto = useCallback(async (e) => {
        const file = e.target.files[0];

        const formData = new FormData();

        formData.append("photoFile", file);
        
        const modifyPhoto = () => {
            return api.put(`/users/me/photo`, formData);
        }
    
        const handleOnModifyPhotoSuccess = (data) => {
            dispatch(updateUser({ config: { photoUrl: data.photoUrl } }));
        };

        modifyPhotoReq(
            modifyPhoto, 
            handleOnModifyPhotoSuccess, 
            () => undefined, 
            t("loadingModifyPhoto"), 
            undefined, 
            `${t("errorModifyPhoto")} ${t("photoAlert")}`
        );
    }, [dispatch, modifyPhotoReq, t]);

    const handleOnModifyUser = useCallback(async (e) => {
        e.preventDefault();

        if (!validateModifyUserRequestData(
            modifyUserError, 
            setModifyUserError, 
            changedUser.name, 
            changedUser.email
        )) return;
        
        const formData = new FormData();
        
        if (user.name !== changedUser.name) formData.append("name", changedUser.name);

        if (usedEmail !== changedUser.email) formData.append("email", changedUser.email);
        
        const req = () => {
            const putUser = () => {
                return api.put("/users/me", formData);
            }
        
            const handleOnPutUserSuccess = (data) => {
                dispatch(updateUser(data.user));

                if (data.email) navigate("/me", { state: { updatedEmail: data.email } });
            };
        
            const handleOnPutUserError = () => {
                setModifyUserError(true);

                if (usedEmail !== changedUser.email) navigate("/me");
            };
        
            modifyUserReq(
                putUser,
                handleOnPutUserSuccess, 
                handleOnPutUserError, 
                t("loadingModifyUser"), 
                t("successModifyUser"), 
                t("errorModifyUser")
            );
        }

        if (usedEmail !== changedUser.email) {
            const userConfirmed = await confirm(t("modifyEmailConfirm"));
            
            if (userConfirmed) {
                const verifyEmail = () => {
                    return api.post("/sign-up", formData);
                }
            
                const handleOnVerifyEmailSuccess = () => {
                    navigate("/code-confirmation", { state: { localUser: { email: changedUser.email }, origin: "modifyEmail" } });
                    
                    setHandleOnConfirmed(() => () => {
                        req();
                    });
                };
            
                const handleOnVerifyEmailError = () => {
                    setModifyUserError(true);
                };
            
                verifyEmailReq(
                    verifyEmail,
                    handleOnVerifyEmailSuccess, 
                    handleOnVerifyEmailError, 
                    t("loadingCheckData"), 
                    undefined, 
                    t("errorSignUp")
                );
            }
        } else {
            req();
        }
    }, [changedUser.email, changedUser.name, confirm, dispatch, modifyUserError, modifyUserReq, navigate, setHandleOnConfirmed, t, usedEmail, user.name, verifyEmailReq]);

    const handleOnModifyConfig = useCallback((e) => {
        e.preventDefault();

        const formData = new FormData();

        if (changedUser.isDarkTheme !== user.config.isDarkTheme) formData.append("isDarkTheme", changedUser.isDarkTheme);

        if (changedUser.isComplainterAnonymous !== user.config.isComplainterAnonymous) formData.append("isComplainterAnonymous", changedUser.isComplainterAnonymous);

        if (changedUser.isRaterAnonymous !== user.config.isRaterAnonymous) formData.append("isRaterAnonymous", changedUser.isRaterAnonymous);

        if (changedUser.emailNotificationPermission !== user.config.emailNotificationPermission) formData.append("emailNotificationPermission", changedUser.emailNotificationPermission);

        if (changedUser.isEnglish !== user.config.isEnglish) formData.append("isEnglish", changedUser.isEnglish);

        const putConfig = () => {
            return api.put("/users/me", formData);
        }
    
        const handleOnPutConfigSuccess = (data) => {
            dispatch(updateUser(data.user));
        };
    
        modifyConfigReq(
            putConfig,
            handleOnPutConfigSuccess, 
            () => undefined, 
            t("loadingModifyConfig"), 
            t("successModifyConfig"), 
            t("errorModifyConfig")
        );
    }, [changedUser.emailNotificationPermission, changedUser.isComplainterAnonymous, changedUser.isDarkTheme, changedUser.isEnglish, changedUser.isRaterAnonymous, dispatch, modifyConfigReq, t, user.config.emailNotificationPermission, user.config.isComplainterAnonymous, user.config.isDarkTheme, user.config.isEnglish, user.config.isRaterAnonymous]);

    const handleOnModifyTrainer = useCallback((e) => {
        e.preventDefault();

        if (!validateTrainerPostRequestData(
            modifyTrainerError, 
            setModifyTrainerError, 
            trainerInfo.newCrefNumber, 
            trainerInfo.description, 
            trainerInfo.newCrefUF,
            trainerInfo.maxActiveContracts
        )) return;
       
        const formData = new FormData();

        if ((trainerInfo.description ?? "") !== (user.description ?? "")) formData.append("description", trainerInfo.description);
        
        if (prevMaxActiveContracts !== trainerInfo.maxActiveContracts) formData.append("maxActiveContracts", trainerInfo.maxActiveContracts);
        
        if (trainerInfo.newCrefNumber && trainerInfo.newCrefUF) formData.append("crefNumber", `${trainerInfo.newCrefNumber}/${trainerInfo.newCrefUF}`);

        const putTrainer = () => {
            return api.put("/trainers/me", formData);
        }
    
        const handleOnPutTrainerSuccess = (data) => {
            dispatch(updateUser({ ...data, maxActiveContracts: undefined }));

            setTrainerInfo(prevInfo => ({
                ...prevInfo,
                crefNumber: data.crefNumber || prevInfo.crefNumber,
                newCrefNumber: "",
                newCrefUF: "",
                maxActiveContracts: data.maxActiveContracts || prevInfo.maxActiveContracts
            }));

            if (data.maxActiveContracts) setPrevMaxActiveContracts(data.maxActiveContracts)
        };
    
        const handleOnPutTrainerError = () => {
            setModifyTrainerError(true);
        };
    
        modifyTrainerReq(
            putTrainer,
            handleOnPutTrainerSuccess, 
            handleOnPutTrainerError, 
            t("loadingModifyTrainer"), 
            t("successModifyTrainer"), 
            t("errorModifyTrainer")
        );
    }, [dispatch, modifyTrainerError, modifyTrainerReq, prevMaxActiveContracts, t, trainerInfo.description, trainerInfo.maxActiveContracts, trainerInfo.newCrefNumber, trainerInfo.newCrefUF, user.description]);

    const handleOnConnectMP = useCallback(async () => {
        const getId = () => {
            return api.get(`/me/id`);
        }
    
        const handleOnGetIdSuccess = (data) => {
            window.location.href = `${import.meta.env.VITE_API_URL}/mercadopago/connect/${data.ID}`;
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

    const cancelContract = useCallback(async (e) => {
        e.preventDefault();

        const userConfirmed = await confirm(t("cancelContractConfirm"));
        
        if (userConfirmed) {
            navigate("/code-confirmation", { state: { localUser: { email: usedEmail }, origin: "cancelContract" } });

            setHandleOnConfirmed(() => () => {
                const cancelContract = () => {
                    return api.put(`/me/active-contract`);
                }
            
                const handleOnCancelContractSuccess = () => {
                    setClientTraining(null);

                    cleanCacheData(clientTrainingStorageKey);
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
    }, [cancelClientContract, confirm, navigate, setHandleOnConfirmed, t, usedEmail]);

    const userHasChanged = useMemo(() => {
        if (
            usedEmail !== changedUser.email ||
            user.name !== changedUser.name
        ) {
            return true;
        }

        return false
    }, [changedUser.email, changedUser.name, usedEmail, user.name]);

    const configHasChanged = useMemo(() => {
        if (
          changedUser.isDarkTheme !== user.config.isDarkTheme ||  
          changedUser.isComplainterAnonymous !== user.config.isComplainterAnonymous ||  
          changedUser.isRaterAnonymous !== user.config.isRaterAnonymous ||  
          changedUser.emailNotificationPermission !== user.config.emailNotificationPermission ||  
          changedUser.isEnglish !== user.config.isEnglish
        ) {
            return true;
        }

        return false
    }, [changedUser.emailNotificationPermission, changedUser.isComplainterAnonymous, changedUser.isDarkTheme, changedUser.isEnglish, changedUser.isRaterAnonymous, user.config.emailNotificationPermission, user.config.isComplainterAnonymous, user.config.isDarkTheme, user.config.isEnglish, user.config.isRaterAnonymous]);

    const trainerHasChanged = useMemo(() => {
        if (
            ((trainerInfo.description ?? "") !== (user.description ?? "")) ||
            trainerInfo.newCrefNumber || 
            trainerInfo.newCrefUF ||
            (trainerInfo.maxActiveContracts !== prevMaxActiveContracts)
        ) {
            return true;
        }

        return false
    }, [prevMaxActiveContracts, trainerInfo.description, trainerInfo.maxActiveContracts, trainerInfo.newCrefNumber, trainerInfo.newCrefUF, user.description]);
    
    useEffect(() => {
        document.title = t("personalProfile")
    }, [t]);

    return (
        <main
            className={styles.my_profile_page}
        >
            <BackButton
                destiny="/"
            />

            <Stack
                gap="4em"
            >
                <Stack>
                    <Title
                        headingNumber={1}
                        text={t("personalProfile")}
                        varColor="--theme-color"
                    />
                </Stack>

                <Stack
                    gap="5em"
                >
                    <Stack
                        gap="4em"
                    >
                        <PhotoInput
                            name="photoFile"
                            size="large"
                            blobUrl={user.config.photoUrl}
                            handleChange={handleOnModifyPhoto}
                        />
                        
                        <ModifyUserForm
                            changedUser={changedUser}
                            setChangedUser={setChangedUser}
                            setModifyUserError={setModifyUserError}
                            handleSubmit={handleOnModifyUser}
                            hasChanged={userHasChanged}
                        />

                        {!user.config.isClient && (
                            <Stack
                                gap="2em"
                            >
                                <TrainerCRCInfo
                                    rate={trainerInfo.rate}
                                    complaintsNumber={trainerInfo.complaintsNumber}
                                    contractsNumber={trainerInfo.contractsNumber}
                                />
                                
                                <ModifyTrainerForm
                                    changedTrainer={trainerInfo}
                                    setChangedTrainer={setTrainerInfo}
                                    setModifyTrainerError={setModifyTrainerError}
                                    handleSubmit={handleOnModifyTrainer}
                                    hasChanged={trainerHasChanged}
                                />
                            </Stack>
                        )}

                        <ModifyConfigForm
                            changedConfig={changedUser}
                            setChangedConfig={setChangedUser}
                            handleSubmit={handleOnModifyConfig}
                            hasChanged={configHasChanged}
                        />
                    </Stack>

                    {!user.config.isClient && (
                        <Stack
                            gap="5em"
                        >
                            <RatingsContainer
                                ratings={ratings}
                                ratingsError={ratingsError}
                                ratingsOffset={ratingsOffset}
                                ratingsLoading={ratingsLoading}
                                handleLoadRatings={loadRatings}
                                trainerRate={trainerInfo.rate}
                                trainerRatesNumber={trainerInfo.ratesNumber}
                            />
        
                            <ComplaintsContainer
                                complaints={complaints}
                                complaintsError={complaintsError}
                                complaintsOffset={complaintsOffset}
                                complaintsLoading={complaintsLoading}
                                handleLoadComplaints={loadComplaints}
                                trainerComplaintsNumber={trainerInfo.complaintsNumber}
                            />
                        </Stack>
                    )}
                </Stack>

                <Stack
                    gap="3em"
                    alignItems="end"
                >
                    {!user.config.isClient && (
                        <Stack
                            alignItems="start"
                        >
                            <hr/>

                            {trainerInfo.hasConnectedMP ? (
                                <Stack
                                    className={styles.mercadopago_img_container}
                                    direction="row"
                                    justifyContent="start"
                                >
                                    <img
                                        src="/images/icons/mercadopago.png"
                                        alt=""
                                    />

                                    <p>
                                        {t("alreadyMPConnected")}
                                    </p>
                                </Stack>
                            ) : (
                                <>
                                    <MercadopagoConnectButton
                                        handleConnect={handleOnConnectMP}
                                    />

                                    <Stack
                                        direction="row"
                                        justifyContent="start"
                                    >
                                        <Alert />
        
                                        {t("connectMPInstruction")}
                                    </Stack>
                                </>
                            )}

                            <hr/>
                        </Stack>
                    )}

                    <Stack
                        gap="3em"
                    >
                        {!user.config.isClient ? (
                            <form
                                onSubmit={handleOnToggleContractsPaused}
                            >   
                                <Stack
                                    alignItems="start"
                                >
                                    <SubmitFormButton
                                        text={t(trainerInfo.isContractsPaused ? "unpauseContracts" : "pauseContracts")}
                                        varBgColor="--light-theme-color"
                                    />

                                    {!trainerInfo.isContractsPaused && (
                                        <Stack
                                            direction="row"
                                            justifyContent="start"
                                        >
                                            <Alert />
            
                                            {t("pauseContractsInstruction")}
                                        </Stack>
                                    )}
                                </Stack>
                            </form>
                        ) : (
                            <Stack>
                                <Title
                                    headingNumber={2}
                                    text={t("yourTraining")}
                                />

                                {trainingLoading || !clientTraining || clientTrainingError ? (
                                    clientTrainingError ? (
                                        <p>
                                            {t("errorOcurredTrainingContract")}

                                            <br/>
                                            
                                            {t("reloadOrTryLater")}
                                        </p>
                                    ) : (
                                        <p>
                                            {t("noContractActive")}

                                            <br/>

                                            {t("searchTrainersInstruction")}
                                        </p>
                                    )
                                ) : (
                                    <ClientTrainingContractCard
                                        trainerName={clientTraining.trainer?.name} 
                                        trainerPhotoUrl={clientTraining.trainer?.photoUrl} 
                                        trainerCrefNumber={clientTraining.trainer?.crefNumber} 
                                        trainingPlanID={clientTraining.trainingPlan?.ID}
                                        trainingPlanName={clientTraining.trainingPlan?.name} 
                                        contractStartDate={clientTraining.contract?.startDate} 
                                        contractEndDate={clientTraining.contract?.endDate} 
                                        handleCancelContract={cancelContract}
                                    />
                                )}
                            </Stack>
                        )}

                        <Stack>
                            <form
                                onSubmit={handleOnDeactivateProfile}
                            >   
                                <SubmitFormButton
                                    text={t("deactivateProfile")}
                                    varBgColor="--alert-color"
                                />
                            </form>

                            <form
                                onSubmit={handleOnDeleteAcount}
                            >   
                                <SubmitFormButton
                                    text={t("deleteProfile")}
                                    varBgColor="--alert-color"
                                />
                            </form>

                        </Stack>
                    </Stack>

                    <NonBackgroundButton
                        text={t("logout")}
                        handleClick={handleOnLogout}
                        varColor="--theme-color"
                    />
                </Stack>
            </Stack>
        </main>
    );
}

export default MyProfile;
