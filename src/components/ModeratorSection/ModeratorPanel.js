import * as React from 'react';
import {useEffect, useState} from 'react';
import {createTheme, styled, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {mainListItems} from './listItems';
import Chart from './Chart';
import CommonGameTable from './GameTable';
import {
    apiWithHeader,
    fetchExtraPlayerInfo,
    fetchGameData,
    formatDate,
    getGameData,
    utcToCurrentLocationTimeZone
} from "../../util/helperutils";
import LinearStepper from "./Stepper";
import GameSection from "./GameSection";
import {Button, Chip, Tab, Tabs, Tooltip} from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import GameStatusDialog from "./GameStatusSelectionDialog";
import ModeratorProfileModal from "./ViewModeratorModal";
import EmailClient from "./EmailClient";
import EnhancedTable from "./OzPoolTable";
import StandardTable from "./StandardTable";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import moment from "moment";
import GenericDeleteDialog from "../GenericDeleteDialog";
import CreateOrientationDialog from "./OrientationDialog";
import Players from "./ListPlayers";
import NeedOrientationPlayers from "./ListNotAttendedOrientationPlayers";
import {useNavigate} from "react-router-dom";

const drawerWidth = 240;
const tabStyle = {
    default_tab: {
        // color: 'white',
    },
};

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        '& .MuiDrawer-paper': {
            // background: '#181A1B',
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const mdTheme = createTheme();

function DashboardContent({setAlert}) {
    const [open, setOpen] = React.useState(true);
    const [selectedItem, setSelectedItem] = useState(1);
    const [activeGame, setActiveGame] = useState(null);
    const [listGames, setListGames] = useState([])
    const [tabOriginalZombieIndex, setTabOriginalZombieIndex] = useState(0);
    const [originalZombies, setOriginalZombies] = useState([]);
    const [openGameStatus, setOpenGameStatus] = useState(false);
    const [uuid, setUUID] = useState(null)
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [profile, setProfile] = useState(null);
    const [openOrientationDeleteDialog, setOpenOrientationDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [openOrientation, setOpenOrientation] = useState(false);
    const [editOrientation, setEditOrientation] = useState(false);
    const [deleteApi, setDeleteApi] = useState('');
    const navigate = useNavigate();

    const handleOpenOrientation = (row) => {
        setEditOrientation(row)
        setOpenOrientation(true);
    };

    const handleCloseOpenOrientation = () => {
        setEditOrientation(null)
        setOpenOrientation(false);
    };

    const handleDeleteClick = (item, api) => {
        setDeleteApi(api)
        setItemToDelete(item);
        setOpenOrientationDeleteDialog(true);
    };

    const handleOrientationCloseDeleteDialog = () => {
        setOpenOrientationDeleteDialog(false);
        setItemToDelete(null);
    };

    const handleProfileModalOpen = (row) => {
        fetchExtraPlayerInfo(row.id).then(r => {
            setProfile({...row, ...r.data});
        })
        setProfileModalOpen(true)
    }

    const handleProfileModalClose = () => {
        setProfile(null);
        setProfileModalOpen(false);
    };

    const handleOpenGameStatus = (row) => {
        setUUID(row.id)
        setOpenGameStatus(true);
    };

    const handleCloseGameStatus = () => {
        setOpenGameStatus(false);
        setUUID(null)
    };

    const toggleDrawer = () => {
        setOpen(!open);
    };

    useEffect(() => {
        getGameData().then(({gameList, activeGame}) => {
            setListGames(gameList);
            setActiveGame(activeGame);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    useEffect(() => {
        if (window.innerWidth < 875) {
            setOpen(false);
        }
    }, []);

    useEffect(() => {
        const activeGameIndex = listGames.findIndex(game => game.active);
        if (activeGameIndex >= 0) {
            setListGames(prevListGames => [
                ...prevListGames.slice(0, activeGameIndex),
                activeGame,
                ...prevListGames.slice(activeGameIndex + 1)
            ]);
        }
    }, [activeGame]);


    function setOzList() {
        getOzsList()
            .then((r) => {
                setOriginalZombies(r)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        if (activeGame && selectedItem === 2 && (!originalZombies || originalZombies?.length === 0)) {
            setOzList();
        }
    }, [selectedItem, activeGame]);


    function getOzsList() {
        const api = apiWithHeader(navigate);
        if (api === null) {
            return Promise.reject('API not available');
        }

        return api.get('/list-original-zombies')
            .then((res) => {
                return Promise.resolve(res.data);
            })
            .catch((error) => {
                setAlert('error', 'Could not get Ozs');
                return Promise.reject(error);
            });
    }


    function getGameGrid() {
        return <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        // background: '#181A1B'
                    }}
                >
                    <LinearStepper game={activeGame}/>
                </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        // background: '#181A1B'
                    }}
                >
                    <GameSection game={activeGame} setActiveGame={setActiveGame} setAlert={setAlert}/>
                </Paper>
            </Grid>
            <Grid item xs={12} lg={8}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        // background: '#181A1B'
                    }}
                >
                    <Chart game={activeGame}/>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{p: 2, display: 'flex', flexDirection: 'column',
                    // background: '#181A1B'
                }}>
                    <CommonGameTable
                        title={'Games'}
                        headers={['Name', 'Theme', 'Start', 'End']}
                        rows={listGames}
                        sortFunc={(a, b) => new Date(b.start_time) - new Date(a.start_time)}
                        cellRenderer={(row, header) => {
                            switch (header) {
                                case 'Name':
                                    return row.name;
                                case 'Theme':
                                    return row.theme;
                                case 'Start':
                                    return formatDate(row.start_time);
                                case 'End':
                                    return formatDate(row.end_time);
                                default:
                                    return '';
                            }
                        }}
                    />
                </Paper>
            </Grid>
        </Grid>;
    }

    function getPlayersGrid(theme, handleDeleteClick, handleOpenOrientation) {
        const api = axios.create({baseURL: process.env.REACT_APP_BASE_URL});

        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{p: 2,
                        // background: '#181A1B'
                    }}>


                    </Paper>
                </Grid>
            </Grid>
        );
    }

    function getOrientationGrid(theme, handleDeleteClick, handleOpenOrientation) {
        const api = axios.create({baseURL: process.env.REACT_APP_BASE_URL});

        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{p: 2,
                        // background: '#181A1B'
                    }}>
                        <StandardTable
                            title={'Orientations'}
                            actionButton={  <Button onClick={() => handleOpenOrientation(null)} variant="contained" color="primary">
                                Create
                            </Button>}
                            headers={['Building', 'Address', 'Time', 'Modify']}
                            response={() => api.get("/list-orientations").then((res) => res.data)
                                .catch((error) => console.log(error))}
                            cellRenderer={(row, header) => {
                                switch (header) {
                                    case 'Building':
                                        return row.location_name;
                                    case 'Address':
                                        return row.address;
                                    case 'Time':
                                        return moment(new Date(utcToCurrentLocationTimeZone(row.time))).format('MM-DD-YYYY hh:mm A')
                                    case 'Modify':
                                        return (<div>

                                            <Tooltip title="Edit">
                                                <IconButton sx={{ '&:hover': { color: theme.palette.primary.main },
                                                    // color: '#e4e2de'
                                                }}
                                                            onClick={() => handleOpenOrientation(row)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton sx={{ '&:hover': { color: theme.palette.primary.main },
                                                    // color: '#e4e2de'
                                                }} onClick={() => {
                                                    handleDeleteClick(row.location_name + ' Orientation @ ' + moment(new Date(utcToCurrentLocationTimeZone(row.time))).format('MM-DD-YYYY hh:mm A'),
                                                        `/delete-orientation/?id=${row.id}`
                                                        )
                                                }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </div>);
                                    default:
                                        return '';
                                }
                            }}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <NeedOrientationPlayers/>
                </Grid>
            </Grid>
        );
    }



    function getOriginalZombiePoolGrid() {

        const handleTabChange = (event, newValue) => {
            setTabOriginalZombieIndex(newValue);
        };

        const getStyle = (isActive) => {
            return isActive ? tabStyle.active_tab : tabStyle.default_tab
        }

        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{p: 2,
                        // background: '#181A1B'
                    }}>
                        <Tabs value={tabOriginalZombieIndex} onChange={handleTabChange}>
                            <Tab label="Pool" style={getStyle(tabOriginalZombieIndex === 0)}/>
                            <Tab label="Ozs" style={getStyle(tabOriginalZombieIndex === 1)}/>
                        </Tabs>
                        <div style={{height: '20px'}}/>
                        {tabOriginalZombieIndex === 0 && (
                            <EnhancedTable setAlert={setAlert} showCurrentOzs={false}/>
                        )}
                        {tabOriginalZombieIndex === 1 && (
                            <CommonGameTable
                                title={'Ozs'}
                                headers={['Name', 'Orientation', 'Profile', 'Edit Status']}
                                rows={originalZombies}
                                refresh={setOzList}
                                cellRenderer={(row, header) => {
                                    switch (header) {
                                        case 'Name':
                                            return row.name;
                                        case 'Orientation':
                                            if (row.attended_orientation) {
                                                return <Chip icon={<CheckCircleOutlineRoundedIcon/>} label="Attended"
                                                             color="success" size="small"/>
                                            } else {
                                                return <Chip icon={<CancelOutlinedIcon/>} label="Not Attended"
                                                             color="error"
                                                             size="small"/>
                                            }
                                        case 'Profile':
                                            return (
                                                <Button variant="contained" color="primary" size={'small'}
                                                        onClick={() => handleProfileModalOpen(row)}>
                                                    View
                                                </Button>);
                                        case 'Edit Status':
                                            return (<Button variant="contained" color="primary" size={'small'}
                                                            onClick={() => {
                                                                handleOpenGameStatus(row);
                                                            }}>
                                                Change
                                            </Button>);
                                        default:
                                            return '';
                                    }
                                }}
                            />)}
                    </Paper>
                </Grid>
            </Grid>
        );
    }

    function getDashboard() {
        if (selectedItem === 1) {
            return 'Dashboard'
        }
        else if (selectedItem === 2) {
            return "Oz Selection"
        } else if (selectedItem === 3) {
            return "Orientations"
        } else if (selectedItem === 4) {
            return "Players"
        } else if (setSelectedItem === 5) {
            return "Email"
        }
        return "Email";
    }
    const theme = createTheme();

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{display: 'flex'}}>
                <GameStatusDialog open={openGameStatus} onClose={handleCloseGameStatus} setAlert={setAlert} uuid={uuid}/>
                {profile && (
                    <ModeratorProfileModal
                        open={profileModalOpen}
                        onClose={handleProfileModalClose}
                        profile={profile}
                    />
                )}
                <CreateOrientationDialog open={openOrientation} edit={editOrientation} handleClose={handleCloseOpenOrientation}/>
                <GenericDeleteDialog
                    deleteApiUrl={deleteApi}
                    item={itemToDelete}
                    open={openOrientationDeleteDialog}
                    handleClose={handleOrientationCloseDeleteDialog}
                />
                <CssBaseline/>
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && {display: 'none'}),
                            }}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{flexGrow: 1}}
                        >
                            {getDashboard()}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon style={{fill: '#898887'}}/>
                        </IconButton>
                    </Toolbar>
                    <Divider style={{background: '#898887'}}/>
                    <List component="nav">
                        {mainListItems(setSelectedItem, navigate)}
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        // backgroundColor: '#232526',
                        backgroundColor: 'rgba(35,37,38,0.37)',
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar/>
                    <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
                        {selectedItem === 1 && getGameGrid()}
                        {selectedItem === 2 && getOriginalZombiePoolGrid()}
                        {selectedItem === 3 && getOrientationGrid(theme, handleDeleteClick, handleOpenOrientation)}
                        {selectedItem === 4 && <Players setAlert={setAlert}/>}
                        {selectedItem === 5 && <EmailClient setAlert={setAlert}/>}
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default function Dashboard({setAlert}) {
    return <DashboardContent setAlert={setAlert}/>;
}