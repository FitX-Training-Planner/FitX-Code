import styles from "./Stack.module.css";

function Stack({ children, gap = "1em", direction = "column", className }) {
    return (
        <div
            className={`${styles.stack} ${styles[direction]} ${className || undefined}`}
            style={{ gap }}
        >
            {children}
        </div>
    );
}

export default Stack;