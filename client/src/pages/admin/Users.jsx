import React from 'react'
import UserTable from '../../components/Admin/Users/UserTable';

const Users = ()=> {
    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <br />
            <div style={{textAlign : 'center'}}>
                <h1>Administration des utilisateurs.</h1>
            </div>
            <br />
            < UserTable />
        </div>
    );
};

export default Users;