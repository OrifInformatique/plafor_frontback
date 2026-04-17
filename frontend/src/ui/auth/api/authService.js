import axios from 'axios';
import useAuthStore from '../../../../authStore';

export const useLogin = () => {
    const accessToken = useAuthStore((state) => state.accessToken);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);

    const login = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const identifier = formData.get('identifier');
        const password = formData.get('password');
        try {
            const response = await axios.post('/auth/login', {
                login: identifier,
                password: password,
            });
            setAccessToken(response.data.token);
            console.log('Loged in');
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
        }
    };

    return { login };
};

export default useAuthStore;
