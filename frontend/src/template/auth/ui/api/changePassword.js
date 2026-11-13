import api from '../../apiClient';

export const changePassword = async (oldPassword, newPassword) => {
    const response = await api.put('/auth/update-password', {
        oldPassword,
        newPassword,
    });
    return response.data;
};
