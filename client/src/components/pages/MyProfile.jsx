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
import { validateClientPostRequestData, validateModifyUserRequestData, validateTrainerPostRequestData } from "../../utils/validators/formValidator";
import TrainerCRCInfo from "../layout/TrainerCRCInfo";
import PhotoInput from "../form/fields/PhotoInput";
import BackButton from "../layout/BackButton";
import Alert from "../messages/Alert";
import MercadopagoConnectButton from "../layout/MercadopagoConnectButton";
import { getCacheData, setCacheData } from "../../utils/cache/operations";
import { verifyIsClient, verifyIsTrainer } from "../../utils/requests/verifyUserType";
import FooterLayout from "../containers/FooterLayout";
import SpecialtiesContainer from "../layout/SpecialtiesContainer";
import ModifyClientForm from "../form/forms/ModifyClientForm";
import getAndSetInitialData from "../../utils/requests/initialData";
import useGets from "../../hooks/useGetRequest";

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
    const { request: getTrainerInfoReq } = useRequest();
    const { request: getClientInfoReq } = useRequest();
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
    const { request: getSpecialtiesReq, loading: specialtiesLoading } = useRequest();
    const { getMuscles } = useGets();

    const user = useSelector(state => state.user);

    const emailStorageKey = "fitxEmail";
    const specialtiesStorageKey = "trainerSpecialties";
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
    const [clientInfo, setClientInfo] = useState({
        sex: {
            ID: "preferNotToAnswer"
        },
        birthDate: "",
        height: "",
        weight: "",
        limitationsDescription: "",
        availableDays: "",
        weekMuscles: []
    });
    const [sexes, setSexes] = useState([
        {
            ID: "male",
            isSelected: false
        },
        {
            ID: "female",
            isSelected: false
        },
        {
            ID: "preferNotToAnswer",
            isSelected: true
        }
    ]);
    const [muscles, setMuscles] = useState([]);
    const [clientChangedInfo, setClientChangedInfo] = useState({
        birthDate: "",
        height: "",
        weight: "",
        limitationsDescription: "",
        availableDays: ""
    });
    const [prevMaxActiveContracts, setPrevMaxActiveContracts] = useState("");
    const [ratings, setRatings] = useState([]);
    const [ratingsError, setRatingsError] = useState(false);
    const [ratingsOffset, setRatingsOffset] = useState(0);
    const [complaints, setComplaints] = useState([]);
    const [complaintsError, setComplaintsError] = useState(false);
    const [complaintsOffset, setComplaintsOffset] = useState(0);
    const [specialties, setSpecialties] = useState({
        mainSpecialties: [],
        secondarySpecialties: []
    });
    const [specialtiesError, setSpecialtiesError] = useState(false);
    const [modifyUserError, setModifyUserError] = useState(false);
    const [modifyTrainerError, setModifyTrainerError] = useState(false);
    const [modifyClientError, setModifyClientError] = useState(false);

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
                const cachedEmailData = getCacheData(emailStorageKey);

                if (cachedEmailData) {
                    setUsedEmail(cachedEmailData);

                    setChangedUser(prevUser => ({ ...prevUser, email: cachedEmailData }));
                } else {
                    const getEmail = () => {
                        return api.get(`/users/me/email`);
                    }
                
                    const handleOnGetEmailSuccess = (data) => {
                        setUsedEmail(data.email);
        
                        setChangedUser(prevUser => ({ ...prevUser, email: data.email }));
    
                        setCacheData(emailStorageKey, data.email);
                    };
        
                    const handleOnGetEmailError = () => {
                        navigate("/");
                    };
        
                    getUserEmailReq(
                        getEmail, 
                        handleOnGetEmailSuccess, 
                        handleOnGetEmailError, 
                        undefined, 
                        undefined, 
                        t("errorLoadingUserInfo")
                    );
                }
            }

            if (user.config.isClient) {
                const success = await verifyIsClient(isClient, user, navigate, notify, t);

                if (!success) return;

                getAndSetInitialData(
                    getMuscles,
                    setMuscles,
                    undefined,
                    navigate,
                    undefined,
                    "muscleGroups"
                );

                const getClientInfo = () => {
                    return api.get(`/me/client-info`);
                }
            
                const handleOnGetClientInfoSuccess = (data) => {
                    setClientInfo(data);

                    setClientChangedInfo({ ...data, sex: undefined, weekMuscles: undefined });

                    setSexes(prevSexes => prevSexes.map((sex) => ({ ...sex, isSelected: sex.ID === (data.sex?.ID ?? "preferNotToAnswer") })));

                    setMuscles(prevMuscles => prevMuscles.map((muscle) => ({ ...muscle, isSelected: (data.weekMuscles ?? []).some((m) => m.ID === muscle.ID) })));
                };
    
                getClientInfoReq(
                    getClientInfo, 
                    handleOnGetClientInfoSuccess, 
                    () => undefined, 
                    undefined, 
                    undefined, 
                    t("errorLoadingUserInfo")
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
                    undefined, 
                    undefined, 
                    t("errorLoadingTrainer")
                );

                const cachedSpecialties = getCacheData(specialtiesStorageKey);

                if (cachedSpecialties) {
                    setSpecialties(cachedSpecialties);
                } else {
                    const getSpecialties = () => {
                        return api.get(`/trainers/me/specialties`);
                    }
                
                    const handleOnGetSpecialtiesSuccess = (data) => {
                        setSpecialties(data);
    
                        setCacheData(specialtiesStorageKey, data);
                    };
    
                    const handleOnGetSpecialtiesError = () => {
                        setSpecialtiesError(true);
                    };
    
                    getSpecialtiesReq(
                        getSpecialties, 
                        handleOnGetSpecialtiesSuccess, 
                        handleOnGetSpecialtiesError, 
                        undefined, 
                        undefined, 
                        t("errorLoadingSpecialties")
                    );
                }
    
                loadRatings(ratingsError, ratings, ratingsOffset);
    
                loadComplaints(complaintsError, complaints, complaintsOffset);
            }
        }

        fetchData();
    }, [complaints, complaintsError, complaintsOffset, getClientInfoReq, getMuscles, getSpecialtiesReq, getTrainerInfoReq, getUserEmailReq, isClient, isTrainer, loadComplaints, loadRatings, location.state?.updatedEmail, navigate, notify, ratings, ratingsError, ratingsOffset, t, user]);

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

                sessionStorage.clear();

                navigate("/introduction");
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

                    sessionStorage.clear();

                    navigate("/introduction");
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

                sessionStorage.clear();

                navigate("/introduction");
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

                if (data.email) {
                    navigate("/me", { state: { updatedEmail: data.email } });

                    setCacheData(emailStorageKey, data.email);
                }
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
            if (changedUser.isEnglish !== user.config.isEnglish) sessionStorage.clear();

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

    const handleOnModifyClient = useCallback((e) => {
        e.preventDefault();

        if (!validateClientPostRequestData(
            modifyClientError, 
            setModifyClientError, 
            clientChangedInfo.height,
            clientChangedInfo.weight,
            clientChangedInfo.birthDate,
            clientChangedInfo.availableDays,
            clientChangedInfo.limitationsDescription
        )) return;
       
        const formData = new FormData();

        const selectedMuscleIds = muscles.filter(m => m.isSelected).map(m => m.ID);
        const originalMuscleIds = (clientInfo.weekMuscles ?? []).map(m => m.ID);

        const musclesChanged = selectedMuscleIds.length !== originalMuscleIds.length || !selectedMuscleIds.every(id => originalMuscleIds.includes(id));

        if ((clientInfo.sex.ID ?? "") !== (sexes.find(sex => sex.isSelected)?.ID ?? "")) formData.append("sex", sexes.find(sex => sex.isSelected)?.ID) 

        if ((clientInfo.birthDate ?? "") !== (clientChangedInfo.birthDate ?? "")) formData.append("birthDate", clientChangedInfo.birthDate) 
        
        if ((clientInfo.height ?? "") !== (clientChangedInfo.height ?? "")) formData.append("height", clientChangedInfo.height) 
        
        if ((clientInfo.weight ?? "") !== (clientChangedInfo.weight ?? "")) formData.append("weight", clientChangedInfo.weight) 
        
        if ((clientInfo.limitationsDescription ?? "") !== (clientChangedInfo.limitationsDescription ?? "")) formData.append("limitationsDescription", clientChangedInfo.limitationsDescription) 
        
        if ((clientInfo.availableDays ?? "") !== (clientChangedInfo.availableDays ?? "")) formData.append("availableDays", clientChangedInfo.availableDays) 
        
        if (musclesChanged) {
            if (selectedMuscleIds.length === 0) {
                formData.append("weekMuscles[]", []);
            } else {
                muscles.forEach((muscle) => {
                    if (muscle.isSelected) {
                        formData.append("weekMuscles[]", muscle.ID);
                    }
                });
            }
        }

        const putUser = () => {
            return api.put("/me/client-info", formData);
        }
    
        const handleOnPutUserSuccess = (data) => {
            setClientInfo(prevInfo => ({ ...prevInfo, ...data }));

            setClientChangedInfo(prevInfo => ({ ...prevInfo, ...data, sex: undefined, weekMuscles: undefined }));

            if (data.sex) {
                setSexes(prevSexes => prevSexes.map((sex) => ({ ...sex, isSelected: sex.ID === (data.sex?.ID ?? "preferNotToAnswer") })));
            }

            if (data.weekMuscles) {
                setMuscles(prevMuscles => prevMuscles.map((muscle) => ({ ...muscle, isSelected: (data.weekMuscles ?? []).some((m) => m.ID === muscle.ID) })));
            }
        };
    
        const handleOnPutUserError = () => {
            setModifyUserError(true);
        };
    
        modifyUserReq(
            putUser,
            handleOnPutUserSuccess, 
            handleOnPutUserError, 
            t("loadingModifyUser"), 
            t("successModifyUser"), 
            t("errorModifyUser")
        );
    }, [clientChangedInfo.availableDays, clientChangedInfo.birthDate, clientChangedInfo.height, clientChangedInfo.limitationsDescription, clientChangedInfo.weight, clientInfo.availableDays, clientInfo.birthDate, clientInfo.height, clientInfo.limitationsDescription, clientInfo.sex.ID, clientInfo.weekMuscles, clientInfo.weight, modifyClientError, modifyUserReq, muscles, sexes, t]);
    
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
    
    const clientHasChanged = useMemo(() => {
        const selectedMuscleIds = muscles.filter(m => m.isSelected).map(m => m.ID);
        const originalMuscleIds = (clientInfo.weekMuscles ?? []).map(m => m.ID);

        const musclesChanged = selectedMuscleIds.length !== originalMuscleIds.length || !selectedMuscleIds.every(id => originalMuscleIds.includes(id));

        if (
            ((clientInfo.sex.ID ?? "") !== (sexes.find(sex => sex.isSelected)?.ID ?? "")) ||  
            ((clientInfo.birthDate ?? "") !== (clientChangedInfo.birthDate ?? "")) ||
            ((clientInfo.height ?? "") !== (clientChangedInfo.height ?? "")) ||
            ((clientInfo.weight ?? "") !== (clientChangedInfo.weight ?? "")) ||
            ((clientInfo.limitationsDescription ?? "") !== (clientChangedInfo.limitationsDescription ?? "")) ||
            ((clientInfo.availableDays ?? "") !== (clientChangedInfo.availableDays ?? "")) ||
            musclesChanged
        ) {
            return true;
        }

        return false
    }, [clientChangedInfo.availableDays, clientChangedInfo.birthDate, clientChangedInfo.height, clientChangedInfo.limitationsDescription, clientChangedInfo.weight, clientInfo.availableDays, clientInfo.birthDate, clientInfo.height, clientInfo.limitationsDescription, clientInfo.sex.ID, clientInfo.weekMuscles, clientInfo.weight, muscles, sexes]);
    
    useEffect(() => {
        document.title = t("personalProfile")
    }, [t]);

    return (
        <FooterLayout>
            <main
                className={styles.my_profile_page}
            >
                <BackButton
                    destiny="/"
                />

                <Stack
                    gap="10em"
                >
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

                                        <SpecialtiesContainer
                                            specialties={specialties}
                                            specialtiesError={specialtiesError}
                                            specialtiesLoading={specialtiesLoading}
                                        />
                                    </Stack>
                                )}

                                {user.config.isClient && (
                                    <ModifyClientForm
                                        client={clientChangedInfo}
                                        setClient={setClientChangedInfo}
                                        setClientError={setModifyClientError}
                                        sexes={sexes}
                                        setSexes={setSexes}
                                        muscleGroups={muscles}
                                        setMuscleGroups={setMuscles}
                                        handleSubmit={handleOnModifyClient}
                                        hasChanged={clientHasChanged}
                                    />
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
                            {!user.config.isClient && (
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
                            )}
                                
                            <Stack
                                gap="1.5em"
                            >
                                <Stack
                                    gap="0.5em"
                                >
                                    <form
                                        onSubmit={handleOnDeactivateProfile}
                                    >   
                                        <SubmitFormButton
                                            text={t("deactivateProfile")}
                                            varBgColor="--alert-color"
                                        />
                                    </form>

                                    {user.config.isClient && (
                                        <Stack
                                            direction="row"
                                            justifyContent="start"
                                        >
                                            <Alert />
            
                                            {t("clientContractFeature7")}
                                        </Stack>
                                    )}
                                </Stack>

                                <Stack
                                    gap="0.5em"
                                >
                                    <form
                                        onSubmit={handleOnDeleteAcount}
                                    >   
                                        <SubmitFormButton
                                            text={t("deleteProfile")}
                                            varBgColor="--alert-color"
                                        />
                                    </form>

                                    {user.config.isClient && (
                                        <Stack
                                            direction="row"
                                            justifyContent="start"
                                        >
                                            <Alert />
            
                                            {t("refundTerm8")}
                                        </Stack>
                                    )}
                                </Stack>
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
        </FooterLayout>
    );
}

export default MyProfile;
