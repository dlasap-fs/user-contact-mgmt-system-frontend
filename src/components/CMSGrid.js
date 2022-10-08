import { useState } from "react";
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";


function createData(
    id,
    first_name,
    last_name,
    delivery_address,
    created_date,
  ) {
    const {  billing_address = "", physical_address ="" } = delivery_address
    return { id, first_name, last_name, billing_address, physical_address, created_date };
  }
  
  const rows = [
    createData('1','Dominic', 'Lasap', { 
        billing_address : "CEBU",
        physical_address: "PH"
    }, new Date().toLocaleString(), 3287263),
    createData('2','123', 'test', { 
        billing_address : "CEBU",
        physical_address: "PH"
    }, new Date().toLocaleString()),
  ];

  const columns = [
    { id: 'first_name', label: 'First Name', minWidth: 170 },
    { id: 'last_name', label: 'Last Name', minWidth: 100 },
    {
      id: 'billing_address',
      label: 'Billing Address',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'physical_address',
      label: 'Physical Address',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'created_date',
      label: 'Created Date',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toFixed(2),
    },
    {
        id: 'actions',
        label: 'Actions',
        minWidth: 170,
        align: 'right',
      },
  ];

 

export const CMSGrid = () =>{

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [rowsData, setRowsData] = useState([""])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };

    const handleRows = () =>{

    }

    const generateActions = (data_id) =>{
        return (
            <div>
            <IconButton color="primary" onClick={()=>handleEditButton(data_id, "hello")}>
                <EditIcon/>
            </IconButton>
            <IconButton color="error">
                <DeleteIcon/>
            </IconButton>
            </div>
        )
      }

      const handleEditButton = (id, data)=>{
        alert(`HI ${id} ${data}`)
      }

    return (
        <Paper sx={{ width: '100%' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={2}>
                  Name
                </TableCell>
                <TableCell align="center" colSpan={3}>
                  Delivery Address
                </TableCell>
              </TableRow>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ top: 57, minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "actions" ? 
                                generateActions(row.id)
                             :value }

                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
   
    )
}