import { getNextOrder } from "./generateOrder";

export default function duplicateObjectInObjectList(item, list, listName, listMaxLength, lengthError, notify, objectOrderKey, setObject) {
    if (list.length >= listMaxLength) {
        notify(lengthError, "error");

        return;
    }

    const nextID = getNextOrder(list, "ID");

    setObject(prevObject => ({
        ...prevObject,
        [listName]: [
            ...prevObject[listName],
            {
                ...item,
                [objectOrderKey]: list.length + 1, 
                ID: nextID
            }
        ]
    }))
}
