import React, {useState} from 'react';
import useAuthStore from '../../../features/auth/authStore';
import { PopUp } from '@orif-informatique/react-components-library';
import usersMe from '../../../features/auth/ui/api/usersMe';

const LoginTestIndicator = () => {
    const [apiResult, setApiResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const accessToken = useAuthStore((s) => s.accessToken);
    const loggedIn = !!accessToken;
    const [open, setOpen] = useState(false);

    const dotClass = loggedIn
        ? 'w-2.5 h-2.5 rounded-full bg-green-500'
        : 'w-2.5 h-2.5 rounded-full bg-red-500';

    const callApiHandler = async () => {
    
        try {
            const data = await usersMe();
            console.log('API response data:', data);
            setApiResult(data);
            setErrorMessage('');
        } catch (error) {
            console.log(error);
            const apiError = error?.response?.data || error?.message || 'Unknown error';
            setErrorMessage(typeof apiError === 'string' ? apiError : JSON.stringify(apiError));
            setApiResult(null);
        }
        setOpen(true);
    };

    return (
        <span
            role="status"
            aria-live="polite"
            aria-label={loggedIn ? 'Logged in' : 'Not logged in'}
            title={loggedIn ? 'Logged in' : 'Not logged in'}
            className="inline-flex items-center"
        >
            <span
                className={dotClass}
                aria-hidden="true"
                onClick={() => callApiHandler() }
            />
            <span className="text-xs ml-1">
                {loggedIn ? 'Logged in' : 'Not logged in'}
            </span>
            {open && (
                <PopUp title="Test" onClose={() => setOpen(false)}>
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                        {!errorMessage && apiResult && (
                            <>
                                <p>{accessToken}</p>
                                <p>{apiResult.firstName}</p>
                                <p>{apiResult.lastName}</p>
                                <p>{apiResult.login}</p>
                                <p>{apiResult.role}</p>
                            </>
                        )}
                </PopUp>
            )}
        </span>
    );
};

export default LoginTestIndicator;
