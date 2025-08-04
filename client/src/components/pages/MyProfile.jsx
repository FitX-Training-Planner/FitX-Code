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
    const { request: getUserEmailReq } = useRequest();
    const { request: deactivateProfileReq } = useRequest();
    const { request: deleteAccountReq } = useRequest();
    const { request: logoutReq } = useRequest();
    const { request: modifyUserReq } = useRequest();
    const { request: modifyConfigReq } = useRequest();
    const { request: modifyTrainerReq } = useRequest();
    const { request: modifyPhotoReq } = useRequest();
    const { request: verifyEmailReq } = useRequest();

    const user = useSelector(state => state.user);

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
        crefNumber: user.crefNumber || "",
        newCrefNumber: "",
        newCrefUF: "",
        description: user.description || "",
        rate: "",
        ratesNumber: "",
        contractsNumber: "",
        complaintsNumber: ""
    });
    const [ratings, setRatings] = useState([]);
    const [ratingsError, setRatingsError] = useState(false);
    const [ratingsOffset, setRatingsOffset] = useState(0);
    const [complaints, setComplaints] = useState([]);
    const [complaintsError, setComplaintsError] = useState(false);
    const [complaintsOffset, setComplaintsOffset] = useState(0);
    const [modifyUserError, setModifyUserError] = useState(false);
    const [modifyTrainerError, setModifyTrainerError] = useState(false);

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

            if (user.config.isClient) return;

            const getTrainerInfo = () => {
                return api.get(`/trainers/me/base-info`);
            }
        
            const handleOnGetTrainerInfoSuccess = (data) => {
                setTrainerInfo(prevInfo => ({ ...prevInfo, ...data }));
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

        fetchData();
    }, [complaints, complaintsError, complaintsOffset, getTrainerInfoReq, getUserEmailReq, loadComplaints, loadRatings, location.state?.updatedEmail, navigate, ratings, ratingsError, ratingsOffset, t, user.config.isClient]);

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
            trainerInfo.newCrefUF
        )) return;
       
        const formData = new FormData();

        if (user.description !== trainerInfo.description) formData.append("description", trainerInfo.description);
        
        if (trainerInfo.newCrefNumber && trainerInfo.newCrefUF) formData.append("crefNumber", `${trainerInfo.newCrefNumber}/${trainerInfo.newCrefUF}`);

        const putTrainer = () => {
            return api.put("/trainers/me", formData);
        }
    
        const handleOnPutTrainerSuccess = (data) => {
            dispatch(updateUser(data));

            setTrainerInfo(prevInfo => ({
                ...prevInfo,
                crefNumber: data.crefNumber || prevInfo.crefNumber,
                newCrefNumber: "",
                newCrefUF: ""
            }))
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
    }, [dispatch, modifyTrainerError, modifyTrainerReq, t, trainerInfo.description, trainerInfo.newCrefNumber, trainerInfo.newCrefUF, user.description]);

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
            !trainerInfo.description !== !user.description ||
            trainerInfo.newCrefNumber || 
            trainerInfo.newCrefUF
        ) {
            return true;
        }

        return false
    }, [trainerInfo.description, trainerInfo.newCrefNumber, trainerInfo.newCrefUF, user.description]);
    
    useEffect(() => {
        document.title = t("personalProfile")
    }, [t]);

    return (
        <main
            className={styles.my_profile_page}
        >
            <BackButton/>

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