import React, {useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogTitle} from '@material-ui/core';
import {
    Button,
    DialogActions,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    Tab,
    Tabs,
    TextField,
    Typography
} from "@mui/material";
import {apiWithHeader, formatSimpleDuration} from "../../util/helperutils";
import CircularProgress from "@mui/material/CircularProgress";
import {useNavigate} from "react-router-dom";

const tabStyle = {
    default_tab: {
        // color: 'white',
    },
};

const initialFormData = {
    id: "",
    name: "",
    email: "",
    role: "PLAYER",
    approved: false,
    legendary_player: false,
    player_biography: '',
    total_players_tagged: 0,
    time_alive: 0,
    banned: false,
    ban_reason: ''
};

export default function GameDialog({open, onClose, editPlayer, setAlert}) {
    const [formData, setFormData] = useState(initialFormData);
    const [initial, setInitial] = useState({});
    const [gameCode, setGameCode] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [isShuffling, setIsShuffling] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [gameStatus, setGameStatus] = useState('ZOMBIE')
    const [inGame, setInGame] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!editPlayer) {
            setFormData(initialFormData);
        } else {
            setFormData(editPlayer);
            setInitial(editPlayer)
            setInGame(editPlayer.in_game)
            setGameStatus(editPlayer.game_status)
            setGameCode(editPlayer.game_code)
        }
    }, [editPlayer]);

    const handleChange = (event) => {
        const {name, value, type, checked} = event.target;
        let formattedValue = value;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : formattedValue,
        }));
    };

    const handleTabChange = (event, newActiveTab) => {
        setActiveTab(newActiveTab);
    };

    const getStyle = (isActive) => {
        return isActive ? tabStyle.active_tab : tabStyle.default_tab
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const changedFields = {};
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== initial[key]) {
                changedFields[key] = value;
            }
        });

        console.log(changedFields)

        const api = apiWithHeader(navigate)
        if (api === null) {
            return
        }

        if ('role' in changedFields) {
            console.log(changedFields['role'])
            api.post('/update-role', {'id': initial.id, 'role': changedFields['role']})
                .then((res) => {
                    console.log(res)
                })
                .catch((error) => {
                    console.log(error)
                    setAlert('error', 'Could not update the Game Status, make sure they have attended orientation if the game started.')
                });
            delete changedFields['role']
            return
        }

        if (!changedFields) {
            return;
        }

        changedFields['id'] = initial.id

        api.post('/update-player-by-moderator', changedFields)
            .then((res) => {
                handleClose()
            })
            .catch((error) => {
                console.log(error)
                setAlert('error', 'Could not update the Game Status, make sure they have attended orientation if the game started.')
            });
    };

    const handleRemoveFromGame = () => {

    };

    const handleClose = () => {
        onClose();
        setActiveTab(0);
    }

    const handleStatusChange = (event) => {
        setGameStatus(event.target.value);
    };

    const handleSave = (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        const api = apiWithHeader(navigate)
        if (api === null) {
            return
        }

        const body = {
            'ids': [formData.id], 'game_status': gameStatus,
        }
        console.log(body)

        api.post('/update-game-status', body)
            .then((res) => {
                setGameStatus(gameStatus)
                setAlert('success', `Game Status updated to: ${gameStatus}`)
                setIsSubmitting(false)
            })
            .catch((error) => {
                setAlert('error', 'Could not update the Game Status, make sure they have attended orientation if the game started.')
                setIsSubmitting(false)
            });
    };


    function getPersonalTabPanel() {
        return <>
            <TextField
                margin="dense"
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                margin="dense"
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
            />
            <div style={{height: '10px'}}/>
            <FormControl fullWidth>
                <InputLabel id="new-status-label">Game Status</InputLabel>
                <Select
                    value={formData.role}
                    label="Role"
                    name="role"
                    onChange={handleChange}
                    // MenuProps={{
                    //     PaperProps: {
                    //         sx: {
                    //             backgroundColor: "#1b1e1f",
                    //             boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
                    //             color: '#e4e2de',
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
                    <MenuItem value="HEAD_MOD">Head Mod</MenuItem>
                    <MenuItem value="MODERATOR">Moderator</MenuItem>
                    <MenuItem value="PLAYER">Player</MenuItem>
                </Select>
            </FormControl>

            {
                formData.biography && <TextField
                    margin="dense"
                    name="biography"
                    label="Biography"
                    value={formData.biography}
                    onChange={handleChange}
                    fullWidth
                />
            }
            <TextField
                margin="dense"
                name="total_players_tagged"
                label="Tags"
                value={formData.total_players_tagged}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                margin="dense"
                name="time_alive"
                label="Time Alive"
                value={formData.time_alive}
                onChange={handleChange}
                fullWidth
            />
            <div style={{
                // color: '#e4e2de'
            }}>{formatSimpleDuration(formData.time_alive)}</div>
            <FormControlLabel
                control={
                    <Switch
                        name="legendary_player"
                        checked={formData.legendary_player}
                        onChange={handleChange}
                    />
                }
                // style={{color: '#e4e2de'}}
                label={`Hall of Fame: ${formData.legendary_player ? "Yes" : "No"}`}
            />
        </>;
    }

    const handleShuffle = () => {
        setIsShuffling(true)
        console.log(editPlayer.id)
        // return;
        const api = apiWithHeader(navigate)
        if (api === null) {
            return
        }
        api.post('/shuffle-code', {'player_id': editPlayer.id})
            .then((res) => {
                console.log(res)
                setGameCode(res.data.game_code)
                setIsShuffling(false)
            })
            .catch((error) => {
                console.log(error);
                setIsShuffling(false)
            });
    };

    function getInGameTabPanel() {
        return (
            <>
                <div style={{display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: "8px"}}>
                    <Typography variant="h6" color="text.secondary" sx={{
                        // color: '#e4e2de'
                    }}>
                        {gameCode}
                    </Typography>
                    {isShuffling && (
                        <CircularProgress size={24}/>
                    )}
                    {!isShuffling && <Button onClick={handleShuffle} variant="contained">
                        Shuffle
                    </Button>
                    }

                </div>
                {gameStatus !== "HIDDEN_ORIGINAL_ZOMBIE" && <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    alignItems: "center",
                    gap: "8px",
                    paddingTop: '15px'
                }}>
                    <FormControl fullWidth>
                        <InputLabel id="new-status-label">Game Status</InputLabel>
                        <Select
                            value={gameStatus}
                            label="Game Status"
                            onChange={handleStatusChange}
                            // MenuProps={{
                            //     PaperProps: {
                            //         sx: {
                            //             backgroundColor: "#1b1e1f",
                            //             boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
                            //             color: '#e4e2de',
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
                            <MenuItem value="HUMAN">Human</MenuItem>
                            <MenuItem value="ZOMBIE">Zombie</MenuItem>
                            <MenuItem value="ORIGINAL_ZOMBIE">Oz</MenuItem>
                            <MenuItem value="DECEASED">Deceased</MenuItem>
                        </Select>
                    </FormControl>
                    {isSubmitting && (
                        <CircularProgress size={24} style={{marginLeft: '10px'}}/>
                    )}
                    {!isSubmitting && <Button onClick={handleSave} variant="contained">
                        Submit
                    </Button>
                    }

                </div>}
            </>
        );
    }

    return (
        <Dialog disableEnforceFocus open={open} onClose={handleClose}
                // PaperProps={{style: {backgroundColor: '#181A1B'}}}
        >
            <DialogTitle style={{
                // color: '#e4e2de'
            }}>{formData.name}
                {inGame && <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
                    <Tab label="Personal" style={getStyle(activeTab === 0)}/>
                    <Tab label="In-Game" style={getStyle(activeTab === 1)}/>
                </Tabs>}
            </DialogTitle>
            <DialogContent>
                {activeTab === 0 && getPersonalTabPanel()}
                {activeTab === 1 && getInGameTabPanel()}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                {activeTab === 0 && <Button onClick={handleSubmit} variant="contained">
                    Save
                </Button>}
                {activeTab === 1 && <Button color="error" onClick={handleRemoveFromGame} variant="contained">
                    Remove From Game
                </Button>}
            </DialogActions>
        </Dialog>
    );
}


