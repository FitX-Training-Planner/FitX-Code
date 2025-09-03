import { useSelector } from "react-redux";
import Stack from "../../containers/Stack";
import styles from "./SelectBoxes.module.css"

function SelectBoxes({ 
    options,
    setOptions,
    isMultipleSelects,
    direction,
    labelText,
    icon
}) {
    const user = useSelector(state => state.user);

    return (
        <Stack
            className={`${styles.select_boxes_container} ${user.config.isDarkTheme ? styles.dark_theme : undefined}`}
            alignItems="start"
        >
            {labelText && (
                <span>
                    {icon && (
                        <img 
                        src={icon} 
                        alt="" 
                        />
                    )}
                    
                    {labelText && (
                        <p>
                            {labelText}
                        </p>
                    )}
                </span>
            )}

            <Stack
                direction={direction}
                gap="0.5em"
                alignItems="start"
                className={styles.select_boxes}
            >
                {options.map((option, index) => (
                    <div
                        key={index}
                        onClick={() => setOptions(prevOptions => (
                            isMultipleSelects 
                            ? prevOptions.map(op => op.ID === option.ID ? { ...op, isSelected: !op.isSelected } : op)
                            : prevOptions.map(op => op.ID === option.ID ? { ...op, isSelected: true } : { ...op, isSelected: false })
                        ))}
                    >
                        <span
                            className={option.isSelected ? styles.accepted : undefined}
                        ></span>

                        <p>
                            {option.name}
                        </p>
                    </div>
                ))}
            </Stack>
        </Stack>
    );
}

export default SelectBoxes;