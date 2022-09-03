import * as React from 'react';
import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {alpha} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Checkbox from '@mui/material/Checkbox';
import Skeleton from '@mui/material/Skeleton';
import {Button, Chip, DialogActions} from "@mui/material";
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {apiWithHeader} from "../../util/helperutils";
import ModeratorProfileModal from "./ViewModeratorModal";
import axios from "axios";
import {makeStyles} from "@material-ui/core/styles";
import {ModPanelH1} from "../ReportTag/ReportTagElements";
import {useNavigate} from "react-router-dom";

const LoadingTable = () => {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Skeleton/>
                        </TableCell>
                        <TableCell>
                            <Skeleton/>
                        </TableCell>
                        <TableCell align="right">
                            <Skeleton/>
                        </TableCell>
                        <TableCell align="right">
                            <Skeleton/>
                        </TableCell>
                        <TableCell align="right">
                            <Skeleton/>
                        </TableCell>
                        <TableCell align="right">
                            <Skeleton/>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.from(Array(10).keys()).map((index) => (
                        <TableRow key={index}>
                            <TableCell padding="checkbox">
                                <Skeleton variant="rect" width={24} height={24}/>
                            </TableCell>
                            <TableCell>
                                <Skeleton/>
                            </TableCell>
                            <TableCell align="right">
                                <Skeleton/>
                            </TableCell>
                            <TableCell align="right">
                                <Skeleton/>
                            </TableCell>
                            <TableCell align="right">
                                <Skeleton/>
                            </TableCell>
                            <TableCell align="right">
                                <Skeleton/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", {month: "short"});
    const year = date.getFullYear();
    return `${month} ${year}`;
};

function getOzsList(setRows, setAlert, navigate) {
    const api = apiWithHeader(navigate)
    if (api === null) {
        return
    }

    api.get('/list-original-zombies')
        .then((res) => {
            setRows(res.data)
        })
        .catch((error) => {
            setAlert('error', 'Could not get Ozs')
        });
}

function getOzsPoolList(setRows, setAlert, navigate) {
    const api = apiWithHeader(navigate)
    if (api === null) {
        return
    }

    api.get('/list-original-zombie-pool')
        .then((res) => {
            setRows(res.data)
        })
        .catch((error) => {
            console.log(error);
            setAlert('error', 'Could not get Ozs from the Pool')
        });
}

function commitOzs(ozs, setAlert, setRows, rows, setSelected, navigate) {
    const api = apiWithHeader(navigate)
    if (api === null) {
        return
    }

    const body = {
        'ids': ozs,
        'game_status': 'HIDDEN_ORIGINAL_ZOMBIE',
    }
    console.log(body)

    api.post('/update-game-status', body)
        .then((res) => {
            console.log(res)
            if (res.data.failed_ids && res.data.failed_ids.length > 0) {
                const updatedRows = rows.filter(row => !res.data.failed_ids.includes(row.id))
                setRows(updatedRows)
                setSelected(updatedRows.map(r => r.id))
                setAlert('warning', 'Some game status were updated. Make sure they have attended orientatio.')
            } else {
                const updatedRows = rows.filter(row => !ozs.includes(row.id))
                setRows(updatedRows)
                setSelected(updatedRows.map(r => r.id))
                setAlert('success', 'Game Status updated successfully.')
            }
        })
        .catch((error) => {
            setAlert('error', 'Could not update the Game Status, make sure they have attended orientation if the game started.')
        });
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
        disablePadding: false,
        label: 'Name',
    },
    {
        id: 'orientation',
        numeric: false,
        disablePadding: false,
        label: 'Orientation',
    },
    {
        id: 'profile',
        numeric: false,
        disablePadding: false,
        label: 'Profile',
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
        // color: 'white',
        // '&$checked': {
        //     color: theme.palette.primary.main,
        // },
    },
    checked: {},
}));

