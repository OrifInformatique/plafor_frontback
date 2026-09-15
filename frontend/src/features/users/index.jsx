import React, { useEffect, useState, useMemo } from 'react';
import  { useTranslation } from 'react-i18next'
import useAuthStore from '../auth/authStore';

import {deleteUserLocal, hardDeleteUserLocal, deleteUserDistant, hardDeleteUserDistant, restoreUser, getUsers, getUserWithDeleted} from './api/api';
import { Button, PopUp, List } from '@orif-informatique/react-components-library';
import UserForm from './userForm';

function UserList() {

    const { t } = useTranslation('users');
    const [users, setUser] = useState([]);
    const token = useAuthStore(state => state.accessToken);
    const user = useAuthStore(state => state.user);
    const [showDeleted, setShowDeleted] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const usersPermissions = user?.permissions || [];
    const usersAppRoles = user?.appSpecificRoles || [];

        const fetchUsers = async () => {
                try {
                    // console.log(showDeleted)
                    const response = showDeleted 
                    ? await getUserWithDeleted()
                    : await getUsers();
                    
                    setUser(response);
                } catch (error) {
                    console.error('Error fetching users:', error);
                    setUser([]);
                }
            };

        useEffect(() => {
            fetchUsers();
        }, [showDeleted]);

        const actions = useMemo(() => ({
            edit: { permission: "user:update", onClick: (user) => { setSelectedUser(user), setFormOpen(true)}},
            delete: { permission: "user:delete", onClick: (user) => { deleteUserLocal(user.login).then(() => deleteUserDistant(user.login).then(() => fetchUsers()).catch((err) => console.error("Delete failed:", err)))}},
            hardDelete: { permission: "user:delete", onClick: (user) => hardDeleteUserLocal(user.login).then(() => hardDeleteUserDistant(user.login).then(() => fetchUsers())).catch((err) => console.error("Hard delete failed:", err)) },
            viewDeleted: { permission: "user:read"},
            restore: { permission: "user:update", onClick: (user) => restoreUser(user.login).then(() => fetchUsers()).catch((err) => console.error("Restore failed:", err)) }
        }), [showDeleted]);


        const allowedAction = useMemo(() => 
            Object.entries(actions)
            .filter(([actionKey, action]) => usersPermissions.includes(action.permission))
            .reduce((acc, [actionKey, action]) => {
                acc[actionKey] = action;
                console.log(`Action "${actionKey}" is allowed for user with permissions:`, usersPermissions);
                return acc;
            }, {})
        , [user, actions]);

        return (
            <div>
                {formOpen ? (
                <PopUp
                    onClose={() => setFormOpen(false)}
                    title={selectedUser ? "Edit User" : "Create User"}
                    children={<UserForm user={selectedUser} onClose={() => setFormOpen(false)} />}
                />
                ) : null}
                {user?.permissions?.includes("user:write") && (
                    <Button label="Create User" variant="primary" className="mb-4" onClick={() => { setSelectedUser(null); setFormOpen(true); }} />
                )}

                <List
                    items={users}
                    actions={allowedAction}
                    actionsLabel="Actions"
                    columns={['id', 'firstName', 'lastName', 'login', 'mainRole', 'appSpecificRoles']}
                    columnsLabels={{
                        id: '#',
                        firstName: t("firstName", "First Name"),
                        lastName: t("lastName", "Last Name"),
                        login: t("login", "login"),
                        mainRole: t("mainRole", "Main Role"),
                        appSpecificRoles: t("appSpecificRoles", "App Specific Roles")
                    }}

                    onToggleShowDeleted={setShowDeleted}

                    showDeleted={showDeleted}

                    noItemsLabel={t("no_user_found", "No user found")}
                    confirmHardDeleteText={t("confirm_hard_delete", "Confirm Permanent Deletion")}
                    confirmHardDeleteTitle={t("confirm_hard_delete_text", "Are you sure you want to permanently delete this user ? This action cannot be undone.")}

                    isDeletedKey='deleted'
                />
            </div>
        );
    }

export default UserList;