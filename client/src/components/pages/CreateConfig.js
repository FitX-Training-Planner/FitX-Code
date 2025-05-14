import { useState } from "react";
import ConfigForm from "../form/forms/ConfigForm";

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
            <ConfigForm
                config={config}
                setConfig={setConfig}
                handleSubmit={handleOnSubmit}
            />
{/* 
                <div
                    className={styles.config_bg}
                >
                    <img 
                        src="images/backgrounds/create_config_bg.png"
                        alt="Background"
                    />
                </div> */}
        </main>
    );
}

export default CreateConfig;