import React from "react";
import styles from "./CodeInput.module.css";

const CodeInput = React.forwardRef(({ name, value = "", handleChange, handleFocus, handleKeyDown }, ref) => {
    return (
        <input
            type="text"
            name={name}
            id={name}
            value={value}
            className={styles.code}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            ref={ref}
        />
    );
})

export default CodeInput;