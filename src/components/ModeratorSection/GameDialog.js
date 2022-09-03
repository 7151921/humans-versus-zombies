import React, {useEffect, useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Switch,
    TextField,
} from "@mui/material";
import {apiWithHeader, timeZoneOptions, utcToCurrentLocationTimeZone} from "../../util/helperutils";
import moment from 'moment';
import 'moment-timezone';
import {LocalizationProvider} from "@mui/x-date-pickers";
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker'
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment'
import {useNavigate} from "react-router-dom";

const initialFormData = {
    name: "",
    theme: "",
    est_game_length: 0,
    start_time: "",
    registration_open: true,
};
const color = "#c44242";

export default function GameDialog({open, onClose, game = null, setActiveGame, setAlert}) {
    const [formData, setFormData] = useState(initialFormData);
    const [disableStart, setDisableStart] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        if (!game) {
            setFormData(initialFormData);
        } else {
            setFormData(game);
            setDisableStart(!(new Date(utcToCurrentLocationTimeZone(game.start_time)).getTime() > moment()
                .tz(timeZoneOptions[process.env.REACT_APP_TIME_ZONE].timeZone).toDate()))
        }
    }, [game]);

    const handleChange = (event) => {
        const {name, value, type, checked} = event.target;
        let formattedValue = value;
        if (name === 'start_time' && type === 'datetime-local') {
            formattedValue = moment(value).utc().format('YYYY-MM-DDTHH:mm:ss');
        }
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : formattedValue,
        }));
    };


    const handleSubmit = () => {
        const api = apiWithHeader(navigate)

        if (api === null) {
            return
        }

        const dateValid = new Date(utcToCurrentLocationTimeZone(formData.start_time)).getTime() > moment()
            .tz(timeZoneOptions[process.env.REACT_APP_TIME_ZONE].timeZone).toDate() || disableStart

        if (!dateValid) {
            setAlert('error', 'Please set a time in the future.')
        } else {
            api.post('/game', formData)
                .then((res) => {
                    setActiveGame(res.data.game)
                    onClose();
                })
                .catch((error) => {
                    console.log(error);
                });
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ style: {
            // backgroundColor: '#181A1B'
        }
        }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DialogTitle style={{
                    // color: '#e4e2de'
                }}>{game ? "Edit Game" : "Create Game"}</DialogTitle>
                <DialogContent >
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
                        name="theme"
                        label="Theme"
                        value={formData.theme}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        name="est_game_length"
                        label="Estimated Game Length (in hours)"
                        type="number"
                        value={formData.est_game_length}
                        onChange={handleChange}
                        fullWidth
                    />
                    <div style={{height: '10px'}}/>
                    <DateTimePicker
                        label={'Start Date'}
                        disabled={disableStart}
                        inputProps={{
                            min: utcToCurrentLocationTimeZone(moment().utc().format('YYYY-MM-DDTHH:mm')),
                    }} value={moment(formData?.start_time)} onChange={handleChange}
                                    sx={{width: "100%"}}/>
                    <FormControlLabel
                        control={
                            <Switch
                                name="registration_open"
                                checked={formData.registration_open}
                                onChange={handleChange}
                            />
                        }
                        // style={{color: '#e4e2de'}}
                        label={`Registration ${formData.registration_open ? "Open" : "Closed"}`}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {game ? "Save" : "Create"}
                    </Button>
                </DialogActions>
            </LocalizationProvider>
        </Dialog>
    );
}
