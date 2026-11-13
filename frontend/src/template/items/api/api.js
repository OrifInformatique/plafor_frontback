import api from "../../auth/apiClient";

/**
 * Gets items filtered by soft-delete state.
 *
 * @param {'active'|'deleted'|'all'} state which subset to fetch (default 'active')
 * @returns {Array}
 */
export const getItems = async (state = 'active') =>
{
    try
    {
        const response = await api.get(`/items`, { params: { state } });
        return response.data;
    }
    catch(error)
    {
        console.error(`Error while fetching data: ${error.message}`);
        return [];
    }
};
export const modifyItem = async (id, data) =>
{
    try
    {
        const response = await api.put(`/items/${id}`, data);
        return response.data;
    }
    catch(error)
    {
        console.error(`Error while modifying item: ${error.message}`);
        return null;
    }
};
export const deleteItem = async (id) =>
{
    try
    {
        const response = await api.delete(`/items/${id}`);
        return response.data;
    }
    catch(error)
    {
        console.error(`Error while deleting item: ${error.message}`);
        return null;
    }
};
export const restoreItem = async (id) =>
{
    try
    {
        const response = await api.put(`/items/${id}/restore`);
        return response.data;
    }
    catch(error)
    {
        console.error(`Error while restoring item: ${error.message}`);
        return null;
    }
};
export const hardDeleteItem = async (id) =>
{
    try
    {
        const response = await api.delete(`/items/${id}`, {
            params: { softDelete: false },
        });
        return response.data;
    }
    catch(error)
    {
        console.error(`Error while hard deleting item: ${error.message}`);
        return null;
    }
};

export const createItem = async (data) =>
{
    try {
        const response = await api.post(`/items/`, data);
        return response.data;
    }
    catch(error)
    {
        console.error(`Error while creating item: ${error.message}`);
        return null;
    }
};