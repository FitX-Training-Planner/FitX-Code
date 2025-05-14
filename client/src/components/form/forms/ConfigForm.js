import Stack from "../../containers/Stack";
import Title from "../../text/Title";
import SubmitFormButton from "../buttons/SubmitFormButton";
import CheckBoxInput from "../fields/CheckBoxInput";
import PhotoInput from "../fields/PhotoInput";
import { isPhotoValid } from "../../../utils/validators/UserValidator";
import Alert from "../../messages/Alert";
import styles from "./ConfigForm.module.css";

function ConfigForm({ config, setConfig, handleSubmit }) {
    function handleOnChangeUserPhoto(e) {
        const file = e.target.files[0];

        if (!file) return;
        
        if (!isPhotoValid(file)) return;
        
        const newBlobUrl = URL.createObjectURL(file);
        
        setConfig(prevConfig => ({
            ...prevConfig, 
            [e.target.name]: file,
            photoBlobUrl: newBlobUrl
        }));
    };

    function handleOnChangeConfigData(e) {
        setConfig(prevConfig => ({
            ...prevConfig, 
            [e.target.name]: e.target.checked
        }));
    }
    
    return (
        <form
            onSubmit={handleSubmit}
            className={styles.config_form_container}
        >
            <Stack
                direction="row"
                gap="0"
                className={styles.config_form_container}
            >
                <Stack
                    gap="3em"
                    className={styles.title_and_photo_container}
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
                            Configure seu perfil para uma experiência mais personalizada!
                        </p>
                    </Stack>
                    
                    <PhotoInput
                        name="photoFile"
                        labelText="Foto de Perfil"
                        size="large"
                        blobUrl={config.photoBlobUrl}
                        handleChange={handleOnChangeUserPhoto}
                    />

                    <p
                        className={styles.config_alert}
                    >
                        <Stack
                            direction="row"
                            gap="0.5em"
                        >
                            <Alert
                                varColor="--light-color"
                                varSize="--small-text-size"
                            />
                            
                            Você sempre pode alterar suas configurações após criar sua conta.
                        </Stack>
                    </p>
                </Stack>

                <Stack
                    className={styles.config_form}
                    gap="4em"
                >
                    <Stack
                        gap="3em"
                    >
                        <Title
                            headingNumber={2}
                            text="Segurança e Privacidade"
                        />

                        <Stack
                            gap="2em"
                        >
                            <CheckBoxInput
                                name="is_complainter_anonymous"
                                labelText="Denúncia Anônima"
                                isChecked={config.is_complainter_anonymous}
                                handleChange={handleOnChangeConfigData}
                                description="Habilite para que seu perfil não seja exibido nas denúncias que você fizer."
                            />

                            <CheckBoxInput
                                name="is_rater_anonymous"
                                labelText="Avaliação Anônima"
                                isChecked={config.is_rater_anonymous}
                                handleChange={handleOnChangeConfigData}
                                description="Habilite para que seu perfil não seja exibido nas avaliações que você fizer."
                            />

                            <CheckBoxInput
                                name="is_contact_visible"
                                labelText="Contato Visível"
                                isChecked={config.is_contact_visible}
                                handleChange={handleOnChangeConfigData}
                                description="Habilite para que seu número de contato seja exibido no seu perfil."
                            />
                        </Stack>
                    </Stack>

                    <Stack
                        gap="3em"
                    >
                        <Title
                            headingNumber={2}
                            text="Notificações"
                        />

                        <Stack
                            gap="2em"
                        >
                            <CheckBoxInput
                                name="email_notification_permission"
                                labelText="Notificações pelo E-mail"
                                isChecked={config.email_notification_permission}
                                handleChange={handleOnChangeConfigData}
                                description="Habilite para que você receba nossas notificações por e-mail."
                            />

                            <CheckBoxInput
                                name="device_notification_permission"
                                labelText="Notificações pelo Dispositivo"
                                isChecked={config.device_notification_permission}
                                handleChange={handleOnChangeConfigData}
                                description="Habilite para que você receba nossas notificações no seu dispositivo."
                            />
                        </Stack>
                    </Stack>

                    <Stack
                        gap="3em"
                    >
                        <Title
                            headingNumber={2}
                            text="Acessibilidade"
                        />

                        <Stack
                            gap="2em"
                        >
                            <CheckBoxInput
                                name="is_dark_theme"
                                labelText="Tema Escuro"
                                isChecked={config.is_dark_theme}
                                handleChange={handleOnChangeConfigData}
                                description="Habilite para ter uma interface com cores mais escuras."
                            />

                            <CheckBoxInput
                                name="is_english"
                                labelText="Inglês"
                                isChecked={config.is_english}
                                handleChange={handleOnChangeConfigData}
                                description="Habilite para que todo o texto do aplicativo esteja em inglês."
                            />
                        </Stack>
                    </Stack>

                    <SubmitFormButton
                        text="Confirmar"
                    />
                </Stack>
            </Stack>
        </form>
    );
}

export default ConfigForm;