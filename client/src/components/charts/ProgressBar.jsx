import { useEffect, useMemo, useState } from "react";
import styles from "./Charts.module.css";
import Stack from "../containers/Stack";

function ProgressBar({ 
    value, 
    max = 100, 
    valueLabel,
    maxLabel = "Total",
    size = "40px",
    fillColor = "var(--light-theme-color)",
    backgroundColor = "var(--gray-color)",
    orientation = "h"
}) {
    const percent = useMemo(() => {
        return Math.min((value / max) * 100, 100);
    }, [value, max]);

    const [currentPercent, setCurrentPercent] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPercent(percent);
        }, 50);

        return () => clearTimeout(timer);
    }, [percent]);

    return (
        <Stack
            gap="0.2em"
        >
            {orientation === "v" && (
                <span>
                    {maxLabel}
                </span>
            )}

            <Stack 
                className={styles.progress_bar}
                direction={orientation === "h" ? "row" : "column"}
                extraStyles={{
                    height: orientation === "h" ? size : "10em",
                    width: orientation === "h" ? "100%" : size,
                    minHeight: orientation === "h" ? "unset" : "100%",
                    backgroundColor: backgroundColor
                }}
                justifyContent={orientation === "h" ? "start" : "end"}
            >
                <Stack 
                    className={styles.fill}
                    extraStyles={{
                        width: orientation === "h" ? `${currentPercent}%` : "100%",
                        height: orientation === "h" ? "100%" : `${currentPercent}%`,
                        background: fillColor,
                        transition: "all 1s"
                    }}
                    direction="row"
                ></Stack>

                <Stack
                    className={styles.progress_numbers}
                    direction={orientation === "h" ? "row" : "column-reverse"}
                >
                    <strong>
                        {value}
                    </strong>

                    <strong>
                        {max}
                    </strong>
                </Stack>
            </Stack>

            {orientation === "h" ? (
                <Stack
                    direction={orientation === "h" ? "row" : "column-reverse"}
                >
                    <span>
                        {valueLabel}
                    </span>

                    <span>
                        {maxLabel}
                    </span>
                </Stack>
            ) : (
                <span>
                    {valueLabel}
                </span>
            )}
        </Stack>
    );
}
export default ProgressBar;