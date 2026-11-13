import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, InputText, Textarea,  } from '@orif-informatique/react-components-library';

import { createItem, modifyItem } from "./api/api";

const ItemForm = ({ item, onClose }) => {
    const { t } = useTranslation('items');

    const [name, setName] = useState(item ? item.name : "");
    const [description, setDescription] = useState(item ? item.description : "");

    return (
        <>
            <InputText id="item-name" name="name" label={t("item_name", "Item Name")} value={name} onChangeFunction={(e) => setName(e.target.value)} />
            <Textarea id="item-description" name="description" label={t("item_description", "Item Description")} value={description} onChangeFunction={(e) => setDescription(e.target.value)} />
            <div className="flex justify-end mt-4">
                <Button label={t("cancel", "Cancel")} variant="secondary" className="mr-2" onClick={() => {onClose()}} />
                <Button label={item ? t("save", "Save") : t("create", "Create")} variant="primary" onClick={() => { item ? modifyItem(item.id, { name, description }).then(() => onClose()).catch((err) => console.error("Modify failed:", err)) : createItem({ name, description }).then(() => onClose()).catch((err) => console.error("Create failed:", err)) }} />
            </div>
        </>
    );
}

export default ItemForm;