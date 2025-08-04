import { useTranslation } from "react-i18next";
import styles from "./TrainerPageContainers.module.css";
import Stack from "../containers/Stack";
import Title from "../text/Title";
import ClickableIcon from "../form/buttons/ClickableIcon";
import { formatNumberShort } from "../../utils/formatters/text/formatNumber";
import LoadMoreButton from "../form/buttons/LoadMoreButton";
import ComplaintCard from "../cards/user/ComplaintCard";
import ComplaintForm from "../form/forms/ComplaintForm";
import React from "react";

function ComplaintsContainer({
    complaints,
    complaintsError,
    complaintsOffset,
    complaintsLoading,
    handleLoadComplaints,
    trainerComplaintsNumber,
    viewerIsClient,
    handleLikeComplaint,
    handleRemoveComplaint,
    complaint,
    setComplaint,
    setComplaintError,
    handleComplaint
}) {
    const { t } = useTranslation();

    return (
        <Stack
            alignItems="start"
            className={styles.complaints_container}
            gap="2em"
        >
            <Title
                headingNumber={2}
                text={t("complaints")}
            />

            <Stack>
                <Stack
                    direction="row"
                    gap="0.5em"
                    justifyContent="start"
                >
                    <ClickableIcon
                        iconSrc="/images/icons/complaints.png"
                        name={t("complaints")}
                        hasTheme={false}
                    />

                    <span>
                        {formatNumberShort(trainerComplaintsNumber)}
                    </span>
                </Stack>
            </Stack>

            <Stack
                gap="3em"
            >
                {viewerIsClient && (
                    <ComplaintForm
                        complaint={complaint}
                        setComplaint={setComplaint}
                        setComplaintError={setComplaintError}
                        handleSubmit={handleComplaint}
                    />
                )}

                <Stack
                    gap="2em"
                >
                    <Stack>                    
                        <Stack
                            gap="2em"
                        >
                            {complaints.length !== 0 ? (
                                complaints.map((c, index) => (
                                    <React.Fragment
                                        key={index}
                                    >
                                        <ComplaintCard
                                            reason={c.reason}
                                            createDate={c.createDate}
                                            likesNumber={c.likesNumber}
                                            complainterID={c.complainterID}
                                            complainterName={c.complainter?.name}
                                            complainterPhotoUrl={c.complainter?.photoUrl}
                                            handleLike={viewerIsClient ? () => handleLikeComplaint(c.ID) : undefined}
                                            hasLiked={c.hasLiked}
                                            handleRemoveComplaint={viewerIsClient ? () => handleRemoveComplaint(c.ID) : undefined}
                                        />
                                    </React.Fragment>
                                ))
                            ) : (
                                <p>
                                    {t("noComplaintsFinded")}
                                </p>
                            )}
                        </Stack>
                    </Stack>

                    {complaintsError ? (
                        <p>
                            <>
                                {t("errorOcurredComplaints")}

                                <br/>
                                
                                {t("reloadOrTryLater")}
                            </>
                        </p>
                    ) : (
                        <LoadMoreButton
                            handleLoad={() => handleLoadComplaints(complaintsError, complaints, complaintsOffset, complaintsLoading)}
                            loading={complaintsLoading}
                        />
                    )}
                </Stack>                                                             
            </Stack>
        </Stack>
    )
}

export default ComplaintsContainer;