import { forwardRef } from "react";
import styles from "./Stack.module.css";

const Stack = forwardRef(({
    children, 
    gap = "1em", 
    direction = "column", 
    alignItems = "center", 
    justifyContent = "space-between", 
    className, 
    extraStyles = {} 
}, ref) => {
    return (
        <div
            ref={ref}
            className={`${styles.stack} ${className || undefined}`}
            style={{ ...extraStyles, gap, alignItems, justifyContent, flexDirection: direction }}
        >
            {children}
        </div>
    );
});

export default Stack;