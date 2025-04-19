import styles from "./Stack.module.css";

function Stack({ children, gap = "1em", direction = "column" }) {
    return (
        <div
            className={`${styles.stack} ${styles[direction]}`}
            style={{ gap }}
        >
            {children}
        </div>
    );
}

export default Stack;