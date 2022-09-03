import React, {useState} from 'react';
import {Dialog, DialogContent, DialogTitle} from '@material-ui/core';
import {StyledTextField} from "../StyledTextField";
import {apiWithHeader} from "../../util/helperutils";
import StandardStyledButton from "../StandardStyledButton";
import {useNavigate} from "react-router-dom";

function GameCodeDialog({open, onClose}) {
    const [gameCode, setGameCode] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGameCodeChange = (event) => {
        event.stopPropagation()
        setGameCode(event.target.value);
    }

    const handleSubmit = () => {
        setLoading(true)
        console.log('submitting')
        const api = apiWithHeader(navigate)
        if (api === null) {
            return
        }
        api.post('/report-tag', {'game_code': gameCode})
            .then((res) => {
                setLoading(false)
                onClose()
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ style: { backgroundColor: '#181A1B' } }}>
            <DialogTitle style={{ color: '#e4e2de' }}>You got a tag? Great enter your game code.</DialogTitle>
            <DialogContent>
                <StyledTextField
                    label="Game code"
                    value={gameCode}
                    onChange={handleGameCodeChange}
                    fullWidth
                    autoFocus
                    margin="normal"
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{width: '35%',  display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{height: '10px'}}/>
                        <StandardStyledButton text={'Submit'} handleButtonClick={handleSubmit} loading={loading}/>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default GameCodeDialog;
