import React, { useCallback, useEffect, useRef, useState } from "react";
import useRequest from "../../hooks/useRequest";
import { useLocation, useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/useSystemMessage";
import { setUser } from "../../slices/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import authUser from "../../utils/requests/auth";
import api from "../../api/axios";
import { useTranslation } from "react-i18next";
import { validateTrainerPostRequestData } from "../../utils/validators/formValidator";
import getAndSetInitialData from "../../utils/requests/initialData";
import useGets from "../../hooks/useGetRequest";
import Title from "../text/Title";
import FlexWrap from "../containers/FlexWrap";
import SpecialtyCard from "../cards/training/SpecialtyCard";
import Stack from "../containers/Stack";
import useWindowSize from "../../hooks/useWindowSize";
import styles from "./TrainerSpecialties.module.css";
import SubmitFormButton from "../form/buttons/SubmitFormButton";
import { cleanCacheData } from "../../utils/cache/operations";

function TrainerSpecialties() {
    const { t } = useTranslation();

    const user = useSelector(state => state.user);

    const location = useLocation();

    const navigate = useNavigate();

    const { width } = useWindowSize();

    const hasRun = useRef(false);

    const dispatch = useDispatch();

    const { notify } = useSystemMessage();

    const { request: postTrainerRequest } = useRequest();
    const { request: putSpecialtiesRequest } = useRequest();
    const { request: authRequest } = useRequest();
    const { getSpecialties } = useGets();

    const [localTrainer, setLocalTrainer] = useState({
        name: "",
        email: "",
        password: "",
        description: "",
        cref_number: "",
        crefUF: "",
        config: {
            is_client: true,
            is_dark_theme: false,
            is_complainter_anonymous: true,
            is_rater_anonymous: false,
            email_notification_permission: true,
            is_english: false,
            photoFile: null,
            photoBlobUrl: null
        }
    });
    const [specialties, setSpecialties] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (hasRun.current) return;
        
        hasRun.current = true;

        const locationTrainer = location.state?.localTrainer;
        const locationSpecialties = location.state?.selectedSpecialties;
        const isModifying = location.state?.modify;

        if (!locationTrainer && !isModifying) {
            navigate("/login");
            
            notify(t("notFoundUserInfo"), "error");

            return;
        }

        const fetchData = async () => {
            const specialtiesData = await getAndSetInitialData(
                getSpecialties,
                setSpecialties,
                undefined,
                navigate,
                "/login",
                "specialties"
            );
            
            if (!specialtiesData) return;
    
            if (isModifying) {
                setSpecialties((prevSpecialties) =>
                    prevSpecialties.map((specialty) =>
                        locationSpecialties?.find(locSpecialty => locSpecialty.ID === specialty.ID) || specialty
                    )
                );

                setLocalTrainer(null);  
            }

            setLocalTrainer(locationTrainer);
        }

        fetchData();
    }, [location.state, navigate, notify, t]);

    const handleOnSelectSpecialty = useCallback((ID) => {
        setSpecialties((prevSpecialties) =>
            prevSpecialties.map((specialty) =>
                specialty.ID === ID
                ? (
                    specialty.isSelected 
                    ? (
                        specialty.isMain 
                        ? { ...specialty, isMain: false, isSelected: false }
                        : { ...specialty, isMain: true }
                    ) : { ...specialty, isSelected: true }
                ) : specialty
            )
        );
    }, []);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        if (specialties.filter((specialty) => specialty.isMain).length >= 4) {
            notify(t("mainSpecialtiesAlert"), "error");

            return;
        }

        if (localTrainer) {
            if (!validateTrainerPostRequestData(error, setError, localTrainer?.cref_number, localTrainer?.description, localTrainer?.crefUF, 10)) {
                notify(t("invalidTrainerData"), "error");
    
                navigate("/login");
    
                return;
            }
    
            const postTrainerFormData = new FormData();
    
            postTrainerFormData.append("name", localTrainer?.name);
            postTrainerFormData.append("email", localTrainer?.email);
            postTrainerFormData.append("password", localTrainer?.password);
            postTrainerFormData.append("isDarkTheme", localTrainer?.config?.is_dark_theme);
            postTrainerFormData.append("isComplainterAnonymous", localTrainer?.config?.is_complainter_anonymous);
            postTrainerFormData.append("isRaterAnonymous", localTrainer?.config?.is_rater_anonymous);
            postTrainerFormData.append("emailNotificationPermission", localTrainer?.config?.email_notification_permission);
            postTrainerFormData.append("isEnglish", localTrainer?.config?.is_english);
            postTrainerFormData.append("photoFile", localTrainer?.config?.photoFile);
            postTrainerFormData.append("crefNumber", localTrainer?.cref_number && localTrainer?.crefUF ? `${localTrainer?.cref_number}/${localTrainer?.crefUF}` : "");
            postTrainerFormData.append("description", localTrainer?.description);
            specialties.forEach((specialty) => {
                if (specialty.isSelected) {
                    if (specialty.isMain) {
                        postTrainerFormData.append("mainSpecialties[]", specialty.ID);
                    } else {
                        postTrainerFormData.append("secondarySpecialties[]", specialty.ID);
                    }
                }
            });
    
            const postTrainer = () => {
                return api.post("/trainers", postTrainerFormData);
            };
    
            const handleOnPostTrainerSuccess = (data) => {
                authUser(data.userID, dispatch, navigate, authRequest, setUser, false, t);
            }
    
            const handleOnPostTrainerError = () => {    
                navigate("/login");
    
                return;
            }
    
            postTrainerRequest(
                postTrainer, 
                handleOnPostTrainerSuccess, 
                handleOnPostTrainerError, 
                t("loadingCreateTrainer"), 
                undefined, 
                t("errorCreateTrainer")
            );    
        } else {    
            const putSpecialtiesFormdata = new FormData();
    
            specialties.forEach((specialty) => {
                if (specialty.isSelected) {
                    if (specialty.isMain) {
                        putSpecialtiesFormdata.append("mainSpecialties[]", specialty.ID);
                    } else {
                        putSpecialtiesFormdata.append("secondarySpecialties[]", specialty.ID);
                    }
                }
            });
    
            const putSpecialties = () => {
                return api.put("/trainers/me/specialties", putSpecialtiesFormdata);
            };
    
            const handleOnPutSpecialtiesSuccess = () => {
                cleanCacheData("trainerSpecialties")
                
                navigate("/me");
            }
    
            const handleOnPutSpecialtiesError = () => {
                navigate("/me");
    
                return;
            }

            putSpecialtiesRequest(
                putSpecialties, 
                handleOnPutSpecialtiesSuccess, 
                handleOnPutSpecialtiesError, 
                t("loadingModifySpecialties"), 
                t("successModifySpecialties"), 
                t("errorModifySpecialties")
            );
        }
    }, [authRequest, dispatch, error, localTrainer?.config?.email_notification_permission, localTrainer?.config?.is_complainter_anonymous, localTrainer?.config?.is_dark_theme, localTrainer?.config?.is_english, localTrainer?.config?.is_rater_anonymous, localTrainer?.config?.photoFile, localTrainer?.email, localTrainer?.name, localTrainer?.password, localTrainer?.crefUF, localTrainer?.cref_number, localTrainer?.description, navigate, notify, postTrainerRequest, putSpecialtiesRequest, specialties, t]);

    useEffect(() => {
        document.title = t("trainerSpecialties");
    }, [t]);

    return (
        <main
            className={styles.specialties_page}
        >
            <Stack
                gap="4em"
            >
                <Stack
                    gap="3em"
                >
                    <Title
                        headingNumber={1}
                        text={t("trainerSpecialties")}
                    />

                    <Stack
                        gap="2em"
                    >
                        <p>
                            {t("trainerSpecialtiesDescription")}
                        </p>

                        <p>
                            {t("trainerSpecialtiesInstruction")}
                        </p>

                        <p>
                            {t("mainSpecialtiesDescription")}
                        </p>
                    </Stack>
                </Stack>

                <hr/>

                <FlexWrap
                    direction="row"
                    maxElements={width <= 840 ? (width <= 440 ? 1 : 2) : 3}
                    justifyContent="center"
                    gap="2em"
                >
                    {specialties.map((specialty, index) => (
                        <React.Fragment 
                            key={index}
                        >
                            <SpecialtyCard
                                name={
                                    user.config.isEnglish 
                                    ? t(`databaseData.specialties.${specialty.ID}.name`) 
                                    : specialty.name
                                }
                                icon={specialty.media?.url}
                                isSelected={specialty.isSelected}
                                isMain={specialty.isMain}
                                handleSelect={() => handleOnSelectSpecialty(specialty.ID)}
                            />
                        </React.Fragment>
                    ))}
                </FlexWrap>

                <form
                    onSubmit={handleOnSubmit}
                >
                    <SubmitFormButton
                        text={localTrainer ? t("signUp") : t("confirm")}
                    />
                </form>
            </Stack>
        </main>
    );
}

export default TrainerSpecialties;