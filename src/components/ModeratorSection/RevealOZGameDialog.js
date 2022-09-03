import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {apiWithHeader} from "../../util/helperutils";
import {useNavigate} from "react-router-dom";

function RevealOzsDialog({ open, handleClose }) {
    const navigate = useNavigate();

    const handleOnConfirmClick = () => {
        //Create
        // /end-game
        const api = apiWithHeader(navigate)
        if (api === null) {
            return
        }
        api.post('/reveal-original-zombies')
            .then((res) => {
                handleClose();
                console.log(res.data)
            })
            .catch((error) => {
                handleClose();

                console.log(error);
            });

    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Warning</DialogTitle>
            <DialogContent>
                <p>You are about to reveal the Original Zombies. You can not undo this action.</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleOnConfirmClick}>Confirm</Button>
            </DialogActions>
        </Dialog>
    );
}

export default RevealOzsDialog;
