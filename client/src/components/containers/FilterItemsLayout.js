import Stack from "./Stack";
import styles from "./FilterItemsLayout.module.css";
import NonBackgroundButton from "../form/buttons/NonBackgroundButton";
import React from "react";

export function FilterItemsLayout({ filters, activeFilter, setActiveFilter, handleChange, children }) {
    return (
        <Stack
            gap="3em"
        >
            <Stack
                direction="row"
                gap="2em"
                className={styles.filters}
            >
                {filters.map((filter, index) => (
                    <React.Fragment
                        key={index}
                    >
                        <NonBackgroundButton
                            text={filter.text}
                            handleClick={() => {
                                if (!(filter.value === activeFilter.value)) {
                                    setActiveFilter(filter);
                                    handleChange(filter.value);
                                }
                            }}
                            varColor={filter.value === activeFilter.value ? "--theme-color" : "--text-color"}
                            className={styles.filter}
                        />
                    </React.Fragment>
                ))}
            </Stack>

            <Stack>
                {children}
            </Stack>
        </Stack>
    );
}

export default FilterItemsLayout;