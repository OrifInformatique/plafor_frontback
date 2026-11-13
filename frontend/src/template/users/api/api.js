import api from "../../auth/apiClient";

/**
 * Gets users filtered by soft-delete state.
 *
 * @param {'active'|'deleted'|'all'} state which subset to fetch (default 'active')
 */
export const getUsers = async (state = 'active') => {
    try {
        const response = await api.get(`/users`, { params: { state } });
        return response.data;
    }
    catch(error) {
        console.error(`Error while fetching users: ${error.message}`);
        return [];
    }
};
export const deleteUserLocal = async (userLogin) => {
    console.log("userID :" + userLogin);
    try {
        const response = await api.delete(`/users/${userLogin}?global=false&hard=false`);
        return response.data;
    }
    catch(error) {
        console.error(`Error while deleting user: ${error.message}`);
        return null;
    }
};

export const getRoles = async (scope = 'local') => {
    try {
        const response = await api.get(`/roles`, { params: { scope } });
        return response.data;
    }
    catch(error) {
        console.error(`Error while fetching roles: ${error.message}`);
        return [];
    };
}

export const deleteUserDistant = async (userLogin) => {
    console.log("userID :" + userLogin);
    try {
        const response = await api.delete(`/users/${userLogin}?global=true&hard=false`);
        return response.data;
    }
    catch(error) {
        console.error(`Error while deleting user: ${error.message}`);
        return null;
    }
};

export const hardDeleteUserLocal = async (userLogin) => {
    console.log("userID :" + userLogin);
    try {
        const response = await api.delete(`/users/${userLogin}?global=false&hard=true`);
        return response.data;
    }
    catch(error) {
        console.error(`Error while hard deleting user: ${error.message}`);
        return null;
    }
};

export const hardDeleteUserDistant = async (id) => {
    try {
        console.log("userID :" + id);
        const response = await api.delete(`/users/${id}/true/permanent`);
        return response.data;
    }
    catch(error) {
        console.error(`Error while hard deleting user: ${error.message}`);
        return null;
    }
};

export const createUser = async (data) => {
    try {
        const response = await api.post(`/auth/register`, data);
        return response.data;
    }
    catch(error) {
        console.error(`Error while creating user: ${error.message}`);
        throw error;
    }
};

export const updateUser = async (userLogin, data) => {
    try {
        const response = await api.put(`/users/${encodeURIComponent(userLogin)}`, data);
        return response.data;
    }
    catch(error) {
        console.error(`Error while updating user: ${error.message}`);
        throw error;
    }
};

export const restoreUser = async (userLogin) => {
    try {
        const response = await api.put(`/users/${userLogin}/restore`);
        return response.data;
    }
    catch(error) {
        console.error(`Error while restoring user: ${error.message}`);
        return null;
    }
};