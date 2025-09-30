import Stack from "../containers/Stack";
import styles from "./MercadopagoConnectButton.module.css";

function MercadopagoConnectButton({ 
    handleConnect,
    text
}) {
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
                    {text}
                </span>
            </Stack>
        </button>
    );
}

export default MercadopagoConnectButton;