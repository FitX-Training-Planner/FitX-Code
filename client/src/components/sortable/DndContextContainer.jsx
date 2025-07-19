import { useCallback } from "react";
import { closestCorners, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToParentElement } from '@dnd-kit/modifiers';
import Stack from "../containers/Stack";
import styles from "./DndContextContainer.module.css";
import useWindowSize from "../../hooks/useWindowSize";

function DndContextContainer({ 
    stackDirection = "row", 
    itemsClassName, 
    items = [], 
    orderPropName, 
    setObjectWithSortables, 
    sortablesPropName, 
    children 
}) {
    const { width } = useWindowSize();
    
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );
    
    const handleDragEnd = useCallback((e) => {
        const { active, over } = e;

        if (!over || active.id === over.id) return;

        const prevIndex = items.findIndex(item => String(item.ID) === String(active.id));
        
        const newIndex = items.findIndex(item => String(item.ID) === String(over.id));

        const newItems = arrayMove(items, prevIndex, newIndex).map((item, index) => ({
            ...item,
            [orderPropName]: index + 1
        }));

        setObjectWithSortables(prevObject => ({
            ...prevObject,
            [sortablesPropName]: newItems
        }));
    }, [items, orderPropName, setObjectWithSortables, sortablesPropName]);

    return (
        !items || items.length === 0
        ? undefined
        : (
            <Stack
                direction={width <= 440 ? "column" : stackDirection}
                className={`
                    ${styles.dnd_context_container} 
                    ${itemsClassName ? itemsClassName : undefined} 
                    ${stackDirection === "column" ? styles.stack_column : undefined}
                `}
                justifyContent="center"
            >    
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToParentElement]}
                >
                    <SortableContext
                        items={items.map(item => String(item.ID))}
                        strategy={width <= 440 || stackDirection === "column" ? verticalListSortingStrategy : horizontalListSortingStrategy}
                    >
                        {children}
                    </SortableContext>
                </DndContext>
            </Stack>
        )
    )
}

export default DndContextContainer;