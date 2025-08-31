import Stack from "../../containers/Stack";
import styles from "./SpecialtyCard.module.css";
import useWindowSize from "../../../hooks/useWindowSize";

function SpecialtyCard({
    name,
    icon,
    isSelected,
    isMain,
    handleSelect
}) {
    const { width } = useWindowSize();

    return (
        <div
            onClick={handleSelect || undefined}
            className={`${styles.specialty_card} ${isSelected ? styles.selected : undefined} ${isMain ? styles.main : undefined}`}
        >
            <Stack
                className={styles.specialty_info}
                direction={width <= 940 ? "column" : "row"}
                gap="0"
            >
                <Stack
                    className={styles.specialty_icon}
                    justifyContent="center"
                    extraStyles={{ width: width <= 940 ? "100%" : "max-content" }}
                >
                    <img 
                        src={`/${icon}`} 
                        alt="" 
                    />
                </Stack>

                <span
                    style={{ textAlign: width <= 940 ? "center" : "right" }}
                >
                    {name}
                </span>
            </Stack>
        </div>
    );
}

export default SpecialtyCard;