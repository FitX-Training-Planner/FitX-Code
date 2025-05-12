import { useState } from "react";
import ConfigForm from "../form/forms/ConfigForm";
import Title from "../text/Title";
import styles from "./CreateConfig.module.css";
import Stack from "../containers/Stack";

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

    return (
        <main>
            <Stack
                gap="4em"
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
                        Você sempre pode alterar suas configurações após criar sua conta 
                    </p>
                </Stack>

                <ConfigForm
                    config={config}
                    setConfig={setConfig}
                />
            </Stack>
        </main>
    );
}

export default CreateConfig;