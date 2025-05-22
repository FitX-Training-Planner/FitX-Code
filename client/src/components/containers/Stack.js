import styles from "./Stack.module.css";

function Stack({ children, gap = "1em", direction = "column", alignItems = "center", className, extraStyles = {} }) {
    return (
        <div
            className={`${styles.stack} ${className || undefined}`}
            style={{ ...extraStyles, gap, alignItems, flexDirection: direction }}
        >
            {children}
        </div>
    );
}

export default Stack;