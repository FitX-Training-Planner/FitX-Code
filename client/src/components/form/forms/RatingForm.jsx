
import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import TextArea from "../fields/TextArea";
import { handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import ClickableIcon from "../buttons/ClickableIcon";
import { isRatingCommentValid } from "../../../utils/validators/userValidator";
import { formattNameAndNote } from "../../../utils/formatters/training/formatOnChange";
import styles from "./TrainerPageForms.module.css";
import useWindowSize from "../../../hooks/useWindowSize";

function RatingForm({
    rating,
    setRating,
    setRatingError,
    handleSubmit 
}) {
    const { t } = useTranslation();
    
    const [errors, setErrors] = useState({
        comment: false
    });

    const { width } = useWindowSize();

    return (
        <form 
            onSubmit={handleSubmit}
            className={styles.rating_form}
            style={{ padding: width <= 440 ? "1em" : "2em" }}
        >
            <Stack>
                <Stack>
                    <Stack
                        gap="2em"
                        direction={width <= 440 ? "column-reverse" : "row"}
                        alignItems="end"
                    >
                        <Stack
                            direction="row"
                            justifyContent="start"
                        >
                            {[1, 2, 3, 4, 5].map(value => (
                                <React.Fragment
                                    key={value}
                                >
                                    <ClickableIcon
                                        iconSrc={`/images/icons/${value <= rating.rating ? "rated" : "rate"}.png`}
                                        name={value}
                                        hasTheme={value <= rating.rating ? false : true}
                                        handleClick={() => setRating(prevRating => ({ ...prevRating, rating: value }))}
                                    />
                                </React.Fragment>
                            ))}
                        </Stack>

                        <SubmitFormButton
                            text={t("rate")}
                        />
                    </Stack>

                    <Stack>
                        <TextArea
                            name="comment"
                            placeholder={t("commentPlaceholder")}
                            labelText={t("comment")}
                            value={rating.comment}
                            handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, isRatingCommentValid, rating, setRating, setRatingError, setErrors)}
                            alertMessage={t("alertRatingComment")}
                            error={errors.comment}
                            maxLength={255}
                        />
                    </Stack>
                </Stack>
            </Stack>
        </form>
    );
}

export default RatingForm;