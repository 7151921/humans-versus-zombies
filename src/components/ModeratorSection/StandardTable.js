import React, {useEffect, useState} from 'react';
import {Table, TableBody, TableCell, TableHead, TablePagination, TableRow} from '@mui/material';
import TableContainer from "@mui/material/TableContainer";
import {ModPanelH1} from "../ReportTag/ReportTagElements";

export default function StandardTable({title, headers, cellRenderer, sortFunc = null, response = null,
                                      actionButton }) {
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        if (!response) {
            return
        }

        response().then((data) => {
            setRows(data)
            console.log(data)
        }).catch((error) => {
            // Handle the error
        });

    }, [response]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div>
            <div style={{display: 'flex', alignItems: 'center', padding: '20px'}}>
                <ModPanelH1 style={{
                    // color: '#e4e2de'
                }}>{title}</ModPanelH1>
                {actionButton && <div style={{marginLeft: 'auto'}}>
                    {actionButton}
                </div>}
            </div>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {headers.map((header, index) => (
                                <TableCell style={{
                                    // color: '#e4e2de'
                                }} key={index}>{header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
                            <TableRow key={rowIndex} style={{
                                // color: '#e4e2de'
                            }}>
                                {headers.map((header, cellIndex) => (
                                    <TableCell key={cellIndex} style={{
                                        // color: '#e4e2de'
                                    }}>
                                        {cellRenderer(row, header)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                style={{
                    // color: '#e4e2de'
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}
