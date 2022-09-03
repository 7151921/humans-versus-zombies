import * as React from 'react';
import {useEffect, useState} from 'react';
import {Button, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField,} from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import {apiWithHeader, utcToCurrentLocationTimeZone} from '../../util/helperutils';
import Paper from "@mui/material/Paper";
import PropTypes from 'prop-types';
import {alpha} from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Checkbox from '@mui/material/Checkbox';
import {visuallyHidden} from '@mui/utils';
import moment from "moment";
import {PanelH1} from "../ReportTag/ReportTagElements";
import {useNavigate} from "react-router-dom";


export default function Players({setAlert}) {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const api = apiWithHeader(navigate);
        if (api === null) {
            return;
        }

        api.get('/not-attended-orientation')
            .then((res) => {
                const sortedData = res.data.sort((a, b) => a.name.localeCompare(b.name));
                setRows(sortedData);
            })
            .catch((error) => {
            });
    }, []);


    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                // background: '#181A1B'
            }}
        >
            <EnhancedTable rs={rows}/>
        </Paper>
    );
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Name',
    },
    {
        id: 'email',
        numeric: true,
        disablePadding: false,
        label: 'Email',
    },
    {
        id: 'created',
        numeric: true,
        disablePadding: false,
        label: 'Created',
    }
];

// const useStyles = makeStyles((theme) => ({
//     whiteCheckbox: {
//         color: 'white',
//         '&$checked': {
//             color: theme.palette.primary.main,
//         },
//     },
//     checked: {},
// }));


function EnhancedTableHead(props) {
    // const classes = useStyles();
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox" sx={{
                    // color: '#e4e2de'
                }}>
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                        // classes={{
                            // root: classes.whiteCheckbox,
                            // checked: classes.checked,
                        // }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        style={{
                            // color: '#e4e2de'
                    }}
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected, selected, setSearchQuery, navigate } = props;

    function attendedPlayers() {
        console.log(selected)
        const api = apiWithHeader(navigate);
        if (api === null) {
            return;
        }

        api.post('/attended-orientation', {'ids': selected})
            .then((res) => {
                console.log(res.data)
            })
            .catch((error) => {
            });
    }

    return (
        <div>
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(numSelected > 0 && {
                        bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    }),
                }}
            >
                <div style={{ flex: '1 1 100%' }}>
                    {numSelected > 0 ? (
                        <PanelH1
                            // color="#e4e2de"
                            variant="subtitle1"
                            component="div"
                        >
                            {numSelected} selected
                        </PanelH1>
                    ) : (
                        <PanelH1>
                            Need to Attend
                        </PanelH1>
                    )}

                </div>

                {numSelected > 0 ? (
                    <Button variant="contained" color="primary" onClick={attendedPlayers}>Attended</Button>
                ) : (
                    <>
                    </>
                )}
            </Toolbar>
            <TextField
                variant="outlined"
                label="Search by name or email"
                // value={searchTerm}
                onChange={(event) => setSearchQuery(event.target.value)}
            />
            <div style={{ height: '20px' }} />
        </div>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

function EnhancedTable({rs}) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // const classes = useStyles();

    useEffect(() => {
        console.log(rs)
        setRows(rs)
    }, [rs]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const filteredRows = rows.filter(row => {
        const searchString = searchQuery.toLowerCase();
        return (
            row.name.toLowerCase().includes(searchString) ||
            row.email.toLowerCase().includes(searchString)
        );
    });

    return (
        <Box sx={{ width: '100%' }}>
                <EnhancedTableToolbar numSelected={selected.length} selected={selected} setSearchQuery={setSearchQuery} navigate={navigate}/>
                <TableContainer>
                    <Table
                        aria-labelledby="tableTitle"
                        size={'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={filteredRows.length}
                        />
                        <TableBody>
                            {stableSort(filteredRows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.id)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.name}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                    // classes={{
                                                    //     root: classes.whiteCheckbox,
                                                    //     checked: classes.checked,
                                                    // }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                                style={{
                                                    // color: '#e4e2de'
                                            }}
                                            >
                                                {row.name}
                                            </TableCell>
                                            <TableCell style={{
                                                // color: '#e4e2de'
                                            }} align="right">{row.email}</TableCell>
                                            <TableCell style={{
                                                // color: '#e4e2de'
                                            }} align="right">{moment(new Date(utcToCurrentLocationTimeZone(row.created))).format('MM-DD-YYYY hh:mm A')}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
        </Box>
    );
}