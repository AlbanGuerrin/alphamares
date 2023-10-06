import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import UserRow from './UserRow';
import { isEmpty } from '../../../utils/Utils';


function UserTable() {
  const [users, setUsers] = useState([]);

  async function getUsers() {
    await axios.get(`${process.env.REACT_APP_API_URL}api/user/`)
      .then((res) => {
        if (JSON.stringify(users) !== JSON.stringify(res.data)) {
          setUsers(res.data);
        }
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <div>
      <Paper >
        <Table sx={{ minWidth: 650 }} size='small' aria-label="user table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell><AdminPanelSettingsIcon /></TableCell>
              <TableCell>Nom</TableCell>
              <TableCell align="right">Prénom</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Téléphone</TableCell>
              <TableCell align="right">Bloqué</TableCell>
              <TableCell align="right">Vérifié</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isEmpty(users) &&
              users.map((user) => (
                <UserRow key={user.email} user={user} fetchUsers={getUsers}/>
              ))}
          </TableBody>
        </Table>
      </Paper>
      <br />
    </div>
  )

}

export default UserTable;