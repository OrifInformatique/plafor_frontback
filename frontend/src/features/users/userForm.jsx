import React, { useState, useEffect } from 'react'
import { Button, InputText, MultiSelect  } from '@orif-informatique/react-components-library';

import { createUser, updateUser, getRoles } from "./api/api";

function UserForm({ user, onClose }) {
const [firstName, setFirstName] = useState(user ? user.firstName : "");
const [lastName, setLastName] = useState(user ? user.lastName : "");
const [login, setLogin] = useState(user ? user.login : "");
const [password, setPassword] = useState("");
const [userRoles, setUserRoles] = useState(user ? user.mainRole : "");
const [roles, setRoles] = useState([]);
const [appSpefRole, setAppSpefRole] = useState([])
const [userAppSpefRole, setUserAppSpefRole] = useState(user ? user.appSpecificRoles : [])
const roleName = []
const userRolesName = []

appSpefRole.map(r => roleName.push(r.name))
userAppSpefRole.map(r => userRolesName.push(r.name))



useEffect(() => {
    const fetchRoles = async () => {
        const rolesData = await getRoles();
        setRoles(rolesData);
        setAppSpefRole(rolesData)
    };

    fetchRoles();
}, [user]);

useEffect(() => {
    if (user) {
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setLogin(user.login || "");
        setPassword(user.password || "");
        setUserRoles(user.mainRole || "");
        setUserAppSpefRole(user.appSpecificRoles || [])

        console.log("USER_APP_SPECIFIC_ROLES : " + user.appSpecificRoles)

        console.log("User data loaded into form:", { firstName, lastName, login, password, userRoles, userAppSpefRole });
    }
}, [user]);

return (
    <>
    
        <InputText id="user-first-name" name="firstName" label="First Name" value={firstName} onChangeFunction={(e) => setFirstName(e.target.value)} />
        <InputText id="user-last-name" name="lastName" label="Last Name" value={lastName} onChangeFunction={(e) => setLastName(e.target.value)} />
        <InputText id="user-login" name="login" label="Login" value={login} onChangeFunction={(e) => setLogin(e.target.value)} />
        <InputText id="user-password" name="password" label="Password" type="password" value={password} onChangeFunction={(e) => setPassword(e.target.value)} />
        {user ? 
        <div>
        <label for="user-roles" className="block text-sm font-medium text-gray-700 mt-4">Main Role</label>
        <select id="user-roles" name="roles" label="Main Role" value={userRoles} onChange={(e) => setUserRoles(e.target.value)} className="w-full p-2 border border-gray-300 rounded">
            {roles.map((role) => (
                <option key={role.id} value={role.name}>{role.name}</option>
            ))}
        </select>
        </div> : null}
    
        <MultiSelect
        name="Role spécifique"
        options={roleName}
        selectedValues={userAppSpefRole}
        defaultValues={userAppSpefRole}
        disabled={false}
        onChangeFunction={setUserAppSpefRole}
        error={null}
        className={null}
        emptyLabel='Aucun sélectionné'
        singleLabel='sélectionné'
        multipleLabel='sélectionnés'
        />



        <div className="flex justify-end mt-4">
            <Button label="Cancel" variant="secondary" className="mr-2" onClick={() => {onClose()}} />
            <Button 
            label={user ? "Save" : "Create"} 
            variant="primary" 
            onClick={() => { user ? updateUser(user.id, {
                    "firstName" : firstName,
                    "lastName" : lastName,
                    "login" : login,
                    "mainRole" : userRoles,
                    "appSpecificRoles" : userAppSpefRole
            }).then(() => onClose()).catch((err) => console.error("Update failed:", err)) :
            createUser({
                "firstName" : firstName,
                "lastName" : lastName,
                "login" : login,
                "password" : password
            }).then(() => onClose()).catch((err) => console.error("Create failed:", err)) }} />
        </div>
    </>

    );
}

export default UserForm;