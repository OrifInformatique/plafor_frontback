import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from '@orif-informatique/react-components-library';

const ItemDetail = ({ item, onClose }) => {
    const { t } = useTranslation('items');

    return (
        <>
            <div className="divide-y divide-gray-200">
                <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 py-4">
                    <span className="text-sm font-medium text-gray-500">{t("id", "ID")}</span>
                    <span className="text-sm text-gray-900">{item.id}</span>

                    <span className="text-sm font-medium text-gray-500">{t("name", "Name")}</span>
                    <span className="text-sm text-gray-900">{item.name}</span>

                    <span className="text-sm font-medium text-gray-500">{t("author", "Author")}</span>
                    <span className="text-sm text-gray-900">{item.author}</span>

                    <span className="text-sm font-medium text-gray-500">{t("description", "Description")}</span>
                    <span className="text-sm text-gray-900 whitespace-pre-wrap">{item.description}</span>
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 py-4">
                    <span className="text-sm font-medium text-gray-500">{t("status", "Status")}</span>
                    <span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isDeleted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {item.isDeleted ? t("deleted", "Deleted") : t("active", "Active")}
                        </span>
                    </span>

                    <span className="text-sm font-medium text-gray-500">{t("created_at", "Created At")}</span>
                    <span className="text-sm text-gray-900">{new Date(item.createdAt).toLocaleString()}</span>

                    <span className="text-sm font-medium text-gray-500">{t("updated_at", "Updated At")}</span>
                    <span className="text-sm text-gray-900">{new Date(item.updatedAt).toLocaleString()}</span>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button label={t("close", "Close")} variant="secondary" onClick={() => {onClose()}} />
            </div>
        </>
    );
}

export default ItemDetail;