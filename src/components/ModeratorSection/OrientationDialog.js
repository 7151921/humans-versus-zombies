import React, {useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment'
import moment from "moment";
import {apiWithHeader, utcToCurrentLocationTimeZone} from "../../util/helperutils";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {useNavigate} from "react-router-dom";


function CreateOrientationDialog({ open, handleClose, edit, setLoading}) {
    const [id, setId] = useState("");
    const [locationName, setLocationName] = useState("");
    const [address, setAddress] = useState("");
    const [time, setTime] = useState(null);
    const [note, setNote] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setId(edit?.id)
        setLocationName(edit?.location_name)
        setAddress(edit?.address)
        setTime(moment(utcToCurrentLocationTimeZone(edit?.time)))
        setNote(edit?.note)
    }, [edit])

    const handleLocationNameChange = (event) => {
        setLocationName(event.target.value);
    };

    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    };

    const handleTimeChange = (date) => {
        setTime(date);
    };

    const handleNoteChange = (event) => {
        setNote(event.target.value);
    };

    const handleCreateClick = () => {
        const orientation = {
            location_name: locationName,
            address: address,
            time: time,
            note: note,
        };

        if (id) {
            orientation.id = id
        }

        const api = apiWithHeader(navigate)
        if (api === null) {
            return
        }
        api.post('/orientation', orientation)
            .then((res) => {
                console.log(res)
                //setLoading(false)
            })
            .catch((error) => {
                console.log(error);
                //setLoading(false)
            });

        console.log("Creating orientation:", orientation);
        handleClose();
    };

    function getDateTime() {
        if (!time) {
            return moment();
        }

        return time;
    }

    return (

        <Dialog open={open} onClose={handleClose}
                // PaperProps={{ style: { backgroundColor: '#181A1B' } }}
        >
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DialogTitle style={{
                // color: '#e4e2de'
            }}>Create New Orientation</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Location Name"
                    fullWidth
                    value={locationName}
                    onChange={handleLocationNameChange}
                />
                <TextField
                    margin="dense"
                    label="Address"
                    fullWidth
                    value={address}
                    onChange={handleAddressChange}
                />
                <TextField
                    margin="dense"
                    label="Note"
                    fullWidth
                    value={note}
                    onChange={handleNoteChange}
                />
                <div style={{height: '10px'}}/>
                <DateTimePicker
                    label={'Time'} value={getDateTime()} onChange={handleTimeChange} sx={{ width: "100%" }} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={handleCreateClick}
                    variant="contained"
                    color="primary"
                >
                    Create
                </Button>
            </DialogActions>
        </LocalizationProvider>
        </Dialog>

    );
}

export default CreateOrientationDialog;
