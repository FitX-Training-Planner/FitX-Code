import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Stack from "../containers/Stack";
import { useNavigate } from "react-router-dom";
import styles from "./ErrorPage.module.css";
import NonBackgroundButton from "../form/buttons/NonBackgroundButton";
import Title from "../text/Title";

function PaymentSuccess() {
    const { t } = useTranslation();

    const navigate = useNavigate();

    useEffect(() => {
        document.title = t("paymentSuccess");
    }, [t]);

    return (
        <main>
            <Stack
                className={styles.error_page_container}
                justifyContent="center"
            >
                <img
                    src="/images/icons/success.png"
                    alt=""
                />

                <Stack
                    gap="4em"
                >
                    <Stack
                        className={styles.error_container}
                    >
                        <Title
                            text={t("paymentSuccess")}
                            headingNumber={1}
                        />

                        <p>
                            {t("paymentSuccessAlert")}
                        </p>
                    </Stack>

                    <NonBackgroundButton
                        text={t("backToHome")}
                        handleClick={() => navigate("/")}
                        varColor="--light-theme-color"
                    />
                </Stack>
            </Stack>
        </main>
    );
}

export default PaymentSuccess;