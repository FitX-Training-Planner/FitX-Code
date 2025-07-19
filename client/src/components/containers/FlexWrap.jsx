import React, { useMemo } from "react";
import styles from "./FlexWrap.module.css";
import Stack from "./Stack";

function FlexWrap({
    children,
    maxElements = 4, 
    gap = "1em", 
    direction = "column", 
    alignItems = "stretch", 
    justifyContent = "space-between", 
    className, 
    extraStyles = {}, 
    uniformWidth = true 
}) {
    const flexBasis = useMemo(() => {
       return  `calc((100% - (${maxElements - 1} * ${gap})) / ${maxElements})`;
    }, [maxElements, gap]);

    return (
        <Stack
            className={`${styles.flex_wrap} ${className}`}
            direction={direction}
            justifyContent={justifyContent}
            alignItems={alignItems}
            extraStyles={extraStyles}
            gap={gap}
        >
            {React.Children.map(children, (child) => (
                <div 
                    style={{
                        flexBasis,
                        flexGrow: uniformWidth ? 0 : 1,
                        flexShrink: uniformWidth ? 0 : 1,
                        maxWidth: uniformWidth ? flexBasis : "100%"
                    }}
                >
                    {child}
                </div>
            ))}
        </Stack>
    );
}

export default FlexWrap;