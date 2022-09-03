import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    Button,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Tabs,
    TextField,
} from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import {ModPanelH1} from '../ReportTag/ReportTagElements';
import {apiWithHeader, fetchExtraPlayerModeratorInfo, formatDate} from '../../util/helperutils';
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PlayerDialog from "./ModeratorPlayerDialog";
import Paper from "@mui/material/Paper";
import PropTypes from 'prop-types';
import {alpha} from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Checkbox from '@mui/material/Checkbox';
import {visuallyHidden} from '@mui/utils';
import {makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";


const tabStyle = {
    default_tab: {
        // color: 'white',
    },
};

export default function Players({setAlert}) {
    const [rows, setRows] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editPlayer, setEditPlayer] = useState(null)
    const [activeTab, setActiveTab] = useState(0);
    const [accountsApproval, setAccountsApproval] = useState([])
    const navigate = useNavigate();

    const handleOpenDialog = (row) => {
        fetchExtraPlayerModeratorInfo(row.id, navigate).then(r => {
            setEditPlayer({...row, ...r.data});
            setDialogOpen(true);
        })
    };

    const handleCloseDialog = () => {
        setEditPlayer(null)
        setDialogOpen(false);
    };

    useEffect(() => {
        const api = apiWithHeader(navigate);
        if (api === null) {
            return;
        }

        api.get('/players')
            .then((res) => {
                console.log('getting players!')
                const sortedData = res.data.sort((a, b) => a.name.localeCompare(b.name));
                setRows(sortedData);
            })
            .catch((error) => {
            });
    }, []);

    useEffect(() => {
        if (activeTab !== 1 || accountsApproval.length > 0) {
            return
        }
        console.log('getting approvals')
        const api = apiWithHeader(navigate);
        if (api === null) {
            return;
        }

        api.get('/player-approvals')
            .then((res) => {
                const sortedData = res.data.sort((a, b) => a.name.localeCompare(b.name));
                setAccountsApproval(sortedData);
            })
            .catch((error) => {
            });
    }, [activeTab]);

    const handleTabChange = (event, newActiveTab) => {
        setActiveTab(newActiveTab);
    };

    const getStyle = (isActive) => {
        return isActive ? tabStyle.active_tab : tabStyle.default_tab
    }

    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                // background: '#181A1B'
            }}
        >
            <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
                <Tab label="All" style={getStyle(activeTab === 0)}/>
                <Tab label="Approvals" style={getStyle(activeTab === 1)}/>
            </Tabs>
            <div>
                {activeTab === 0 && <>
                    <PlayerDialog open={dialogOpen} onClose={handleCloseDialog} editPlayer={editPlayer}
                                  setAlert={setAlert}/>
                    <CommonPlayersTable
                        title={'Players'}
                        headers={['Name', 'Email', 'Approved', 'Edit']}
                        rs={rows}
                        cellRenderer={(row, header) => {
                            switch (header) {
                                case 'Name':
                                    return row.name;
                                case 'Email':
                                    return row.email;
                                case 'Approved':
                                    if (row.approved) {
                                        return <Chip icon={<CheckCircleOutlineRoundedIcon/>} label="Approved"
                                                     color="success" size="small"/>
                                    } else {
                                        return <Chip icon={<CancelOutlinedIcon/>} label="Not Approved"
                                                     color="error"
                                                     size="small"/>
                                    }
                                case 'Edit':
                                    return (<Button variant="contained" color="primary" size={'small'}
                                                    onClick={() => handleOpenDialog(row)}
                                    >
                                        Edit
                                    </Button>);

                                default:
                                    return '';
                            }
                        }}
                    />
                </>}
                {activeTab === 1 && <EnhancedTable rs={accountsApproval} navigate={navigate}/>}
            </div>
        </Paper>
    );
}


