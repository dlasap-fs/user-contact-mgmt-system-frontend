import { useState, useEffect } from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton,CircularProgress } from "@mui/material";
import { helper } from "../utils/helper";
import { EditModal } from "./EditModal";
import DeleteDialog from "./DeleteDialog";

const { REACT_APP_DATABASE_URL = "http://localhost" } = process.env

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
  
  const data_rows = [
    createData('1','Dominic', 'Lasap', { 
        billing_address : "CEBU",
        physical_address: "PH"
    }, new Date().toLocaleString(), 3287263),
    createData('2','123', 'test', { 
        billing_address : "CEBU",
        physical_address: "PH"
    }, new Date().toLocaleString()),
  ];


export const CMSGrid = () =>{

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [rows, setRows] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [{showEdit, showDelete, edit_data, delete_data}, setShowModal] = useState({
        showEdit : false,
        showDelete: false,
        edit_data : {},
        delete_data : {}
    })
    const [{confirm_delete, confirm_edit}, setConfirmModify] = useState({
        confirm_delete: false,
        confirm_edit: false
    })

    
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

 
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };

      const handleEditButton = (data)=>{
        setShowModal((prev)=> {
             return {
            ...prev,
            showEdit: true,
            edit_data : data
        }})
      }

      const handleDeleteButton = (data)=>{
        setShowModal((prev)=> {
            return {
           ...prev,
           showDelete: true,
           delete_data: data
       }})
      }

      const handleConfirmDelete = async (id, handleClose, handleLoading) =>{
        setConfirmModify((prev)=>{
            return {
                ...prev,
                confirm_delete: true
            }
        })
        handleLoading(true)
        helper.APICALL.DELETE(`${REACT_APP_DATABASE_URL}/record/${id}`).then(
            ()=>{
                setConfirmModify((prev)=>{
                    return {
                        ...prev,
                        confirm_delete: false
                    }
                })
                handleLoading(false)
                handleClose()
                setRows((prev)=>{
                    return prev.filter((data)=> data.id !== id)
                })
            }
        ).catch((error)=> {
            console.log(error)
            setConfirmModify((prev)=>{
                return {
                    ...prev,
                    confirm_delete: false
                }
            })
            handleLoading(false)
            handleClose()
        })
      }
      
    const generateActions = (row) =>{
        return (
            <div>
            <IconButton color="primary" onClick={()=>handleEditButton(row)}>
                <EditIcon/>
            </IconButton>
            <IconButton color="error" onClick={()=>handleDeleteButton(row)}>
                <DeleteIcon/>
            </IconButton>
            </div>
        )
      }

      useEffect(()=>{
        helper.APICALL.GET(`${REACT_APP_DATABASE_URL}/records`).then(({data})=>{
            const new_format_data = data.map(({_id,first_name, last_name, delivery_address, created_date})=> {
                return {
                    id:_id,
                    first_name,
                    last_name,
                    created_date,
                    billing_address: delivery_address.billing_address,
                    physical_address: delivery_address.physical_address
                }
            })
            setLoaded(true)
            setRows(new_format_data)
        }).catch((error)=> {
            console.log(error)
            setLoaded(true)
        })
      }, [])

    return (
        <Paper sx={{ width: '70%', margin: "auto" }}>
        <TableContainer sx={{ maxHeight: 700 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={1}>
                  Name
                </TableCell>
                <TableCell align="center" colSpan={4}>
                  Delivery Address
                </TableCell>
                <TableCell align="center" colSpan={1}/>
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

            { !loaded && <CircularProgress style={{top: "33%", left:"50%", position: "absolute", }}/>
            }
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell id={rows.id} key={column.id} align={column.align}>
                            {column.id === "actions" && rows.length ? 
                                generateActions(row)
                             : column.id === "created_date" ? new Date(value).toLocaleString() : value }

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

        {showEdit && <EditModal {...{
            title : "Edit Record",
            toggle: showEdit,
            setShowModal,
            setConfirmModify,
            data: edit_data
        }}/>}
        {showDelete && <DeleteDialog {...{
            toggle: showDelete,
            title: "Delete Record",
            message: `Are you sure you want to delete`,
            data: delete_data,
            setShowModal,
            handleConfirmDelete,
        }}>
            {confirm_delete && <CircularProgress size={20} style={{margin: "auto"}}/>}
            </DeleteDialog>}
      </Paper>
   
    )
}