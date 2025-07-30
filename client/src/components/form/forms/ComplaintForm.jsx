
import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import TextArea from "../fields/TextArea";
import { handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import { isRatingCommentValid } from "../../../utils/validators/userValidator";
import { formattNameAndNote } from "../../../utils/formatters/training/formatOnChange";
import styles from "./TrainerPageForms.module.css";
import useWindowSize from "../../../hooks/useWindowSize";

function ComplaintForm({
    complaint,
    setComplaint,
    setComplaintError,
    handleSubmit 
}) {
    const { t } = useTranslation();

    const { width } = useWindowSize();
    
    const [errors, setErrors] = useState({
        reason: false
    });

    return (
        <form 
            onSubmit={handleSubmit}
            className={styles.complaint_form}
            style={{ padding: width <= 440 ? "1em" : "2em" }}
        >
            <Stack
                gap="2em"
            >
                <Stack>
                    <TextArea
                        name="reason"
                        placeholder={t("complaintReasonPlaceholder")}
                        labelText={t("complaintReason")}
                        value={complaint.reason}
                        handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, isRatingCommentValid, complaint, setComplaint, setComplaintError, setErrors)}
                        alertMessage={t("alertComplaintReason")}
                        error={errors.reason}
                        maxLength={255}
                    />
                </Stack>

                <SubmitFormButton
                    text={t("report")}
                />
            </Stack>
        </form>
    );
}

export default ComplaintForm;