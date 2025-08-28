import { useTranslation } from "react-i18next";
import Stack from "../containers/Stack";
import styles from "./WelcomePage.module.css";
import FooterLayout from "../containers/FooterLayout";
import NonBackgroundButton from "../form/buttons/NonBackgroundButton";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import Title from "../text/Title";
import useWindowSize from "../../hooks/useWindowSize";
import AnimatedInViewItem from "../containers/AnimatedInViewItem";

function WelcomePage() {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const { width } = useWindowSize();

    const welcomeDescriptions = useMemo(() => {
        return [
            t("welcomeDescription1"),
            t("welcomeDescription2"),
            t("welcomeDescription3")
        ]
    }, [t]);
   
    const chatbotDescriptions = useMemo(() => {
        return [
            t("chatbotDescription1"),
            t("chatbotDescription2")
        ]
    }, [t]);
    
    const progressMonitoringDescriptions = useMemo(() => {
        return [
            t("progressDescription1"),
            t("progressDescription2"),
            t("progressDescription3")
        ]
    }, [t]);
    
    const trainingDescriptions = useMemo(() => {
        return [
            t("trainingDescription1"),
            t("trainingDescription2"),
            t("trainingDescription3")
        ]
    }, [t]);
    
    const accessibilityDescriptions = useMemo(() => {
        return [
            t("accessibilityDescription1"),
            t("accessibilityDescription2"),
            t("accessibilityDescription3")
        ]
    }, [t]);
    
    const securityDescriptions = useMemo(() => {
        return [
            t("securityDescription1"),
            t("securityDescription2"),
            t("securityDescription3")
        ]
    }, [t]);
    
    const effectivenessDescriptions = useMemo(() => {
        return [
            t("effectivenessDescription1"),
            t("effectivenessDescription2"),
            t("effectivenessDescription3")
        ]
    }, [t]);

    useEffect(() => {
        document.title = t("introduction")
    }, [t]);

    return (
        <FooterLayout>
            <main
                className={styles.welcome_page}
                style={{ paddingInline: width <= 640 ? "2em" : "5em" }}
            >
                <Stack
                    gap="10em"
                >
                    <Stack>
                        <Stack
                            direction={width <= 840 ? "column" : "row"}
                            className={styles.main_welcome}
                            justifyContent="center"
                            gap="5em"
                        >
                            <AnimatedInViewItem>
                                <Stack
                                    gap="3em"
                                >
                                    <Stack
                                        justifyContent="center"
                                        className={styles.logo}
                                    >
                                        <img
                                            src="/images/logo/logo_v1_no_bg.png"
                                            alt=""
                                        />
                                    </Stack>

                                    <Stack>
                                        <p>
                                            {t("signUpOrLoginInstruction")}
                                        </p>

                                        <NonBackgroundButton
                                            text={`${t("login")} ${t("or")} ${t("signUp")}`}
                                            handleClick={() => navigate("/login")}
                                            varColor="--light-theme-color"
                                        />
                                    </Stack>
                                </Stack>
                            </AnimatedInViewItem>

                            <AnimatedInViewItem>
                                <Stack
                                    gap="3em"
                                >
                                    <Title
                                        headingNumber={1}
                                        text={t("welcome")}
                                        varColor="--theme-color"
                                    />

                                    <Stack
                                        gap="2em"
                                    >
                                        <Stack
                                            className={styles.descriptions}
                                            gap="2em"
                                        >
                                            {welcomeDescriptions.map((description, index) => (
                                                <p
                                                    key={index}
                                                >
                                                    {description}
                                                </p>
                                            ))}
                                        </Stack>

                                        <NonBackgroundButton
                                            text={t("goToFitX")}
                                            handleClick={() => navigate("/")}
                                            varColor="--light-theme-color"
                                        />
                                    </Stack>
                                </Stack>
                            </AnimatedInViewItem>
                        </Stack>

                        <Stack
                            gap="15em"
                        >
                            <Stack
                                gap="8em"
                            >
                                <Title
                                    headingNumber={2}
                                    varColor="--light-theme-color"
                                    text={t("FitXApp")}
                                />

                                <Stack
                                    gap="6em"
                                >
                                    <Stack
                                        gap="6em"
                                    >
                                        <AnimatedInViewItem>
                                            <Stack
                                                gap="3em"
                                            >
                                                <Title
                                                    headingNumber={3}
                                                    varColor="--white-color"
                                                    text={t("accessibility")}
                                                />

                                                <Stack
                                                    justifyContent="center"
                                                >
                                                    <Stack
                                                        justifyContent="center"
                                                        className={`${styles.illustration} ${styles.large}`}
                                                    >
                                                        <img
                                                            src="https://res.cloudinary.com/ddg7swr5r/image/upload/v1756409333/accessibility_illustration_s1hhqj.jpg"
                                                            alt=""
                                                        />
                                                    </Stack>

                                                    <Stack
                                                        className={styles.descriptions}
                                                        gap="2em"
                                                        direction="row"
                                                    >
                                                        {accessibilityDescriptions.map((description, index) => (
                                                            <p
                                                                key={index}
                                                            >
                                                                {description}
                                                            </p>
                                                        ))}
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </AnimatedInViewItem>
                                        
                                        <AnimatedInViewItem>
                                            <Stack
                                                gap="3em"
                                            >
                                                <Title
                                                    headingNumber={3}
                                                    varColor="--white-color"
                                                    text={t("securityAndPrivacy")}
                                                />

                                                <Stack
                                                    direction="row"
                                                    justifyContent="center"
                                                >
                                                    <Stack
                                                        className={styles.descriptions}
                                                        gap="2em"
                                                    >
                                                        {securityDescriptions.map((description, index) => (
                                                            <p
                                                                key={index}
                                                                >
                                                                {description}
                                                            </p>
                                                        ))}
                                                    </Stack>

                                                    <Stack
                                                        justifyContent="center"
                                                        className={`${styles.illustration} ${styles.large}`}
                                                    >
                                                        <img
                                                            src="https://res.cloudinary.com/ddg7swr5r/image/upload/v1756409335/security_illustration_y4jhzw.jpg"
                                                            alt=""
                                                        />
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </AnimatedInViewItem>
                                        
                                        <AnimatedInViewItem>
                                            <Stack
                                                gap="3em"
                                            >
                                                <Title
                                                    headingNumber={3}
                                                    varColor="--white-color"
                                                    text={t("effectivenessAndSpeed")}
                                                />

                                                <Stack
                                                    justifyContent="center"
                                                >
                                                    <Stack
                                                        justifyContent="center"
                                                        className={`${styles.illustration} ${styles.large}`}
                                                    >
                                                        <img
                                                            src="https://res.cloudinary.com/ddg7swr5r/image/upload/v1756409334/effectiveness_illustration_iqux21.jpg"
                                                            alt=""
                                                        />
                                                    </Stack>

                                                    <Stack
                                                        className={styles.descriptions}
                                                        gap="2em"
                                                        direction="row"
                                                    >
                                                        {effectivenessDescriptions.map((description, index) => (
                                                            <p
                                                                key={index}
                                                            >
                                                                {description}
                                                            </p>
                                                        ))}
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </AnimatedInViewItem>

                                        <AnimatedInViewItem>
                                            <Stack
                                                gap="3em"
                                            >
                                                <Title
                                                    headingNumber={3}
                                                    varColor="--white-color"
                                                    text={t("questionsWithCoachy")}
                                                />

                                                <Stack>
                                                    <Stack
                                                        justifyContent="center"
                                                        className={`${styles.illustration} ${styles.large}`}
                                                    >
                                                        <img
                                                            src="https://res.cloudinary.com/ddg7swr5r/image/upload/v1756409333/chatbot_illustration_a7uj3o.jpg"
                                                            alt=""
                                                        />
                                                    </Stack>

                                                    <Stack
                                                        gap="3em"
                                                    >
                                                        <Stack
                                                            direction="row"
                                                            className={styles.descriptions}
                                                            gap="2em"
                                                            justifyContent="center"
                                                            alignItems="start"
                                                        >
                                                            {chatbotDescriptions.map((description, index) => (
                                                                <p
                                                                    key={index}
                                                                >
                                                                    {description}
                                                                </p>
                                                            ))}
                                                        </Stack>

                                                        <p>
                                                            {`${t("didYouLike")} `}

                                                            <NonBackgroundButton
                                                                text={t("chatWithCoachy")}
                                                                handleClick={() => navigate("/questions-chatbot")}
                                                                varColor="--light-theme-color"
                                                            />
                                                        </p>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </AnimatedInViewItem>
                                    </Stack>

                                    <AnimatedInViewItem>
                                        <p>
                                            {t("bePartOFitXDescription")}
                                        </p>
                                    </AnimatedInViewItem>
                                </Stack>
                            </Stack>

                            <Stack
                                gap="8em"
                            >
                                <Title
                                    headingNumber={2}
                                    varColor="--light-theme-color"
                                    text={t("FitXClient")}
                                />

                                <Stack
                                    gap="6em"
                                >
                                    <Stack
                                        gap="6em"
                                    >
                                        <AnimatedInViewItem>
                                            <Stack
                                                gap="3em"
                                            >
                                                <Title
                                                    headingNumber={3}
                                                    varColor="--white-color"
                                                    text={t("progressMonitoring")}
                                                />

                                                <Stack
                                                    direction="row"
                                                    justifyContent="center"
                                                >
                                                    <Stack
                                                        justifyContent="center"
                                                        className={`${styles.illustration} ${styles.large}`}
                                                    >
                                                        <img
                                                            src="https://res.cloudinary.com/ddg7swr5r/image/upload/v1756409334/progress_monitoring_illustration_zhal5l.jpg"
                                                            alt=""
                                                        />
                                                    </Stack>

                                                    <Stack
                                                        className={styles.descriptions}
                                                        gap="2em"
                                                    >
                                                        {progressMonitoringDescriptions.map((description, index) => (
                                                            <p
                                                                key={index}
                                                            >
                                                                {description}
                                                            </p>
                                                        ))}
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </AnimatedInViewItem>

                                        <Stack
                                            gap="3em"
                                        >
                                            <AnimatedInViewItem>
                                                <Title
                                                    headingNumber={3}
                                                    varColor="--white-color"
                                                    text={t("trainerConnection")}
                                                />
                                            </AnimatedInViewItem>

                                            <Stack
                                                gap="4em"
                                            >
                                                <Stack
                                                    gap="3em"
                                                >
                                                    <AnimatedInViewItem>
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="start"
                                                        >
                                                            <Stack
                                                                className={styles.illustration_with_title}
                                                            >
                                                                <Title
                                                                    headingNumber={4}
                                                                    varColor="--dark-color"
                                                                    textAlign="left"
                                                                    text={t("contractATrainer")}
                                                                />

                                                                <Stack
                                                                    justifyContent="center"
                                                                    className={styles.illustration}
                                                                >
                                                                    <img
                                                                        src="https://res.cloudinary.com/ddg7swr5r/image/upload/v1756409333/contract_trainer_illustration_gvinai.jpg"
                                                                        alt=""
                                                                    />
                                                                </Stack>
                                                            </Stack>

                                                            <p>
                                                                {t("contractTrainerDescription")}
                                                            </p>
                                                        </Stack>
                                                    </AnimatedInViewItem>

                                                    <AnimatedInViewItem>
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="end"
                                                        >
                                                            <p>
                                                                {t("chatTrainerDescription")}
                                                            </p>
                
                                                            <Stack
                                                                className={styles.illustration_with_title}
                                                            >
                                                                <Title
                                                                    headingNumber={4}
                                                                    varColor="--dark-color"
                                                                    textAlign="left"
                                                                    text={t("chatWithTrainer")}
                                                                />

                                                                <Stack
                                                                    justifyContent="center"
                                                                    className={styles.illustration}
                                                                >
                                                                    <img
                                                                        src="https://res.cloudinary.com/ddg7swr5r/image/upload/v1756409332/chat_trainer_illustration_ku1qai.jpg"
                                                                        alt=""
                                                                    />
                                                                </Stack>
                                                            </Stack>
                                                        </Stack>
                                                    </AnimatedInViewItem>

                                                    <AnimatedInViewItem>
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="start"
                                                        >
                                                            <Stack
                                                                className={styles.illustration_with_title}
                                                            >
                                                                <Title
                                                                    headingNumber={4}
                                                                    varColor="--dark-color"
                                                                    textAlign="left"
                                                                    text={t("individualizedTraining")}
                                                                />

                                                                <Stack
                                                                    justifyContent="center"
                                                                    className={styles.illustration}
                                                                >
                                                                    <img
                                                                        src="https://res.cloudinary.com/ddg7swr5r/image/upload/v1756409335/individualized_training_illustration_oeoj3x.jpg"
                                                                        alt=""
                                                                    />
                                                                </Stack>
                                                            </Stack>
                
                                                            <p>
                                                                {t("individualizedTrainingDescription")}
                                                            </p>
                                                        </Stack>
                                                    </AnimatedInViewItem>

                                                    <AnimatedInViewItem>
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="end" 
                                                        >
                                                            <p>
                                                                {t("progressSharingDescription")}
                                                            </p>
                
                                                            <Stack
                                                                className={styles.illustration_with_title}
                                                            >
                                                                <Title
                                                                    headingNumber={4}
                                                                    varColor="--dark-color"
                                                                    textAlign="left"
                                                                    text={t("progressSharing")}
                                                                />

                                                                <Stack
                                                                    justifyContent="center"
                                                                    className={styles.illustration}
                                                                >
                                                                    <img
                                                                        src="https://res.cloudinary.com/ddg7swr5r/image/upload/v1756409334/progress_sharing_illustration_voyia5.jpg"
                                                                        alt=""
                                                                    />
                                                                </Stack>
                                                            </Stack>
                                                        </Stack>
                                                    </AnimatedInViewItem>
                                                </Stack>

                                                <AnimatedInViewItem>
                                                    <p>
                                                        {t("thisAndMuchMoreInFitX")}
                                                    </p>
                                                </AnimatedInViewItem>
                                            </Stack>
                                        </Stack>
                                    </Stack>

                                    <AnimatedInViewItem>
                                        <p>
                                            {t("beAFitXClientDescription")}
                                        </p>
                                    </AnimatedInViewItem>
                                </Stack>
                            </Stack>

                            <Stack
                                gap="8em"
                            >
                                <Title
                                    headingNumber={2}
                                    varColor="--light-theme-color"
                                    text={t("FitXTrainer")}
                                />

                                <Stack
                                    gap="6em"
                                >
                                    <Stack
                                        gap="6em"
                                    >
                                        <AnimatedInViewItem>
                                            <Stack
                                                gap="3em"
                                            >
                                                <Title
                                                    headingNumber={3}
                                                    varColor="--white-color"
                                                    text={t("customizableTraining")}
                                                />

                                                <Stack>
                                                    <Stack
                                                        justifyContent="center"
                                                        className={`${styles.illustration} ${styles.large}`}
                                                    >
                                                        <img
                                                            src="https://res.cloudinary.com/ddg7swr5r/image/upload/v1756409333/customizable_training_illustration_oqgznw.jpg"
                                                            alt=""
                                                        />
                                                    </Stack>

                                                    <Stack
                                                        direction="row"
                                                        justifyContent="center"
                                                        alignItems="start"
                                                        className={styles.descriptions}
                                                        gap="2em"
                                                    >
                                                        {trainingDescriptions.map((description, index) => (
                                                            <p
                                                                key={index}
                                                            >
                                                                {description}
                                                            </p>
                                                        ))}
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </AnimatedInViewItem>

                                        <Stack
                                            gap="3em"
                                        >
                                            <AnimatedInViewItem>
                                                <Title
                                                    headingNumber={3}
                                                    varColor="--white-color"
                                                    text={t("workControl")}
                                                />
                                            </AnimatedInViewItem>

                                            <Stack
                                                gap="4em"
                                            >
                                                <Stack
                                                    gap="3em"
                                                >
                                                    <AnimatedInViewItem>
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="start"
                                                        >
                                                            <Stack
                                                                className={styles.illustration_with_title}
                                                            >
                                                                <Title
                                                                    headingNumber={4}
                                                                    varColor="--dark-color"
                                                                    textAlign="left"
                                                                    text={t("paymentPlans")}
                                                                />

                                                                <Stack
                                                                    justifyContent="center"
                                                                    className={styles.illustration}
                                                                >
                                                                    <img
                                                                        src="https://res.cloudinary.com/ddg7swr5r/image/upload/v1756409334/payment_plans_illustration_apvlnl.jpg"
                                                                        alt=""
                                                                    />
                                                                </Stack>
                                                            </Stack>

                                                            <p>
                                                                {t("paymentPlanDescription")}
                                                            </p>
                                                        </Stack>
                                                    </AnimatedInViewItem>

                                                    <AnimatedInViewItem>
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="end"
                                                        >
                                                            <p>
                                                                {t("serviceControlDescription")}
                                                            </p>
                
                                                            <Stack
                                                                className={styles.illustration_with_title}
                                                            >
                                                                <Title
                                                                    headingNumber={4}
                                                                    varColor="--dark-color"
                                                                    textAlign="left"
                                                                    text={t("serviceControl")}
                                                                />

                                                                <Stack
                                                                    justifyContent="center"
                                                                    className={styles.illustration}
                                                                >
                                                                    <img
                                                                        src="https://res.cloudinary.com/ddg7swr5r/image/upload/v1756409335/service_control_illustration_bjqkkk.jpg"
                                                                        alt=""
                                                                    />
                                                                </Stack>
                                                            </Stack>
                                                        </Stack>
                                                    </AnimatedInViewItem>
                                                    
                                                    <AnimatedInViewItem>
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="end"
                                                        >
                                                            <p>
                                                                {t("contractsManagementDescription")}
                                                            </p>
                
                                                            <Stack
                                                                className={styles.illustration_with_title}
                                                            >
                                                                <Title
                                                                    headingNumber={4}
                                                                    varColor="--dark-color"
                                                                    textAlign="left"
                                                                    text={t("contractsManagement")}
                                                                />

                                                                <Stack
                                                                    justifyContent="center"
                                                                    className={styles.illustration}
                                                                >
                                                                    <img
                                                                        src="https://res.cloudinary.com/ddg7swr5r/image/upload/v1756409333/contracts_management_illustration_jfdtfq.jpg"
                                                                        alt=""
                                                                    />
                                                                </Stack>
                                                            </Stack>
                                                        </Stack>
                                                    </AnimatedInViewItem>
                                                    
                                                    <AnimatedInViewItem>
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="start"
                                                        >
                                                            <Stack
                                                                className={styles.illustration_with_title}
                                                            >
                                                                <Title
                                                                    headingNumber={4}
                                                                    varColor="--dark-color"
                                                                    textAlign="left"
                                                                    text={t("clientsManagement")}
                                                                />

                                                                <Stack
                                                                    justifyContent="center"
                                                                    className={styles.illustration}
                                                                >
                                                                    <img
                                                                        src="https://res.cloudinary.com/ddg7swr5r/image/upload/v1756409333/clients_management_illustration_gtyedl.jpg"
                                                                        alt=""
                                                                    />
                                                                </Stack>
                                                            </Stack>
                
                                                            <p>
                                                                {t("clientsManagementDescription")}
                                                            </p>
                                                        </Stack>
                                                    </AnimatedInViewItem>
                                                </Stack>

                                                <AnimatedInViewItem>
                                                    <p>
                                                        {t("thisAndMuchMoreInFitX")}
                                                    </p>
                                                </AnimatedInViewItem>
                                            </Stack>
                                        </Stack>

                                        <Stack
                                            gap="3em"
                                        >
                                            <AnimatedInViewItem>
                                                <Title
                                                    headingNumber={3}
                                                    varColor="--white-color"
                                                    text={t("visibility")}
                                                />
                                            </AnimatedInViewItem>

                                            <Stack
                                                gap="3em"
                                            >
                                                <AnimatedInViewItem>
                                                    <Stack
                                                        direction="row"
                                                        justifyContent="end"
                                                    >
                                                        <p>
                                                            {t("ratingsAndContractsDescription")}
                                                        </p>

                                                        <Stack
                                                            className={styles.illustration_with_title}
                                                        >
                                                            <Title
                                                                headingNumber={4}
                                                                varColor="--dark-color"
                                                                textAlign="left"
                                                                text={t("ratingsAndContracts")}
                                                            />

                                                            <Stack
                                                                justifyContent="center"
                                                                className={styles.illustration}
                                                            >
                                                                <img
                                                                    src="https://res.cloudinary.com/ddg7swr5r/image/upload/v1756409335/ratings_illustration_fgjmgv.jpg"
                                                                    alt=""
                                                                />
                                                            </Stack>
                                                        </Stack>
                                                    </Stack>
                                                </AnimatedInViewItem>

                                                <AnimatedInViewItem>
                                                    <Stack
                                                        direction="row"
                                                        justifyContent="start"
                                                    >
                                                        <Stack
                                                            className={styles.illustration_with_title}
                                                        >
                                                            <Title
                                                                headingNumber={4}
                                                                varColor="--dark-color"
                                                                textAlign="left"
                                                                text={t("serviceCost")}
                                                            />

                                                            <Stack
                                                                justifyContent="center"
                                                                className={styles.illustration}
                                                            >
                                                                <img
                                                                    src="https://res.cloudinary.com/ddg7swr5r/image/upload/v1756409335/service_cost_illustration_nizmkz.jpg"
                                                                    alt=""
                                                                    />
                                                            </Stack>
                                                        </Stack>

                                                        <p>
                                                            {t("serviceCostDescription")}
                                                        </p>
                                                    </Stack>
                                                </AnimatedInViewItem>
                                            </Stack>
                                        </Stack>
                                    </Stack>

                                    <AnimatedInViewItem>
                                        <p>
                                            {t("beAFitXTrainerDescription")}
                                        </p>
                                    </AnimatedInViewItem>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>

                    <AnimatedInViewItem>
                        <p>
                            {t("bePartOfFitxInstruction")}
                        </p>
                    </AnimatedInViewItem>
                </Stack>
            </main>
        </FooterLayout>
    );
}

export default WelcomePage;