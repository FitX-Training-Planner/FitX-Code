import Stack from "../../containers/Stack";
import Title from "../../text/Title";
import SubmitFormButton from "../buttons/SubmitFormButton";
import CheckBoxInput from "../fields/CheckBoxInput";
// import styles from "./ConfigForm.module.css";

function ConfigForm({ config, setConfig }) {
    function handleOnChangeConfigData(e) {
        setConfig(prevConfig => ({
            ...prevConfig, 
            [e.target.name]: e.target.checked
        }));
    }
    
    return (
        <form>
            <Stack
                gap="5em"
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
        </form>
    );
}

export default ConfigForm;