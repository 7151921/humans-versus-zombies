import {useEffect, useState} from 'react';
import {Button, Table, TableBody, TableCell, TableHead, TablePagination, TableRow} from '@mui/material';
import Title from "./Title";
import TableContainer from "@mui/material/TableContainer";
import {ModPanelCard, ModPanelH1} from "../ReportTag/ReportTagElements";


export default function CommonGameTable({ title, headers, rows, cellRenderer, sortFunc= null, refresh=null }) {
    const [sortedRows, setSortedRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        if (rows && rows.length > 0) {
            if (!sortFunc) {
                setSortedRows(rows);
            } else {
                setSortedRows(rows.sort(sortFunc));
            }
        } else {
        }
    }, [rows]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <ModPanelH1 style={{
                        // color: '#e4e2de'
                    }}>{title}</ModPanelH1>
                    {refresh && <Button
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: 'auto',
                            // color: '#e4e2de'
                    }}
                        onClick={refresh}
                    >
                        Refresh
                    </Button>}
                </div>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                {headers.map((header, index) => (
                                    <TableCell key={index} style={{
                                        // color: '#e4e2de'
                                    }}>{header}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
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
                    count={sortedRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    style={{
                        // color: '#e4e2de'
                }}
                />
            </div>
    );
}
