import convertDays from "../../../utils/formatters/text/convertDays";
import Stack from "../../containers/Stack";
import PhotoInput from "../../form/fields/PhotoInput";
import styles from "./SmallTrainerProfessionalCard.module.css";
import { formatDateToExtend } from "../../../utils/formatters/text/formatDate";
import useWindowSize from "../../../hooks/useWindowSize";
import SubmitFormButton from "../../form/buttons/SubmitFormButton";

function ClientTrainingContractCard({
    trainerName,
    trainerPhotoUrl,
    trainerCrefNumber,
    trainingPlanID,
    trainingPlanName,
    contractStartDate,
    contractEndDate,
    handleCancelContract
}) {
    const { width } = useWindowSize();

    return (
        <Stack
            className={styles.training_contract_card}
            gap="0.5em"
        >
            <Stack
                gap="2em"
            >
                <Stack
                    className={styles.descriptioned_item}
                >
                    {trainingPlanID ? (
                        <span>
                            {trainingPlanName}
                        </span>
                    ) : (
                        <p>
                            Seu treinador ainda não te enviou um treino
                        </p>
                    )}
                </Stack>

                <Stack
                    gap="2em"
                    direction={width <= 640 ? "column" : "row"}
                >
                    <Stack
                        className={styles.descriptioned_item}
                        alignItems={width <= 640 ? "center" : "start"}
                    >

                        <Stack
                            className={styles.professional_name_container}
                        >
                            <span>
                                Treinador:
                            </span>

                            <hr/>

                            <Stack
                                gap="0.5em"
                            >
                                <Stack
                                    direction={width <= 440 ? "column" : "row"}
                                    className={styles.descriptioned_item}
                                    justifyContent="center"
                                >
                                    <PhotoInput
                                        blobUrl={trainerPhotoUrl}
                                        disabled
                                        size={width <= 440 ? "small" : "medium"}
                                    />

                                    <span>
                                        {trainerName}
                                    </span>
                                </Stack>

                                {trainerCrefNumber && (
                                    <span>
                                        CREF {trainerCrefNumber}
                                    </span>
                                )}
                            </Stack>
                        </Stack>
                    </Stack>

                    <Stack
                        alignItems={width <= 640 ? "center" : "end"}
                        extraStyles={{ textAlign: width <= 640 ? "center" : "end" }}
                        gap="2em"
                        className={styles.descriptioned_item}
                    >
                        <span>
                            Contrato:
                        </span>

                        <Stack
                            gap="2em"
                            alignItems={width <= 640 ? "center" : "end"}
                            extraStyles={{ textAlign: width <= 640 ? "center" : "end" }}
                        >
                            <Stack
                                alignItems={width <= 640 ? "center" : "end"}
                                extraStyles={{ textAlign: width <= 640 ? "center" : "end" }}
                                gap="0.5em"
                            >
                                <Stack
                                    direction={width <= 440 ? "column" : "row"}
                                    gap="0.2em"
                                    justifyContent={width <= 640 ? "center" : "end"}
                                    extraStyles={{ textAlign: width <= 640 ? "center" : "end" }}
                                >
                                    <span>
                                        {formatDateToExtend(contractStartDate)}
                                    </span>

                                    - 

                                    <span>
                                        {formatDateToExtend(contractEndDate)}
                                    </span>
                                </Stack>

                                <p>
                                    {convertDays((new Date(contractEndDate) - new Date(contractStartDate) / (1)))} restando
                                </p>
                            </Stack>

                            <form
                                onSubmit={handleCancelContract}
                            >
                                <SubmitFormButton
                                    text="Cancelar Contrato"
                                    varBgColor="--alert-color"
                                />
                            </form>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
}

export default ClientTrainingContractCard;