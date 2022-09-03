import React, {useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select
} from '@mui/material';
import {apiWithHeader} from "../../util/helperutils";
import {useNavigate} from "react-router-dom";


const GameStatusDialog = ({open, onClose, uuid, setAlert}) => {
    const [newStatus, setNewStatus] = useState('');
    const navigate = useNavigate();

    function updateStatus() {
        const api = apiWithHeader(navigate)
        if (api === null || !uuid) {
            return
        }

        const body = {
            'ids': [uuid], 'game_status': newStatus.toUpperCase(),
        }

        api.post('/update-game-status', body)
            .then((res) => {
                if ('failed_ids' in res.data) {
                    setAlert('success', 'Could not update the Game Status, make sure they have attended orientation if the game started.')
                } else {
                    setAlert('success', `Game Status updated to: ${newStatus}`)
                }
                onClose()
            })
            .catch((error) => {
                setAlert('error', 'Could not update the Game Status, make sure they have attended orientation if the game started.')
            });
    }


    const handleStatusChange = (event) => {
        setNewStatus(event.target.value);
    };

    const handleSave = () => {
        updateStatus()
    };


    return (<Dialog open={open} onClose={onClose} PaperProps={{ style: {
        // backgroundColor: '#181A1B'
    } }}>
            <DialogTitle style={{
                // color: '#e4e2de'
            }}>Game Status</DialogTitle>
            <DialogContent>
                <p style={{
                    // color: '#e4e2de'
                }}>Please choose a new status from the drop down below:</p>
                <div style={{height: '20px'}}/>
                <FormControl fullWidth>
                    <InputLabel id="new-status-label">New Status</InputLabel>
                    <Select
                        labelId="new-status-label"
                        id="new-status"
                        value={newStatus}
                        label={'New Status'}
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
                        <MenuItem value="Human">Human</MenuItem>
                        <MenuItem value="Zombie">Zombie</MenuItem>
                        <MenuItem value="DECEASED">Deceased</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>);
};

export default GameStatusDialog;
