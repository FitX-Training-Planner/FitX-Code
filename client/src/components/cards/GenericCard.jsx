import { useSelector } from "react-redux";

function GenericCard({
    children, 
    className, 
    border = "1px solid var(--text-color)",
    borderRadius = "15px",
    boxShadow = "-10px 10px 10px var(--gray-color)",
    backgroundColor = "var(--bg-color)",
    padding = "1em",
    extraStyles
}) {
    const user = useSelector(state => state.user);

    return (
        <div
            className={`${className || undefined}`}
            style={{ 
                border,
                borderRadius,
                boxShadow: user.config.isDarkTheme ? undefined : boxShadow,
                backgroundColor,
                padding,
                width: "100%",
                ...extraStyles
            }}
        >
            {children}
        </div>
    );
}

export default GenericCard;