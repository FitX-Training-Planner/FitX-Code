import { useCallback, useEffect, useRef, useState } from "react";
import Stack from "../containers/Stack";
import PhotoInput from "../form/fields/PhotoInput";
import TrainerForm from "../form/forms/TrainerForm";
import { validateTrainerPostRequestData } from "../../utils/validators/formValidator";
import { useLocation, useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/SystemMessageProvider";
import api from "../../api/axios";
import authUser from "../../utils/requests/auth";
import { useDispatch } from "react-redux";
import useRequest from "../../hooks/useRequest";
import { setUser } from "../../slices/user/userSlice";
import styles from "./CreateTrainer.module.css";
import useWindowSize from "../../hooks/useWindowSize";
import { Helmet } from "react-helmet";

function CreateTrainer() {
    const hasRun = useRef(false);

    const location = useLocation();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { width } = useWindowSize();
    const { notify } = useSystemMessage();
    const { request: postTrainerRequest } = useRequest();
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

    const [trainer, setTrainer] = useState({
        description: "",
        cref_number: "",
        crefUF: "",
    });

    const [error, setError] = useState(false);

    useEffect(() => {
        if (hasRun.current) return;
        
        hasRun.current = true;

        const locationUser = location.state?.localUser;

        if (!locationUser) {
            navigate("/login");
            
            notify("As suas informações de usuário não foram encontradas. Tente se registrar novamente.", "error");

            return;
        }

        setLocalUser(locationUser);
    }, [location.state, navigate, notify]);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        if (!validateTrainerPostRequestData(error, setError, trainer.cref_number, trainer.description, trainer.crefUF)) return;

        const postTrainerFormData = new FormData();

        postTrainerFormData.append("name", localUser.name);
        postTrainerFormData.append("email", localUser.email);
        postTrainerFormData.append("password", localUser.password);
        postTrainerFormData.append("isDarkTheme", localUser.config.is_dark_theme);
        postTrainerFormData.append("isComplainterAnonymous", localUser.config.is_complainter_anonymous);
        postTrainerFormData.append("isRaterAnonymous", localUser.config.is_rater_anonymous);
        postTrainerFormData.append("emailNotificationPermission", localUser.config.email_notification_permission);
        postTrainerFormData.append("isEnglish", localUser.config.is_english);
        postTrainerFormData.append("photoFile", localUser.config.photoFile);
        postTrainerFormData.append("crefNumber", `${trainer.cref_number}/${trainer.crefUF}`);
        postTrainerFormData.append("description", trainer.description);

        const postTrainer = () => {
            return api.post("/trainers", postTrainerFormData);
        };

        const handleOnPostTrainerSuccess = (data) => {
            authUser(data.userID, dispatch, navigate, notify, authRequest, setUser, false);
        }

        const handleOnPostTrainerError = () => {
            setError(true);
        }

        postTrainerRequest(postTrainer, handleOnPostTrainerSuccess, handleOnPostTrainerError, "Criando usuário", "Usuário criado!", "Falha ao criar usuário!");
    }, [authRequest, dispatch, error, localUser, navigate, notify, postTrainerRequest, trainer]);

    return (
        <main>
            <Helmet>
                <title>Criar Treinador</title>
            </Helmet>
            
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
                    <TrainerForm
                        trainer={trainer}
                        setTrainer={setTrainer}
                        setTrainerError={setError}
                        handleSubmit={handleOnSubmit}
                    />
                </Stack>
            </Stack>
        </main>
    );
}

export default CreateTrainer;