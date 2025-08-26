import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Stack from "../containers/Stack";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ErrorPage.module.css";
import NonBackgroundButton from "../form/buttons/NonBackgroundButton";

function ErrorPage({ pageNotFound = false }) {
    const { t } = useTranslation();

    const location = useLocation();

    const navigate = useNavigate();

    const [error, setError] = useState({
        status: "",
        message: ""
    });

    useEffect(() => {
        const status = String(location.state?.errorStatus);
        const message = location.state?.errorMessage;

        if (pageNotFound) {
            setError({ status: "404", message: t("pageNotFound") })
        } else {
            if (!(status && message)) {
                navigate("/");
            } else {
                setError({ status, message });
            }
        }
    }, [location.state?.errorMessage, location.state?.errorStatus, navigate, pageNotFound, t]);

    useEffect(() => {
        document.title = t("error");
    }, [t]);

    return (
        <main>
            <Stack
                className={styles.error_page_container}
                justifyContent="center"
            >
                <img
                    src="/images/icons/broked_dumbell.png"
                    alt=""
                />

                <Stack
                    gap="4em"
                >
                    <Stack
                        className={styles.error_container}
                    >
                        <span>
                            {error.status}
                        </span>

                        <p>
                            {error.message}
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

export default ErrorPage;