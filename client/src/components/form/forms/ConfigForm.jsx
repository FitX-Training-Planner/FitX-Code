import Stack from "../../containers/Stack";
import Title from "../../text/Title";
import SubmitFormButton from "../buttons/SubmitFormButton";
import CheckBoxInput from "../fields/CheckBoxInput";
import PhotoInput from "../fields/PhotoInput";
import Alert from "../../messages/Alert";
import styles from "./ConfigForm.module.css";
import { useCallback } from "react";
import NonBackgroundButton from "../buttons/NonBackgroundButton";
import useWindowSize from "../../../hooks/useWindowSize";
import { handleOnChangePhoto } from "../../../utils/handlers/changeHandlers";
import { useTranslation } from "react-i18next";

function ConfigForm({
    config,
    setConfig,
    handleSubmit,
    handleChangeToTrainer 
}) {
    const { t } = useTranslation();

    const { width } = useWindowSize();

    const handleOnChangeConfigData = useCallback((e) => {
        setConfig(prevConfig => ({
            ...prevConfig, 
            [e.target.name]: e.target.checked
        }));
    }, [setConfig]);
    
    return (
        <form
            onSubmit={handleSubmit}
            className={width > 640 ? styles.config_form_container : undefined}
        >
            <Stack
                direction={width > 640 ? "row" : "column"}
                gap="0"
                className={width > 640 ? styles.config_form_container : undefined}
            >
                <Stack
                    gap="3em"
                    className={styles.title_and_photo_container}
                    extraStyles={width < 640 ? { width: "100%" } : { width: "50%" }}
                >
                    <Stack
                        gap="2em"
                        className={styles.title_container}
                    >
                        <Title
                            headingNumber={1}
                            text={t("userConfig")}
                            varColor="--dark-color"
                        />

                        <p>
                            {t("configDescription")}
                        </p>
                    </Stack>
                    
                    <PhotoInput
                        name="photoFile"
                        labelText={t("profilePhoto")}
                        size="large"
                        blobUrl={config.photoBlobUrl}
                        handleChange={(e) => handleOnChangePhoto(e, config, setConfig)}
                    />

                    <Stack
                        direction="row"
                        gap="0.5em"
                        className={styles.config_alert}
                        justifyContent="center"
                    >
                        <Alert
                            varColor="--white-color"
                        />
                        
                        {t("configAlert")}
                    </Stack>
                </Stack>

                <Stack
                    className={styles.config_form}
                    gap="4em"
                    extraStyles={width < 640 ? { width: "100%", overflowY: "unset" } : { width: "50%", overflowY: "auto" }}
                >
                    <Stack
                        gap="3em"
                    >
                        <Title
                            headingNumber={2}
                            text={t("securityAndPrivacy")}
                        />

                        <Stack
                            gap="2em"
                        >
                            <CheckBoxInput
                                name="is_complainter_anonymous"
                                labelText={t("anonymousComplaint")}
                                isChecked={config.is_complainter_anonymous}
                                handleChange={handleOnChangeConfigData}
                                description={t("anonymousComplaintDescription")}
                            />

                            <CheckBoxInput
                                name="is_rater_anonymous"
                                labelText={t("anonymousRating")}
                                isChecked={config.is_rater_anonymous}
                                handleChange={handleOnChangeConfigData}
                                description={t("anonymousRatingDescription")}
                            />
                        </Stack>
                    </Stack>

                    <Stack
                        gap="3em"
                    >
                        <Title
                            headingNumber={2}
                            text={t("notifications")}
                        />

                        <Stack
                            gap="2em"
                        >
                            <CheckBoxInput
                                name="email_notification_permission"
                                labelText={t("emailNotifications")}
                                isChecked={config.email_notification_permission}
                                handleChange={handleOnChangeConfigData}
                                description={t("emailNotificationsDescription")}
                            />
                        </Stack>
                    </Stack>

                    <Stack
                        gap="3em"
                    >
                        <Title
                            headingNumber={2}
                            text={t("accessibility")}
                        />

                        <Stack
                            gap="2em"
                        >
                            <CheckBoxInput
                                name="is_dark_theme"
                                labelText={t("darkTheme")}
                                isChecked={config.is_dark_theme}
                                handleChange={handleOnChangeConfigData}
                                description={t("darkThemeDescription")}
                            />

                            <CheckBoxInput
                                name="is_english"
                                labelText={t("english")}
                                isChecked={config.is_english}
                                handleChange={handleOnChangeConfigData}
                                description={t("englishDescription")}
                            />
                        </Stack>
                    </Stack>

                    <Stack
                        gap="2em"
                    >
                        <SubmitFormButton
                            text={t("confirm")}
                        />

                        <NonBackgroundButton
                            text={t("signUpAsTrainer")}
                            varColor="--theme-color"
                            handleClick={handleChangeToTrainer}
                        />
                    </Stack>
                </Stack>
            </Stack>
        </form>
    );
}

export default ConfigForm;