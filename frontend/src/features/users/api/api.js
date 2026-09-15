import api from "../../auth/ui/api/apiClient";

export const getUsers = async () => {
    try {
        const response = await api.get(`/users/all`);
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

export const getRoles = async () => {
    try {
        const response = await api.get(`/roles/all`);
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
        return null;
    }
};

export const updateUser = async (id, data) => {
    try {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    }
    catch(error) {
        console.error(`Error while updating user: ${error.message}`);
        return null;
    }
};

export const getUserWithDeleted = async () => {
    try {
        const response = await api.get(`/users?deleted=true`);
        return response.data;
    }
    catch(error) {
        console.error(`Error while fetching users with deleted: ${error.message}`);
        return [];
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