function EnhancedTableHead(props) {
    const classes = useStyles();

    const {onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow >
                <TableCell padding="checkbox" sx={{
                    // color: '#e4e2de'
                }}>
                    <Checkbox
                        classes={{
                            root: classes.whiteCheckbox,
                            checked: classes.checked,
                        }}
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
                        sx={{
                            // color: '#e4e2de',
                        }}
                    >

                        {headCell.label}
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
    const {numSelected, setRows, selected, setAlert, rows, showCurrentOzs, setSelected, navigate} = props;

    return (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
                justifyContent: 'space-between', // Add this line
            }}
        >
            {numSelected > 0 ? (
                <ModPanelH1>
                    {numSelected} selected
                </ModPanelH1>
            ) : (
                <ModPanelH1>
                    {showCurrentOzs ? 'Current Ozs' : 'Oz Pool'}
                </ModPanelH1>
            )}

            {/* Add a div with marginLeft: 'auto' here */}
            <div style={{marginLeft: 'auto'}}>
                {numSelected > 0 ? (
                    <DialogActions>
                        <Button variant="contained" color="primary"
                                onClick={() => {
                                    if (showCurrentOzs) {

                                    } else  {
                                        commitOzs(selected, setAlert, setRows, rows, setSelected, navigate);
                                    }
                                }}>{showCurrentOzs ? 'Remove Oz' : 'Submit Ozs'}</Button>
                    </DialogActions>
                ) : (
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={() => {
                            if (showCurrentOzs) {

                            } else {
                                getOzsPoolList(setRows, setAlert, navigate);
                            }
                        }}>{showCurrentOzs ? 'Refresh' : 'Randomize Ozs'}</Button>
                    </DialogActions>
                )}
            </div>
        </Toolbar>

    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable({setAlert, showCurrentOzs}) {
    const classes = useStyles();
    const [rows, setRows] = useState(null);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page] = React.useState(0);
    const [rowsPerPage] = React.useState(10);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(showCurrentOzs) {
            getOzsList(setRows, setAlert, navigate);
        } else {
            getOzsPoolList(setRows, setAlert, navigate);
        }
    }, [])

    async function fetchExtraPlayerInfo(uuid) {
        const api = axios.create({
            baseURL: process.env.REACT_APP_BASE_URL,
        });

        return new Promise((resolve, reject) => {
            api.get(`/player-by-id?id=${uuid}`)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

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

    const handleClick = (event, name) => {
        if (event.target.tagName === "BUTTON") {
            return
        }

        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
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

    const handleProfileModalOpen = (row) => {
        fetchExtraPlayerInfo(row.id).then(r => {
            setProfile({...row, ...r.data});
            console.log({...row, ...r.data})

        })
        setProfileModalOpen(true)
    }

    const handleProfileModalClose = () => {
        setProfile(null);
        setProfileModalOpen(false);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    function getTableWithValues() {
        return <TableContainer>
            <Table
                size={'small'}
            >
                <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length}
                    selected={selected}
                />
                <TableBody >
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
                                            // classes={{
                                            //     root: classes.whiteCheckbox,
                                            //     checked: classes.checked,
                                            // }}
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
                                        padding="right"
                                        sx={{
                                            // color: '#e4e2de'
                                    }}
                                    >
                                        {row.name}
                                    </TableCell>
                                    <TableCell>
                                        {row.attended_orientation ? (
                                            <Chip icon={<CheckCircleOutlineRoundedIcon/>} label="Attended"
                                                  color="success" size="small"/>
                                        ) : (
                                            <Chip icon={<CancelOutlinedIcon/>} label="Not Attended" color="error"
                                                  size="small"/>
                                        )}
                                    </TableCell>
                                    <TableCell align="left">
                                        <Button variant="contained" color="primary" size={'small'}
                                                onClick={() => handleProfileModalOpen(row)}>
                                            View
                                        </Button>
                                    </TableCell>
                                    <TableCell sx={{
                                        // color: '#e4e2de'
                                    }} align="right">{formatDate(row.created)}</TableCell>
                                </TableRow>
                            );
                        })}
                    {emptyRows > 0 && (
                        <TableRow
                            style={{
                                height: (53) * emptyRows,
                            }}
                        >
                            <TableCell colSpan={6}/>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>;
    }

    return (
        <div>
            {profile && (
                <ModeratorProfileModal
                    open={profileModalOpen}
                    onClose={handleProfileModalClose}
                    profile={profile}
                />
            )}
            <Box style={{maxHeight: '100vh'}}>
                <EnhancedTableToolbar numSelected={selected.length} selected={selected} setRows={setRows}
                                      setAlert={setAlert} rows={rows} showCurrentOzs={showCurrentOzs} setSelected={setSelected} navigate={navigate}/>
                {rows && getTableWithValues()}
                {!rows && LoadingTable()}
            </Box>
        </div>
    );
}