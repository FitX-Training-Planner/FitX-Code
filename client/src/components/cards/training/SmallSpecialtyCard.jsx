import Stack from "../../containers/Stack";
import styles from "./SpecialtyCard.module.css";
import useWindowSize from "../../../hooks/useWindowSize";

function SmallSpecialtyCard({
    name,
    icon,
    handleClick
}) {
    const { width } = useWindowSize();

    return (
        <div
            onClick={handleClick || undefined}
        >
            <Stack 
                direction={width <= 840 ? "column" : "row"}
                className={styles.small_specialty_card}
            >
                <img
                    src={`/${icon}`}
                    alt=""
                />

                <span
                    style={{ textAlign: width <= 840 ? "center" : "end" }}
                >
                    {name}
                </span>
            </Stack>
        </div>
    );
}

export default SmallSpecialtyCard;