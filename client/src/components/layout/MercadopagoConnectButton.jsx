import { useTranslation } from "react-i18next";
import Stack from "../containers/Stack";
import styles from "./MercadopagoConnectButton.module.css";

function MercadopagoConnectButton({ handleConnect }) {
    const { t } = useTranslation();

    return (
        <button
            type="button"
            className={styles.mercadopago_button}
            onClick={handleConnect}
        >
            <Stack
                direction="row"
            >
                <img
                    src="/images/icons/mercadopago.png"
                    alt=""
                />

                <span>
                    {t("mercadopagoConnect")}
                </span>
            </Stack>
        </button>
    );
}

export default MercadopagoConnectButton;