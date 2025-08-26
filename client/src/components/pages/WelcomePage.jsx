import { useTranslation } from "react-i18next";
import Stack from "../containers/Stack";
import styles from "./WelcomePage.module.css";
import FooterLayout from "../containers/FooterLayout";
import NonBackgroundButton from "../form/buttons/NonBackgroundButton";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import Title from "../text/Title";

function WelcomePage() {
    const { t } = useTranslation();

    const navigate = useNavigate();

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
            >
                <Stack
                    gap="5em"
                >
                    <Stack
                        gap="4em"
                    >
                        <Stack
                            direction="row"
                            gap="3em"
                        >
                            <Stack>
                                <img
                                    src="/images/logo/logo_v1_no_bg.png"
                                    alt=""
                                />

                                <Stack>
                                    <p>
                                        {t("signUpOrLoginInstruction")}
                                    </p>

                                    <NonBackgroundButton
                                        text={`${t("login")} ${t("or")} ${t("signUp")}`}
                                        handleClick={() => navigate("/login")}
                                        varColor="--theme-color"
                                    />
                                </Stack>
                            </Stack>

                            <Stack>
                                <Title
                                    headingNumber={1}
                                    text={t("welcome")}
                                />

                                <Stack>
                                    <Stack>
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
                                        varColor="--theme-color"
                                    />
                                </Stack>
                            </Stack>
                        </Stack>

                        <Stack
                            gap="3em"
                        >
                            <Title
                                headingNumber={2}
                                text={t("FitXApp")}
                            />

                            <Stack>
                                <Stack>
                                    <Stack>
                                        <Title
                                            headingNumber={3}
                                            text={t("accessibility")}
                                        />

                                        <Stack>
                                            <img
                                                src="/images/background/accessibility_illustration.png"
                                                alt=""
                                            />

                                            <Stack
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
                                    
                                    <Stack>
                                        <Title
                                            headingNumber={3}
                                            text={t("securityAndPrivacy")}
                                        />

                                        <Stack>
                                            <img
                                                src="/images/background/security_illustration.png"
                                                alt=""
                                            />

                                            <Stack
                                                direction="row"
                                            >
                                                {securityDescriptions.map((description, index) => (
                                                    <p
                                                        key={index}
                                                    >
                                                        {description}
                                                    </p>
                                                ))}
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                    
                                    <Stack>
                                        <Title
                                            headingNumber={3}
                                            text={t("effectivenessAndSpeed")}
                                        />

                                        <Stack>
                                            <img
                                                src="/images/background/effectiveness_illustration.png"
                                                alt=""
                                            />

                                            <Stack
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

                                    <Stack>
                                        <Title
                                            headingNumber={3}
                                            text={t("questionsWithCoachy")}
                                        />

                                        <Stack>
                                            <img
                                                src="/images/background/chatbot_illustration.png"
                                                alt=""
                                            />

                                            <Stack>
                                                <Stack
                                                    direction="row"
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
                                                        varColor="--theme-color"
                                                    />
                                                </p>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>

                                <p>
                                    {t("bePartOFitXDescription")}
                                </p>
                            </Stack>
                        </Stack>

                        <Stack
                            gap="3em"
                        >
                            <Title
                                headingNumber={2}
                                text={t("FitXClient")}
                            />

                            <Stack>
                                <Stack>
                                    <Stack>
                                        <Title
                                            headingNumber={3}
                                            text={t("trainerConnection")}
                                        />

                                        <Stack>
                                            <Stack>
                                                <Stack
                                                    direction="row"
                                                >
                                                    <Stack>
                                                        <Title
                                                            headingNumber={4}
                                                            text={t("contractATrainer")}
                                                        />

                                                        <img
                                                            src="/images/background/contract_trainer_illustration.png"
                                                            alt=""
                                                        />
                                                    </Stack>

                                                    <p>
                                                        {t("contractTrainerDescription")}
                                                    </p>
                                                </Stack>

                                                <Stack
                                                    direction="row"
                                                >
                                                    <p>
                                                        {t("chatTrainerDescription")}
                                                    </p>
        
                                                    <Stack>
                                                        <Title
                                                            headingNumber={4}
                                                            text={t("chatWithTrainer")}
                                                        />

                                                        <img
                                                            src="/images/background/chat_trainer_illustration.png"
                                                            alt=""
                                                        />
                                                    </Stack>
                                                </Stack>
                                                
                                                <Stack
                                                    direction="row"
                                                >
                                                    <Stack>
                                                        <Title
                                                            headingNumber={4}
                                                            text={t("individualizedTraining")}
                                                        />

                                                        <img
                                                            src="/images/background/individualized_training_illustration.png"
                                                            alt=""
                                                        />
                                                    </Stack>
        
                                                    <p>
                                                        {t("individualizedTrainingDescription")}
                                                    </p>
                                                </Stack>
                                                
                                                <Stack
                                                    direction="row"
                                                >
                                                    <p>
                                                        {t("progressSharingDescription")}
                                                    </p>
        
                                                    <Stack>
                                                        <Title
                                                            headingNumber={4}
                                                            text={t("progressSharing")}
                                                        />

                                                        <img
                                                            src="/images/background/progress_sharing_illustration.png"
                                                            alt=""
                                                        />
                                                    </Stack>
                                                </Stack>
                                            </Stack>

                                            <p>
                                                {t("thisAndMuchMoreInFitX")}
                                            </p>
                                        </Stack>
                                    </Stack>

                                    <Stack>
                                        <Title
                                            headingNumber={3}
                                            text={t("progressMonitoring")}
                                        />

                                        <Stack>
                                            <img
                                                src="/images/background/progress_monitoring_illustration.png"
                                                alt=""
                                            />

                                            <Stack
                                                direction="row"
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
                                </Stack>

                                <p>
                                    {t("beAFitXClientDescription")}
                                </p>
                            </Stack>
                        </Stack>

                        <Stack
                            gap="3em"
                        >
                            <Title
                                headingNumber={2}
                                text={t("FitXTrainer")}
                            />

                            <Stack>
                                <Stack>
                                    <Stack>
                                        <Title
                                            headingNumber={3}
                                            text={t("customizableTraining")}
                                        />

                                        <Stack>
                                            <img
                                                src="/images/background/customizable_training_illustration.png"
                                                alt=""
                                            />

                                            <Stack
                                                direction="row"
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

                                    <Stack>
                                        <Title
                                            headingNumber={3}
                                            text={t("workControl")}
                                        />

                                        <Stack>
                                            <Stack>
                                                <Stack
                                                    direction="row"
                                                >
                                                    <Stack>
                                                        <Title
                                                            headingNumber={4}
                                                            text={t("paymentPlans")}
                                                        />

                                                        <img
                                                            src="/images/background/payment_plans_illustration.png"
                                                            alt=""
                                                        />
                                                    </Stack>

                                                    <p>
                                                        {t("paymentPlanDescription")}
                                                    </p>
                                                </Stack>

                                                <Stack
                                                    direction="row"
                                                >
                                                    <p>
                                                        {t("serviceControlDescription")}
                                                    </p>
        
                                                    <Stack>
                                                        <Title
                                                            headingNumber={4}
                                                            text={t("serviceControl")}
                                                        />

                                                        <img
                                                            src="/images/background/service_control_illustration.png"
                                                            alt=""
                                                        />
                                                    </Stack>
                                                </Stack>
                                                
                                                <Stack
                                                    direction="row"
                                                >
                                                    <p>
                                                        {t("contractsManagementDescription")}
                                                    </p>
        
                                                    <Stack>
                                                        <Title
                                                            headingNumber={4}
                                                            text={t("contractsManagement")}
                                                        />

                                                        <img
                                                            src="/images/background/contracts_management_illustration.png"
                                                            alt=""
                                                        />
                                                    </Stack>
                                                </Stack>
                                                
                                                <Stack
                                                    direction="row"
                                                >
                                                    <Stack>
                                                        <Title
                                                            headingNumber={4}
                                                            text={t("clientsManagement")}
                                                        />

                                                        <img
                                                            src="/images/background/clients_management_illustration.png"
                                                            alt=""
                                                        />
                                                    </Stack>
        
                                                    <p>
                                                        {t("clientsManagementDescription")}
                                                    </p>
                                                </Stack>
                                            </Stack>

                                            <p>
                                                {t("thisAndMuchMoreInFitX")}
                                            </p>
                                        </Stack>
                                    </Stack>

                                    <Stack>
                                        <Title
                                            headingNumber={3}
                                            text={t("visibility")}
                                        />

                                        <Stack>
                                            <Stack
                                                direction="row"
                                            >
                                                <Stack>
                                                    <Title
                                                        headingNumber={4}
                                                        text={t("ratingsAndContracts")}
                                                    />

                                                    <img
                                                        src="/images/background/ratings_illustration.png"
                                                        alt=""
                                                    />
                                                </Stack>

                                                <p>
                                                    {t("ratingsAndContractsDescription")}
                                                </p>
                                            </Stack>

                                            <Stack
                                                direction="row"
                                            >
                                                <p>
                                                    {t("serviceCostDescription")}
                                                </p>

                                                <Stack>
                                                    <Title
                                                        headingNumber={4}
                                                        text={t("serviceCost")}
                                                    />

                                                    <img
                                                        src="/images/background/service_cost_illustration.png"
                                                        alt=""
                                                    />
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>

                                <p>
                                    {t("beAFitXTrainerDescription")}
                                </p>
                            </Stack>
                        </Stack>
                    </Stack>

                    <p>
                        {t("bePartOfFitxInstruction")}
                    </p>
                </Stack>
            </main>
        </FooterLayout>
    );
}

export default WelcomePage;