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
    Select, TextField,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import {apiWithHeader} from "../../util/helperutils";
import Paper from "@mui/material/Paper";
import {ModPanelH1} from "../ReportTag/ReportTagElements";
import {useNavigate} from "react-router-dom";

const options = [
    { value: 'PLAYERS_IN_GAME', label: 'Players In Game' },
    { value: 'ZOMBIES', label: 'Zombies' },
    { value: 'HUMANS', label: 'Humans' },
    { value: 'ORIGINAL_ZOMBIES', label: 'Original Zombies' },
    { value: 'DECEASED', label: 'Deceased' },
    { value: 'ALL_PLAYERS', label: 'All players ever' },
];

const EmailClient = ({setAlert}) => {
    const [recipient, setRecipient] = useState(options[0].value);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState(
        `Hello,\n\n\nThanks,\nYour ${process.env.REACT_APP_ORGANIZATION} Moderator Team`
    );
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRecipientChange = (event) => {
        setRecipient(event.target.value);
    };

    const handleSubjectChange = (event) => {
        setSubject(event.target.value);
    };

    const handleBodyChange = (event) => {
        setBody(event.target.value);
    };

    const handleSendClick = () => {
        if (recipient === 'ALL_PLAYERS') {
            setConfirmDialogOpen(true);
        } else {
            setLoading(true);
            sendMessage();
        }
    };

    const handleConfirmDialogClose = (confirmed) => {
        setConfirmDialogOpen(false);
        if (confirmed) {
            setLoading(true);
            sendMessage();
        }
    };

    function getLabelFromValue(value) {
        const result = options.filter(option => option.value === value);
        return result.length > 0 ? result[0].label : null;
    }

    const sendMessage = () => {
        const api = apiWithHeader(navigate)

        if (api === null) {
            return
        }

        const requestBody = {
            'email_group': recipient, 'subject': subject, 'statement': body.replace(/\n/g, '<br/>')
        }

        api.post('/send-email', requestBody)
            .then(res => {
                setAlert('success', `Email was sent to ${getLabelFromValue(recipient)}`);
                setLoading(false);
                setRecipient(options[0].value);
                setSubject('');
                setBody(`Hello,\n\n\nThanks,\nYour ${process.env.REACT_APP_ORGANIZATION} Team`);
            })
            .catch(err => {
                setLoading(false)
                setAlert('error', `No Emails as ${getLabelFromValue(recipient)}`);
            })
    };

    return (
        <Paper
            sx={{
                p: 2,
                // display: 'flex',
                // flexDirection: 'column',
                // background: '#181A1B'
            }}
        >
            <ModPanelH1>Email Client</ModPanelH1>
            <FormControl fullWidth margin="normal">
                <InputLabel>Recipient</InputLabel>
                <Select
                    label={'Recipient'}
                    value={recipient}
                    onChange={handleRecipientChange}
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
                    {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label="Subject"
                value={subject}
                onChange={handleSubjectChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Body"
                value={body}
                onChange={handleBodyChange}
                fullWidth
                multiline
                rows={5}
                margin="normal"
                variant="outlined"
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSendClick}
                disabled={loading}
                style={{ position: 'relative' }}
            >
                Send
                {loading && (
                    <CircularProgress
                        size={24}
                        style={{marginLeft: '10px'}}
                    />
                )}
            </Button>
            <Dialog
                open={confirmDialogOpen}
                onClose={() => handleConfirmDialogClose(false)}
            >
                <DialogTitle>Confirm</DialogTitle>
                <DialogContent>
                    This action will message all players in the game. Are you sure you want
                    to proceed?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleConfirmDialogClose(false)}>Cancel</Button>
                    <Button onClick={() => handleConfirmDialogClose(true)}>OK</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default EmailClient;
