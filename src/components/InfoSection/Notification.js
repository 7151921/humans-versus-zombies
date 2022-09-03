import * as React from 'react';
import {useEffect} from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars({severity, message, reset}) {
    const [open, setOpen] = React.useState(false);
    const [sev, setSev] = React.useState('');
    const [msg, setMsg] = React.useState('');

    useEffect(() => {
        if (!message) {
            return
        }
        setOpen(true)
        setSev(severity)
        setMsg(message)
    }, [message, severity])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        if (reset !== undefined) {
            reset()
        }
        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{
            vertical: "top",
            horizontal: "center"
        }} style={{paddingTop: '80px'}}>
            <Alert onClose={handleClose} severity={sev} sx={{ width: '100%' }}>
                {msg}
            </Alert>
        </Snackbar>
    );
}
