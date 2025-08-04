
import { useTranslation } from "react-i18next";
import ClickableIcon from "../form/buttons/ClickableIcon";
import { formatNumberShort } from "../../utils/formatters/text/formatNumber";
import useWindowSize from "../../hooks/useWindowSize";
import Stack from "../containers/Stack";

// complaints, rate, contracts
function TrainerCRCInfo({
    rate,
    complaintsNumber,
    contractsNumber
}) {
    const { t } = useTranslation();

    const { width } = useWindowSize();

    return (
        <Stack>
            <hr/>

            <Stack
                direction="row"
            >
                <Stack
                    direction="row"
                    gap="0.5em"
                    justifyContent="center"
                >
                    <ClickableIcon
                        iconSrc="/images/icons/rated.png"
                        name={t("averageGrade")}
                        size={width <= 440 ? "small" : "medium"}
                        hasTheme={false}
                    />

                    <span>
                        {Number(rate).toFixed(2)}
                    </span>
                </Stack>

                <Stack
                    direction="row"
                    gap="0.5em"
                    justifyContent="center"
                >
                    <ClickableIcon
                        iconSrc="/images/icons/contracts.png"
                        name={t("hirings")}
                        size={width <= 440 ? "small" : "medium"}
                        hasTheme={false}
                    />

                    <span>
                        {formatNumberShort(contractsNumber)}
                    </span>
                </Stack>

                <Stack
                    direction="row"
                    gap="0.5em"
                    justifyContent="center"
                >
                    <ClickableIcon
                        iconSrc="/images/icons/complaints.png"
                        name={t("complaints")}
                        size={width <= 440 ? "small" : "medium"}
                        hasTheme={false}
                    />

                    <span>
                        {formatNumberShort(complaintsNumber)}
                    </span>
                </Stack>
            </Stack>

            <hr/>
        </Stack>
    );
}

export default TrainerCRCInfo;