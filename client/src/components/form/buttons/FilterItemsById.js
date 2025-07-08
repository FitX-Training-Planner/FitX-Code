import { useMemo, useState } from "react";
import Stack from "../../containers/Stack";
import styles from "./FilterItemsById.module.css";

function FilterItemsById({ items = [], orderKey, setShowedItems }) {
    const [selectedOrder, setSelectedOrder] = useState("_all");

    const uniqueOrders = useMemo(() => {
        return [...new Set(items.map(item => item[orderKey]))].sort((a, b) => a - b)
    }, [items, orderKey]);

    return (
        <Stack
            gap="0"
            justifyContent="center"
            className={styles.filter_items_container}
        >
            <ul>
                <li
                    key="_all"
                    className={selectedOrder === "_all" ? styles.selected : undefined}
                    onClick={() => {
                        setShowedItems(items);
                        setSelectedOrder("_all");
                    }}
                >
                    ...
                </li>

                {uniqueOrders.map(order => (
                    <li
                        key={order}
                        className={selectedOrder === order ? styles.selected : undefined}
                        onClick={() => {
                            setShowedItems(items.filter(item => item[orderKey] === order));
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
