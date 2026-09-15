import React, { useState } from 'react';

import { Button,
         PopUp
       } from "@orif-informatique/react-components-library";
import useAuthStore from './authStore';
import callApi from './ui/api/usersMe';

const ApiAuthCall = () => {
    const accessToken = useAuthStore((state) => state.accessToken);
    const [open, setOpen] = useState(false);
    const [apiResult, setApiResult] = useState(null);

    const callApiHandler = async () => {
        try {
            // callApi will read the access token from the auth store if none is provided
            const data = await callApi();
            console.log('API response data:', data);
            setApiResult(data);
        } catch (error) {
            console.log(error);
            setApiResult(null);
        }
        setOpen(true);
    };

    return (
        <div>
            <Button
                variant="primary"
                label="Test API Call"
                onClick={() => callApiHandler()}
            />
            {open && (
                <PopUp title="Test" onClose={() => setOpen(false)}>
                        <p>{accessToken}</p>
                        <p>{apiResult.firstName}</p>
                        <p>{apiResult.lastName}</p>
                        <p>{apiResult.login}</p>
                        <p>{apiResult.role}</p>
                        <p>{apiResult.token}</p>
                </PopUp>
            )}
        </div>
    );
};

export default ApiAuthCall;
