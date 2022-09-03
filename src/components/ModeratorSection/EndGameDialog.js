import React, {useEffect, useState} from 'react';
import {
    Button, Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table, TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@mui/material";
import {apiWithHeader} from "../../util/helperutils";
import {useNavigate} from "react-router-dom";

function EndGameDialog({ open, handleClose }) {
    const [rows, setRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const api = apiWithHeader(navigate)

        if (api === null) {
            return
        }

        api.get('/list-humans')
            .then((res) => {
                setRows(res.data)
            })
            .catch((error) => {
                console.log(error);
            });

    }, [])

    const handleCheckboxClick = (event, id) => {
        if (event.target.checked) {
            setSelectedRows([...selectedRows, id]);
        } else {
            setSelectedRows(selectedRows.filter((selectedId) => selectedId !== id));
        }
    };

    const handleOnConfirmClick = () => {
        console.log('Selected Rows:', selectedRows);

        const api = apiWithHeader(navigate)
        if (api === null) {
            return
        }
        api.post('/end-game', {'ids': selectedRows})
            .then((res) => {
                console.log(res.data)
                handleClose();
            })
            .catch((error) => {
                console.log(error);
                handleClose();
            });

    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Warning</DialogTitle>
            <DialogContent>
                <p>Ending a game cannot be undone. Are you sure you want to end the game?</p>
                <div>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedRows.length === rows.length}
                                        indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
                                        onChange={(event) => {
                                            if (event.target.checked) {
                                                setSelectedRows(rows.map(row => row.id));
                                            } else {
                                                setSelectedRows([]);
                                            }
                                        }}
                                        inputProps={{ 'aria-label': 'select all' }}
                                    />
                                </TableCell>
                                <TableCell>Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedRows.includes(row.id)}
                                            onChange={(event) => handleCheckboxClick(event, row.id)}
                                            // checkedIcon={<span style={{color: "green"}}>✓</span>}
                                            inputProps={{ 'aria-label': row.name }}
                                        />
                                    </TableCell>
                                    <TableCell>{row.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" onClick={handleOnConfirmClick}>Confirm</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EndGameDialog;
