import { useEffect, useMemo, useState } from "react";
import Stack from "../../containers/Stack";
import styles from "./FilterItemsById.module.css";

function FilterItemsById({ 
    items = [], 
    orderKey, 
    setShowedItems 
}) {
    const [selectedOrder, setSelectedOrder] = useState("1");

    const uniqueOrders = useMemo(() => {
        return [...new Set(items.map(item => String(item[orderKey])))].sort((a, b) => a - b)
    }, [items, orderKey]);

    useEffect(() => {
        setShowedItems(items.filter(item => String(item[orderKey]) === "1"));
    }, [items, orderKey, setShowedItems]);

    return (
        <Stack
            gap="0"
            justifyContent="center"
            className={styles.filter_items_container}
        >
            <ul>
                {uniqueOrders.map(order => (
                    <li
                        key={order}
                        className={selectedOrder === order ? styles.selected : undefined}
                        onClick={() => {
                            setShowedItems(items.filter(item => String(item[orderKey]) === order));
                            setSelectedOrder(order);
                        }}
                    >
                        {order}
                    </li>
                ))}
            </ul>
        </Stack>
    );
}

export default FilterItemsById;
