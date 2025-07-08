import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./SortableItem.module.css";
import useWindowSize from "../../hooks/useWindowSize";
import ClickableIcon from "../form/buttons/ClickableIcon";

function SortableItem({ id, className, children, extraStyles }) {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({ id });

    const { width } = useWindowSize();

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div
            ref={setNodeRef}
            style={{ 
                ...style, 
                ...extraStyles,
                width: (width <= 440 ? "100%" : "max-content"), 
                maxWidth: (width <= 440 ? "unset" : "50%")
            }}
            className={`${styles.sortable_item} ${className}`}
        >
            {children}

            <span
                ref={setActivatorNodeRef}
                {...attributes}
                {...listeners}
                title="Arrastar"
            >
                <ClickableIcon
                    iconSrc="/images/icons/drag.png"
                    name="Arrastar"
                />
            </span>
        </div>
    );
}

export default SortableItem;
