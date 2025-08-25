import useWindowSize from "../../hooks/useWindowSize";
import Stack from "../containers/Stack";
import ClickableIcon from "../form/buttons/ClickableIcon";
import NonBackgroundButton from "../form/buttons/NonBackgroundButton";
import styles from "./Footer.module.css";
import { useTranslation } from "react-i18next";

function Footer({
    navigate
}) {
    const { t } = useTranslation();

    const { width } = useWindowSize();

    const appEmail = "fitx.app.2025@gmail.com";

    const SendMessage = () => {
        return (
            <Stack
                alignItems={width <= 840 ? "end" : "start"}
                className={styles.contact}
                gap="0.5em"
            >
                <span>
                    {t("contactUs")}:
                </span>

                <button
                    type="button"
                    onClick={() => window.location.href = `mailto:${appEmail}`}
                >
                    {appEmail}
                </button>
            </Stack>
        );
    }

    return (
        <footer 
            className={styles.footer}
            style={{ padding: width <= 440 ? "2em 1em" : "2em" }}
        >
            <Stack
                gap="5em"
            >
                <Stack
                    direction={width <= 840 ? "column" : "row"}   
                    gap="5em"    
                >
                    <Stack
                        className={styles.left_container}
                        extraStyles={{ width: width <= 840 ? "100%" : "max-content" }}
                        direction={width <= 840 ? "row" : "column"}
                        gap="4em"
                    >
                        <Stack
                            alignItems="start"
                            direction={width <= 640 && width > 440 ? "row" : "column"}
                        >
                            <img
                                alt=""
                                src="/images/logo/logo_v1_no_bg.png"
                                className={styles.logo_footer}
                            />

                            <Stack
                                direction="row"
                                justifyContent={width <= 640 && width > 440 ? "end" : "start"}
                            >
                                <ClickableIcon
                                    iconSrc="/images/icons/instagram.png"
                                    name="Instagram"
                                    // handleClick={() => window.open("https://www.instagram.com/seu_perfil/", "_blank", "noopener,noreferrer")}
                                    hasTheme={false}
                                />

                                <ClickableIcon
                                    iconSrc="/images/icons/youtube.png"
                                    name="Youtube"
                                    // handleClick={() => window.open("https://www.youtube.com/c/seu_canal", "_blank", "noopener,noreferrer")}
                                    hasTheme={false}
                                />

                                <ClickableIcon
                                    iconSrc="/images/icons/tiktok.png"
                                    name="TikTok"
                                    // handleClick={() => window.open("https://www.tiktok.com/@seu_perfil", "_blank", "noopener,noreferrer")}
                                    hasTheme={false}
                                />

                                <ClickableIcon
                                    iconSrc="/images/icons/github.png"
                                    name="GitHub"
                                    // handleClick={() =>  window.open("https://github.com/FitX-Training-Planner", "_blank", "noopener,noreferrer")}
                                    hasTheme={false}
                                />
                            </Stack>
                        </Stack>

                        {width > 640 && (
                            <SendMessage />
                        )}
                    </Stack>

                    <Stack
                        direction={width <= 440 ? "column" : "row"} 
                        gap="3em"
                    >
                        <Stack
                            className={`${styles.footer_section} ${width <= 440 ? styles.small : undefined}`}
                            alignItems={width <= 440 ? "start" : "center"}
                            gap="2em"
                        >
                            <span>
                                {t("stayUpdated")}
                            </span>

                            <Stack
                                alignItems={width <= 440 ? "start" : "center"}
                                extraStyles={{ marginLeft: width <= 440 ? "1em" : "0" }}
                            >
                                <NonBackgroundButton
                                    text={t("news")}
                                    handleClick={() => navigate("/app/news")}
                                    varColor="--white-color"
                                />

                                <NonBackgroundButton
                                    text={t("feedback")}
                                    handleClick={() => {
                                        const subject = encodeURIComponent("FitX Feedback");
                                        const body = encodeURIComponent(`${t("myFeedbackIs")}: `);
                                        window.location.href = `mailto:${appEmail}?subject=${subject}&body=${body}`;
                                    }}
                                    varColor="--white-color"
                                />

                                <NonBackgroundButton
                                    text={t("futureUpdates")}
                                    handleClick={() => navigate("/app/future-updates")}
                                    varColor="--white-color"
                                />
                            </Stack>
                        </Stack>

                        <Stack
                            className={`${styles.footer_section} ${width <= 440 ? styles.small : undefined}`}
                            alignItems={width <= 440 ? "start" : "center"}
                            gap="2em"
                        >
                            <span>
                                {t("termsAndPolicies")}
                            </span>

                            <Stack
                                alignItems={width <= 440 ? "start" : "center"}
                                extraStyles={{ marginLeft: width <= 440 ? "1em" : "0" }}
                            >
                                <NonBackgroundButton
                                    handleClick={() => navigate("/app/terms-and-conditions")}
                                    text={t("UseTermsAndConditions")}
                                    varColor="--white-color"
                                />

                                <NonBackgroundButton
                                    handleClick={() => navigate("/app/policies/privacy")}
                                    text={t("privacyPolicy")}
                                    varColor="--white-color"
                                />

                                <NonBackgroundButton
                                    handleClick={() => navigate("/app/policies/refund-and-cancellation")}
                                    text={t("refundAndCancellationPolicy")}
                                    varColor="--white-color"
                                />

                                <NonBackgroundButton
                                    handleClick={() => navigate("/app/policies/cookies")}
                                    text={t("cookiePolicy")}
                                    varColor="--white-color"
                                />

                                <NonBackgroundButton
                                    handleClick={() => navigate("/app/policies/content")}
                                    text={t("contentPolicy")}
                                    varColor="--white-color"
                                />
                            </Stack>
                        </Stack>

                        <Stack
                            className={`${styles.footer_section} ${width <= 440 ? styles.small : undefined}`}
                            alignItems={width <= 440 ? "start" : "center"}
                            gap="2em"
                        >
                            <span>
                                FitX
                            </span>

                            <Stack
                                alignItems={width <= 440 ? "start" : "center"}
                                extraStyles={{ marginLeft: width <= 440 ? "1em" : "0" }}
                            >
                                <NonBackgroundButton
                                    handleClick={() => navigate("/app/about-us")}
                                    text={t("aboutUs")}
                                    varColor="--white-color"
                                />

                                <NonBackgroundButton
                                    handleClick={() => navigate("/app/authors")}
                                    text={t("authors")}
                                    varColor="--white-color"
                                />

                                <NonBackgroundButton
                                    handleClick={() => navigate("/app/partners")}
                                    text={t("partnerships")}
                                    varColor="--white-color"
                                />

                                <NonBackgroundButton
                                    handleClick={() => navigate("/app/sponsors")}
                                    text={t("sponsors")}
                                    varColor="--white-color"
                                />
                            </Stack>
                        </Stack>
                    </Stack>

                    {width <= 640 && (
                        <SendMessage />
                    )}
                </Stack>

                <p
                    style={{ fontSize: width <= 440 ? "var(--small-text-size)" : "var(--text-size)" }}
                >
                    &copy; 2025 FitX. {t("allRightsReserved")}
                </p>
            </Stack>
        </footer>
    );
}

export default Footer;