import api from './apiClient';

/**
 * Call protected API to get current user information.
 * @returns {Promise<any>} response data from the server
 */
export default async function usersMe() {
    const resp = await api.get('/users/me');
    return resp.data;
}
