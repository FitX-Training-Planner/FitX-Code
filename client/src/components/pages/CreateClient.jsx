import { useCallback, useEffect, useRef, useState } from "react";
import Stack from "../containers/Stack";
import PhotoInput from "../form/fields/PhotoInput";
import { useLocation, useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/useSystemMessage";
import { useDispatch } from "react-redux";
import styles from "./CreateTrainer.module.css";
import useWindowSize from "../../hooks/useWindowSize";
import { useTranslation } from "react-i18next";
import useGets from "../../hooks/useGetRequest";
import getAndSetInitialData from "../../utils/requests/initialData";
import api from "../../api/axios";
import { setUser } from "../../slices/user/userSlice";
import useRequest from "../../hooks/useRequest";
import ClientForm from "../form/forms/ClientForm";
import { validateClientPostRequestData } from "../../utils/validators/formValidator";
import authUser from "../../utils/requests/auth";

function CreateClient() {
    const { t } = useTranslation()

    const hasRun = useRef(false);

    const location = useLocation();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { width } = useWindowSize();
    const { notify } = useSystemMessage();

    const { getMuscles } = useGets();
    const { request: postClientRequest } = useRequest();
    const { request: authRequest } = useRequest();
    
    const [localUser, setLocalUser] = useState({
        name: "",
        email: "",
        password: "",
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
    const [client, setClient] = useState({
        birthDate: "",
        height: "",
        weight: "",
        limitationsDescription: "",
        availableDays: ""
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
    const [muscles, setMuscles] = useState([])
    const [error, setError] = useState(false);
    const [acceptTerms, setAcceptedTerms] = useState(false);

    useEffect(() => {
        if (hasRun.current) return;
        
        hasRun.current = true;

        const locationUser = location.state?.localUser;

        if (!locationUser) {
            navigate("/login");
            
            notify(t("notFoundUserInfo"), "error");

            return;
        }

        const fetchData = async () => {
            const musclesData = await getAndSetInitialData(
                getMuscles,
                setMuscles,
                undefined,
                navigate,
                "/login",
                "muscleGroups"
            );
            
            if (!musclesData) return;

            setLocalUser(locationUser);
        }

        fetchData();
    }, [getMuscles, location.state, navigate, notify, t]);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        if (!acceptTerms) return;

        if (!validateClientPostRequestData(
            error, 
            setError, 
            client.height,
            client.weight,
            client.birthDate,
            client.availableDays,
            client.limitationsDescription
        )) return;

        const postClientFormData = new FormData();

        postClientFormData.append("name", localUser.name);
        postClientFormData.append("email", localUser.email);
        postClientFormData.append("password", localUser.password);
        postClientFormData.append("isDarkTheme", localUser.config.is_dark_theme);
        postClientFormData.append("isComplainterAnonymous", localUser.config.is_complainter_anonymous);
        postClientFormData.append("isRaterAnonymous", localUser.config.is_rater_anonymous);
        postClientFormData.append("emailNotificationPermission", localUser.config.email_notification_permission);
        postClientFormData.append("isEnglish", localUser.config.is_english);
        postClientFormData.append("photoFile", localUser.config.photoFile);
        postClientFormData.append("sex", sexes.find(sex => sex.isSelected)?.ID);
        postClientFormData.append("birthDate", client.birthDate);
        postClientFormData.append("height", client.height);
        postClientFormData.append("weight", client.weight);
        postClientFormData.append("limitationsDescription", client.limitationsDescription);
        postClientFormData.append("availableDays", client.availableDays);
        muscles.forEach((muscle) => {
            if (muscle.isSelected) {
                postClientFormData.append("weekMuscles[]", muscle.ID);
            }
        });

        const postClient = () => {
            return api.post("/users", postClientFormData);
        };

        const handleOnPostClientSuccess = (data) => {
            authUser(data.userID, dispatch, navigate, authRequest, setUser, true, t);
        }

        const handleOnPostClientError = () => {    
            navigate("/login");

            return;
        }

        postClientRequest(
            postClient, 
            handleOnPostClientSuccess, 
            handleOnPostClientError, 
            t("loadingCreateUser"), 
            undefined, 
            t("errorCreateUser")
        );    
    }, [authRequest, acceptTerms, dispatch, error, localUser.config.email_notification_permission, localUser.config.is_complainter_anonymous, localUser.config.is_dark_theme, localUser.config.is_english, localUser.config.is_rater_anonymous, localUser.config.photoFile, localUser.email, localUser.name, localUser.password, sexes, client.birthDate, client.height, client.weight, client.limitationsDescription, client.availableDays, navigate, postClientRequest, muscles, t]);

    useEffect(() => {
        document.title = t("clientProfile");
    }, [t]);

    return (
        <main>
            <Stack
                direction={width > 640 ? "row" : "column"}
                className={width > 640 ? styles.create_trainer_page : undefined}
                gap="0"
            >
                <Stack
                    className={styles.photo_container}
                >
                    <PhotoInput
                        name="userPhoto"
                        size="large"
                        blobUrl={localUser.config.photoBlobUrl}
                        disabled
                    />
                </Stack>

                <Stack
                    gap="3em"
                    className={styles.trainer_form_container}
                >
                    <ClientForm
                        client={client}
                        setClient={setClient}
                        setClientError={setError}
                        handleSubmit={handleOnSubmit}
                        muscleGroups={muscles}
                        setMuscleGroups={setMuscles}
                        sexes={sexes}
                        setSexes={setSexes}
                        acceptTerms={acceptTerms}
                        setAcceptedTerms={setAcceptedTerms}
                    />
                </Stack>
            </Stack>
        </main>
    );
}

export default CreateClient;
