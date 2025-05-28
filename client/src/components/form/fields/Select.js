import { useState, useRef, useEffect, useCallback } from "react";
import Stack from "../../containers/Stack";
import styles from "./Select.module.css";

function Select({ name, placeholder, labelText, value = "", handleChange, icon, options = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(value);
    const selectRef = useRef(null);

    const handleOnOptionClick = useCallback((option) => {
        setSelected(option);
        
        handleChange({ target: { name, value: option } });
    }, [handleChange, name]);

    const handleOnClickOutside = (e) => {
        if (selectRef.current && !selectRef.current.contains(e.target)) setIsOpen(false);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOnClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleOnClickOutside);
        };
    }, []);

    return (
        <div
            ref={selectRef}
            className={styles.select_container} 
        >
            <Stack 
                className={styles.select_container} 
                gap="0.2em"
                alignItems="start"
            >
                <label htmlFor={name}>
                    {icon && 
                        <img 
                            src={icon} 
                            alt={`${labelText} Icon`}
                        />
                    }

                    <p>
                        {labelText}
                    </p>
                </label>

                <div 
                    onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)}
                    className={styles.select}
                >
                    {selected || placeholder}
                    
                    {isOpen && (
                        <ul >
                            {options.map(option => (
                                <li 
                                    key={option} 
                                    className={option === selected ? styles.active : undefined} 
                                    onClick={() => handleOnOptionClick(option)}
                                >
                                    {option}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Stack>
        </div>
    );
}

export default Select;
