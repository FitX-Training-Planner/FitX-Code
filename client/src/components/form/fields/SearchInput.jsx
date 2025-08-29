import { useEffect } from 'react';
import ClickableIcon from '../buttons/ClickableIcon';
import Stack from '../../containers/Stack';
import { formattNameAndNote } from '../../../utils/formatters/training/formatOnChange';
import styles from "./SearchInput.module.css";
import { textFilter } from '../../../utils/filters/search';
import { useTranslation } from 'react-i18next';

export default function SearchInput({
    searchText,
    setSearchText,
    items,
    setShowedItems,
    searchKey,
    placeholder,
    name,
    handleSubmit,
    className
}) {
    const { t } = useTranslation();

    const Tag = handleSubmit ? "form" : "div";

    useEffect(() => {
        if (!handleSubmit) {
            let filtered = [];
    
            if (!searchKey) {
                filtered = textFilter(searchText, items);
            } else {
                filtered = items.filter(item => String(item[searchKey]).toLowerCase().includes(String(searchText).toLowerCase()));
            }
    
            setShowedItems(filtered);
        }
    }, [searchText, items, searchKey, setShowedItems, handleSubmit]);

    return (
        <Tag
            onSubmit={handleSubmit || undefined}
            className={`${className || undefined} ${styles.search_input}`}
        >
            <Stack
                direction="row"
                className={styles.search_input}
            >
                <ClickableIcon
                    iconSrc="/images/icons/search.png"
                    name={name || t("search")}
                    size="small"
                    isSubmit={!!handleSubmit}
                />

                <input
                    type="text"
                    id={name || "search"}
                    name={name || "search"}
                    placeholder={placeholder || `${t("search")}...`}
                    value={searchText}
                    onChange={(e) => setSearchText(formattNameAndNote(e.target.value))}
                    onKeyDown={(e) => {
                        if (handleSubmit && e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                />
            </Stack>
        </Tag>
    );
}
