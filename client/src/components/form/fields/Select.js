import { useState, useRef, useEffect, useCallback } from "react";
import Stack from "../../containers/Stack";
import styles from "./Select.module.css";
import SearchInput from "./SearchInput";
import { useTranslation } from "react-i18next";

function Select({
    name,
    placeholder,
    labelText,
    value = "",
    handleChange,
    icon,
    options = []
}) {
    const { t } = useTranslation();
    
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(value);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [showedOptions, setShowedOptions] = useState(options);
    
    useEffect(() => {
        setIsDarkTheme(document.documentElement.getAttribute("data-theme") === "dark");
    }, []);

    const selectRef = useRef(null);

    useEffect(() => {
        setSelected(value);
    }, [value]);

    const handleOnOptionClick = useCallback((option) => {
        setSelected(option);

        setIsOpen(false);

        setSearchText("");
        
        handleChange({ target: { name, value: option } });
    }, [handleChange, name]);

    const handleOnClickOutside = useCallback((e) => {
        if (selectRef.current && !selectRef.current.contains(e.target)) {
            setIsOpen(false);

            setSearchText("");
        }
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleOnClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleOnClickOutside);
        };
    }, [handleOnClickOutside]);

    return (
        <div
            ref={selectRef}
            className={styles.select_container} 
        >
            <Stack 
                className={`${styles.select_container} ${isDarkTheme ? styles.dark_theme : undefined}`} 
                gap="0.2em"
                alignItems="start"
            >
                <label htmlFor={name}>
                    {icon && 
                        <img 
                            src={icon} 
                            alt=""
                        />
                    }

                    <p>
                        {labelText}
                    </p>
                </label>

                <div 
                    className={styles.select}
                >
                    <div
                        onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)}
                    >
                        {selected || placeholder}
                    </div>
                    
                    {isOpen && (
                        <>
                            <SearchInput
                                searchText={searchText}
                                setSearchText={setSearchText}
                                items={options}
                                setShowedItems={setShowedOptions}
                                className={styles.select_search}
                            />

                            <ul>
                                <li
                                    key="_none"
                                    onClick={() => handleOnOptionClick("")}
                                >
                                    -
                                </li>
                                
                                {
                                    options.length !== 0 ? (
                                        showedOptions !== 0 ? (
                                            showedOptions.map(option => (
                                                <li 
                                                    key={option} 
                                                    className={option === selected ? styles.active : undefined} 
                                                    onClick={() => handleOnOptionClick(option)}
                                                >
                                                    {option}
                                                </li>
                                            ))
                                        ) : (
                                            <li
                                                key="_empty"
                                            >
                                                {t("noResult")}
                                            </li>
                                        )

                                    ) : (
                                        <li
                                            key="_loading"
                                        >
                                            {t("loading")}...
                                        </li>
                                    )
                                }
                            </ul>
                        </>
                    )}
                </div>
            </Stack>
        </div>
    );
}

export default Select;
