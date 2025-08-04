import Stack from "../../containers/Stack";
import Title from "../../text/Title";
import SubmitFormButton from "../buttons/SubmitFormButton";
import { useTranslation } from "react-i18next";
import CheckBoxInput from "../fields/CheckBoxInput";
import { useCallback } from "react";

function ModifyConfigForm({
    changedConfig,
    setChangedConfig,
    handleSubmit, 
    hasChanged
}) {
    const { t } = useTranslation();

    const handleOnChangeConfigData = useCallback((e) => {
        setChangedConfig(prevConfig => ({
            ...prevConfig, 
            [e.target.name]: e.target.checked
        }));
    }, [setChangedConfig]);
    
    return (
        <form 
            onSubmit={handleSubmit}
        >
            <Stack
                gap="3em"
            >
                <Stack
                    gap="4em"
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
                                name="isComplainterAnonymous"
                                labelText={t("anonymousComplaint")}
                                isChecked={changedConfig.isComplainterAnonymous}
                                handleChange={handleOnChangeConfigData}
                                description={t("anonymousComplaintDescription")}
                            />

                            <CheckBoxInput
                                name="isRaterAnonymous"
                                labelText={t("anonymousRating")}
                                isChecked={changedConfig.isRaterAnonymous}
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
                                name="emailNotificationPermission"
                                labelText={t("emailNotifications")}
                                isChecked={changedConfig.emailNotificationPermission}
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
                                name="isDarkTheme"
                                labelText={t("darkTheme")}
                                isChecked={changedConfig.isDarkTheme}
                                handleChange={handleOnChangeConfigData}
                                description={t("darkThemeDescription")}
                            />

                            <CheckBoxInput
                                name="isEnglish"
                                labelText={t("english")}
                                isChecked={changedConfig.isEnglish}
                                handleChange={handleOnChangeConfigData}
                                description={t("englishDescription")}
                            />
                        </Stack>
                    </Stack>
                </Stack>

                {hasChanged && (
                    <SubmitFormButton
                        text={t("modify")}
                    />
                )}
            </Stack>
        </form>
    );
}

export default ModifyConfigForm;