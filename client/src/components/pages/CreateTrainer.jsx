import { useCallback, useEffect, useRef, useState } from "react";
import Stack from "../containers/Stack";
import PhotoInput from "../form/fields/PhotoInput";
import TrainerForm from "../form/forms/TrainerForm";
import { validateTrainerPostRequestData } from "../../utils/validators/formValidator";
import { useLocation, useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/useSystemMessage";
import styles from "./CreateTrainer.module.css";
import useWindowSize from "../../hooks/useWindowSize";
import { useTranslation } from "react-i18next";

function CreateTrainer() {
    const { t } = useTranslation()

    const hasRun = useRef(false);

    const location = useLocation();

    const navigate = useNavigate();

    const { width } = useWindowSize();
    const { notify } = useSystemMessage();
    
    const [localUser, setLocalUser] = useState({
        name: "",
        email: "",
        password: "",
        config: {
            is_client: false,
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
    const [acceptTerms, setAcceptTerms] = useState(false);

    useEffect(() => {
        if (hasRun.current) return;
        
        hasRun.current = true;

        const locationUser = location.state?.localUser;

        if (!locationUser) {
            navigate("/login");
            
            notify(t("notFoundUserInfo"), "error");

            return;
        }

        setLocalUser(locationUser);
    }, [location.state, navigate, notify, t]);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        if (!acceptTerms) return;

        if (!validateTrainerPostRequestData(error, setError, trainer.cref_number, trainer.description, trainer.crefUF, 10)) return;

        navigate("/trainer-specialties", { state: { localTrainer: { ...localUser, ...trainer } } });
    }, [acceptTerms, error, setError, localUser, navigate, trainer]);

    useEffect(() => {
        document.title = t("trainerProfile");
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
                    <TrainerForm
                        trainer={trainer}
                        setTrainer={setTrainer}
                        setTrainerError={setError}
                        handleSubmit={handleOnSubmit}
                        acceptTerms={acceptTerms}
                        setAcceptedTerms={setAcceptTerms}
                    />
                </Stack>
            </Stack>
        </main>
    );
}

export default CreateTrainer;
