import React, { useState } from 'react';

import { Button,
         PopUp
       } from "@orif-informatique/react-components-library";
import useAuthStore from '../../../authStore';
import axios from 'axios';

const ApiAuthCall = () => {
    const accessToken = useAuthStore((state) => state.accessToken);
    const [open, setOpen] = useState(false);
    const [apiResult, setApiResult] = useState(null);

    const callApi = async () => {
        try {
            const userResponse = await axios.get('/users/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setApiResult(userResponse.data);
        } catch (error) {
            console.log(error);
        }
        setOpen(true);
    };

    return (
        <div>
            <Button
                variant="primary"
                label="Test API Call"
                onClick={() => callApi()}
            />
            {open && (
                <PopUp title="Test" onClose={() => setOpen(false)}>
                    <div className="flex flex-col overflow-scroll">
                        <p>{accessToken}</p>
                        <p>{apiResult.firstName}</p>
                        <p>{apiResult.lastName}</p>
                        <p>{apiResult.login}</p>
                        <p>{apiResult.role}</p>
                        <p>{apiResult.token}</p>
                        {/* <div> */}
                        {/*     <h3 className="font-bold">Permissions:</h3> */}
                        {/*     <ul> */}
                        {/*         {apiResult?.permissions?.map((perm, idx) => ( */}
                        {/*             <li key={idx}>{perm}</li> */}
                        {/*         ))} */}
                        {/*     </ul> */}
                        {/* </div> */}
                    </div>
                </PopUp>
            )}
        </div>
    );
};

export default ApiAuthCall;
