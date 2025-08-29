import { useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Stack from "../../containers/Stack";
import styles from "./DateInput.module.css";
import Select from "./Select";
import { handleOnChangeSelect, handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import { formattSecondsMinutesAndReps } from "../../../utils/formatters/training/formatOnChange";
import NonBackgroundButton from "../buttons/NonBackgroundButton";

function DateInput({
    labelText,
    dateValuesObject,
    setDateValuesObject,
    error,
    setError,
    minYear = 2025
}) {
    const { t } = useTranslation();

    const maxYear = useMemo(() => {
        return new Date().getFullYear();
    }, []);
    
    const months = useMemo(() => {
        return [
            { value: 1, label: t("january") },
            { value: 2, label: t("february") },
            { value: 3, label: t("march") },
            { value: 4, label: t("april") },
            { value: 5, label: t("may") },
            { value: 6, label: t("june") },
            { value: 7, label: t("july") },
            { value: 8, label: t("august") },
            { value: 9, label: t("september") },
            { value: 10, label: t("october") },
            { value: 11, label: t("november") },
            { value: 12, label: t("december") }
        ]
    }, [t]);

    const getMonthValue = useCallback(m => {
        if (!m) return "";

        return months.find(month => month.label === m)?.value;
    }, [months]);

    const getMaxDay = useCallback((m, year) => {
        if (!m || !year) return 31;

        return new Date(year, getMonthValue(m), 0).getDate();
    }, [getMonthValue]);

    const validateYear = useCallback((year) => {
        return !year || ((year >= minYear) && (year <= maxYear));
    }, [maxYear, minYear]);

    const formattDay = useCallback((day) => {
        let newDay = formattSecondsMinutesAndReps(day);
        
        newDay = newDay === "" ? "" : String(Math.min(Number(newDay), getMaxDay(dateValuesObject.month?.label, dateValuesObject.year)));
        
        return newDay;
    }, [dateValuesObject.month?.label, dateValuesObject.year, getMaxDay]);

    const formattYear = useCallback((year) => {
        let newYear = formattSecondsMinutesAndReps(year);

        return newYear;
    }, []);

    useEffect(() => {
        if (dateValuesObject.day && !(dateValuesObject.month?.label && dateValuesObject.year)) {
            setError(true);

            setDateValuesObject(prevDateValues => ({
                ...prevDateValues,
                fullDate: ""
            }));

            return;
        }

        const monthValue = getMonthValue(dateValuesObject.month?.label);
        
        if (!(dateValuesObject.day && monthValue && (dateValuesObject.year ? validateYear(dateValuesObject.year) : false) )) {
            setDateValuesObject(prevDateValues => ({
                ...prevDateValues,
                fullDate: ""
            }));
            
            return;
        }

        setDateValuesObject(prevDateValues => ({
            ...prevDateValues,
            day: formattDay(prevDateValues.day),
            fullDate: `${dateValuesObject.year}-${String(monthValue).padStart(2, "0")}-${String(formattDay(prevDateValues.day)).padStart(2, "0")}`
        }));
    }, [getMonthValue, dateValuesObject.month?.label, dateValuesObject.day, dateValuesObject.year, setDateValuesObject, setError, validateYear, formattDay]);

    return (
        <Stack 
            className={styles.date_input} 
            gap="0.5em" 
            alignItems="start"
        >
            {labelText && (
                <label>
                    {labelText}
                </label>
            )}

            <Stack
                gap="0.2em"
            >
                <Stack 
                    direction="row"
                    className={styles.inputs_container}
                    alignItems="start"
                >
                    <input
                        className={`${styles.input} ${styles.day}`}
                        type="text"
                        name="day"
                        id="day"
                        placeholder={t("day")}
                        value={dateValuesObject.day}
                        onChange={(e) => handleOnChangeTextField(e, formattDay, undefined, dateValuesObject, setDateValuesObject, setError)}
                        maxLength={2}
                    />

                    <Select
                        name="month"
                        placeholder={t("month")}
                        value={dateValuesObject.month?.label}
                        handleChange={(e) => handleOnChangeSelect(e, months, "label", dateValuesObject, setDateValuesObject, setError)}
                        options={months.map(m => m.label)}
                        className={styles.month}
                    />
                    
                    <input
                        className={`${styles.input} ${styles.year}`}
                        type="text"
                        name="year"
                        id="year"
                        placeholder={t("year")}
                        value={dateValuesObject.year}
                        onChange={(e) => {
                            handleOnChangeTextField(e, formattYear, undefined, dateValuesObject, setDateValuesObject, setError);
                            setDateValuesObject(prevValues => ({ ...prevValues, validYear: validateYear(formattYear(e.target.value)) ? formattYear(e.target.value) : "" }));
                        }}
                        maxLength={4}
                    />
                </Stack>

                <Stack
                    direction="row"    
                    className={styles.actions}                    
                >
                    <NonBackgroundButton
                        text={t("clear")}
                        handleClick={() => {
                            setDateValuesObject({
                                day: "",
                                month: null,
                                year: "",
                                validYear: ""
                            });
                            setError(false);
                        }}
                        varColor="--light-theme-color"
                    />

                    <span
                        className={!validateYear(dateValuesObject.year) ? styles.visible : undefined}
                    >
                        {minYear} - {maxYear}
                    </span>
                </Stack>
            </Stack>

            <p 
                className={error ? styles.visible : undefined} 
            >
                {t("searchDateError")}
            </p>
        </Stack>
    );
}

export default DateInput;