function CommonPlayersTable({title, headers, rs, cellRenderer}) {
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRows, setFilteredRows] = useState([]);
    const [showInGamePlayers, setShowInGamePlayers] = useState(false); // Add state for the Switch
    const [selectedValue, setSelectedValue] = useState("ALL");

    useEffect(() => {
        if (!rs) {
            return;
        }
        setRows(rs)
    }, [rs]);

    useEffect(() => {
        setFilteredRows(rows.filter((row) => {
            const inGamePlayers = (showInGamePlayers && row.in_game) || (!showInGamePlayers)
            const isValueSelected = selectedValue === null || selectedValue === 'ALL' ||
                ((selectedValue === "HEAD_MOD" || selectedValue === "MODERATOR" || selectedValue === "PLAYER") && row.role === selectedValue) || (selectedValue === 'UNAPPROVED' && !row.approved)
            const isNameMatched = !searchQuery || (row.name && row.name.toLowerCase().includes(searchQuery.toLowerCase())) || (row.email && row.email.toLowerCase().includes(searchQuery.toLowerCase()))
            return inGamePlayers && isValueSelected && isNameMatched;
        }));
    }, [rows, searchQuery, showInGamePlayers, selectedValue]);

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
            <div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}
                >
                    <TextField
                        type="text"
                        label='Search'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{marginRight: 'auto', marginLeft: '20px'}}
                    />
                    <div style={{textAlign: 'center', flex: '1'}}>
                        <ModPanelH1 style={{
                            // color: '#e4e2de'
                        }}>{title}</ModPanelH1>
                    </div>
                    <div style={{marginTop: '5%', height: '50%', display: 'flex', alignItems: 'center'}}>
                        <div style={{height: '50%'}}>
                            <FormControl style={{width: '200px'}}>
                                <InputLabel>Account Status</InputLabel>
                                <Select
                                    value={selectedValue}
                                    label="filterGameStatus"
                                    onChange={handleChange}
                                    // MenuProps={{
                                    //     PaperProps: {
                                    //         sx: {
                                    //             backgroundColor: "#1b1e1f",
                                    //             boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
                                    //             // color: '#e4e2de',
                                    //             "& .MuiMenuItem-root.Mui-selected": {
                                    //                 backgroundColor: "rgb(79,83,84)"
                                    //             },
                                    //             "& .MuiMenuItem-root:hover": {
                                    //                 backgroundColor: '#2b2f31',
                                    //                 transition: 'all 0.2s ease-in-out',
                                    //             },
                                    //             "& .MuiMenuItem-root.Mui-selected:hover": {
                                    //                 backgroundColor: '#2b2f31',
                                    //                 transition: 'all 0.2s ease-in-out',
                                    //             }
                                    //         }
                                    //     }
                                    // }}
                                >
                                    <MenuItem value={"ALL"}>All</MenuItem>
                                    <MenuItem value={"HEAD_MOD"}>Head Mod</MenuItem>
                                    <MenuItem value={"MODERATOR"}>Moderator</MenuItem>
                                    <MenuItem value={"PLAYER"}>Player</MenuItem>
                                    <MenuItem value={"UNAPPROVED"}>Unapproved</MenuItem>
                                </Select>
                            </FormControl>
                            <div style={{paddingTop: '20px'}}>
                                <Switch
                                    checked={showInGamePlayers}
                                    onChange={(e) => setShowInGamePlayers(e.target.checked)}
                                />
                                <span style={{
                                    // color: '#e4e2de'
                                }}>Show in-game players</span>
                            </div>
                        </div>
                    </div>
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
                            {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
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
                    count={filteredRows.length}
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

const useStyles = makeStyles((theme) => ({
    whiteCheckbox: {
        color: 'white',
        '&$checked': {
            color: theme.palette.primary.main,
        },
    },
    checked: {},
}));


function EnhancedTableHead(props) {
    const classes = useStyles();
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
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
    const { numSelected, selected, navigate, removeSelected } = props;

    function approveAccounts() {
        const api = apiWithHeader(navigate);
        if (api === null) {
            return;
        }

        api.post('/approve_players', {'ids': selected})
            .then((res) => {
                removeSelected();
            })
            .catch((error) => {
            });
    }

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
                justifyContent: 'space-between', // Add this line
            }}
        >
            <div>
                {numSelected > 0 ? (
                    <ModPanelH1
                        sx={{ flex: '1 1 100%' }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected} Selected
                    </ModPanelH1>
                ) : (
                    <ModPanelH1>
                        Unapproved Accounts
                    </ModPanelH1>
                )}
            </div>
            <div>
                {numSelected > 0 ? (
                    <Button variant="contained" color="primary" onClick={approveAccounts}>Approve</Button>
                ) : (
                    <>
                    </>
                )}
            </div>
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

function EnhancedTable({rs, navigate}) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        setRows(rs)
    }, [rs]);

    const removeSelected = () => {
        setRows(rows.filter(row => !selected.includes(row.id)));
        setSelected([])
    };

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

    return (
        <Box sx={{ width: '100%' }}>
                <EnhancedTableToolbar numSelected={selected.length} selected={selected} navigate={navigate} removeSelected={removeSelected}/>
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
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
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
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">{row.email}</TableCell>
                                            <TableCell align="right">{formatDate(row.created)}</TableCell>
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