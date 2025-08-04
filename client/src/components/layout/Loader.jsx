import Stack from "../containers/Stack";
import styles from "./Loader.module.css";

function Loader() {
    return (
        <Stack
            className={styles.loader_container}
            justifyContent="center"
        >
            <div 
                className={styles.loader}
            >
            </div>
        </Stack>
    )
}

export default Loader;