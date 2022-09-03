import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {apiWithHeader} from "../util/helperutils";
import {useNavigate} from "react-router-dom";

function DeleteConfirmationDialog({ item, open, handleClose, deleteApiUrl}) {
    const navigate = useNavigate();

    const handleDeleteClick = () => {
        const api = apiWithHeader(navigate)
        if (api === null) {
            return
        }
        api.delete(deleteApiUrl)
            .then((res) => {
                console.log(res)
            })
            .catch((error) => {
                console.log(error);
            });
        handleClose()
    };

    return (
        <Dialog open={open} onClose={handleClose} PaperProps={{ style: { backgroundColor: '#181A1B' } }}>
            <DialogTitle style={{ color: '#e4e2de' }}>Delete Confirmation</DialogTitle>
            <DialogContent>
                <p style={{ color: '#e4e2de' }}>Are you sure you want to delete {item}?</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleDeleteClick} variant="contained" color="primary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteConfirmationDialog;
