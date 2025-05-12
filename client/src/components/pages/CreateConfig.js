import { useState } from "react";
import ConfigForm from "../form/forms/ConfigForm";
import Title from "../text/Title";
import styles from "./CreateConfig.module.css";
import Stack from "../containers/Stack";
import AlertSign from "../messages/AlertSign";

function CreateConfig() {
    const [config, setConfig] = useState({
        is_dark_theme: false,
        is_complainter_anonymous: false,
        is_rater_anonymous: false,
        is_contact_visible: false,
        email_notification_permission: false,
        device_notification_permission: false,
        is_english: false,
        photoFile: false,
        photoBlobUrl: null
    });

    function handleOnSubmit(e) {
        e.preventDefault();

    }

    return (
        <main>
            <Stack
                direction="row"
                gap="0"
                className={styles.config_page_container}
            >
                <Stack
                    gap="4em"
                    className={styles.config_form_container}
                >
                    <Stack
                        gap="2em"
                        className={styles.title_container}
                    >
                        <Title
                            headingNumber={1}
                            text="Configuração de Perfil"
                        />

                        <p>
                            Configure seu perfil para uma experiência mais personalizada
                        </p>

                        <p
                            className={styles.config_alert}
                        >
                            <Stack
                                direction="row"
                                gap="0.5em"
                            >
                                <AlertSign
                                    varColor="--light-color"
                                    varSize="--small-text-size"
                                />
                                
                                Você sempre pode alterar suas configurações após criar sua conta 
                            </Stack>
                        </p>
                    </Stack>

                    <ConfigForm
                        config={config}
                        setConfig={setConfig}
                        handleSubmit={handleOnSubmit}
                    />
                </Stack>

                <div
                    className={styles.config_bg}
                >
                    <img 
                        src="images/backgrounds/create_config_bg.png"
                        alt="Background"
                    />
                </div>
            </Stack>
        </main>
    );
}

export default CreateConfig;