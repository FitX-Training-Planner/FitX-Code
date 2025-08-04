import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Stack from "../containers/Stack";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ErrorPage.module.css";

function ErrorPage() {
    const { t } = useTranslation();

    const location = useLocation();

    const navigate = useNavigate();

    const [error, setError] = useState({
        status: "",
        message: ""
    });

    useEffect(() => {
        const status = location.state?.errorStatus;
        const message = location.state?.errorMessage;

        if (!(status && message)) navigate("/");

        setError({ status, message });
    }, [location.state?.errorMessage, location.state?.errorStatus, navigate]);

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
                    className={styles.error_container}
                >
                    <span>
                        {error.status}
                    </span>

                    <p>
                        {error.message}
                    </p>
                </Stack>
            </Stack>
        </main>
    );
}

export default ErrorPage;