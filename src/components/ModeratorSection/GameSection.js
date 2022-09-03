import {useState} from 'react';
import {Button} from '@mui/material';
import GameDialog from "./GameDialog";
import {apiWithHeader, epocToCurrentLocationTimeZone} from "../../util/helperutils";
import moment from "moment";
import {ModPanelH1} from "../ReportTag/ReportTagElements";
import EndGameDialog from "./EndGameDialog";
import RevealOzsDialog from "./RevealOZGameDialog";
import {useNavigate} from "react-router-dom";

function GameManagementCard({ game, setActiveGame, setAlert }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [openOzRevealDialog, setOpenRevealDialog] = useState(false);
    const [openCreateEditDialog, setOpenCreateEditDialog] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        setOpenDialog(true);
    };

    const handleOpenGameDialog = () => {
        setOpenCreateEditDialog(true);
    };

    const handleOnConfirmClick = async () => {
        try {
            setOpenDialog(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancelEndGameClick = () => {
        setOpenDialog(false);
    };

    const handleCancelOzClick = () => {
        setOpenRevealDialog(false);
    };

    const handleRevealOzsClick = () => {
        setOpenRevealDialog(true);
    };

    const handleGameDialogClose = () => {
        setOpenCreateEditDialog(false);
    };

    function getMilliseconds() {
        return game.start_time && new Date(game.start_time).getTime() + 24 * 60 * 60 * 1000;
    }

    function handleStartGame() {
        const api = apiWithHeader(navigate)
        if (api === null) {
            return
        }
        api.post('/start-game')
            .then((res) => {
                setActiveGame(res.data.game)
            })
            .catch((error) => {
                console.log(error);
            });
    }



    return (
        <div>
                <ModPanelH1>Game Management</ModPanelH1>
                <div style={{ height: '20px' }} />
                <GameDialog open={openCreateEditDialog} onClose={handleGameDialogClose} game={game} setActiveGame={setActiveGame} setAlert={setAlert}/>
                <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '20px', alignItems: 'center' }}>
                    {game && !game?.has_started && <div>
                        <div style={{height: '20px'}}/>
                        <Button variant="contained" color="primary"
                                onClick={handleStartGame}>Start Game</Button>
                    </div>}

                    {game?.has_started && !game?.show_original_zombies &&
                        <>
                            <p style={{
                                // color: '#e4e2de'
                            }}>Auto Ozs Reveal</p>
                            <p style={{
                                // color: '#e4e2de'
                            }}>{moment(new Date(epocToCurrentLocationTimeZone(getMilliseconds()))).format('MM-DD-YYYY @ hh:mm A')}</p>
                            <div style={{height: '20px'}}/>
                            <Button variant="contained" color="primary" onClick={handleRevealOzsClick}>Reveal Ozs</Button>
                        </>
                    }
                    <div style={{height: '20px'}}/>
                    <Button variant="contained" color="primary" onClick={handleOpenGameDialog}>{!game ? 'Create': 'Edit'} Game</Button>
                    <div style={{height: '20px'}}/>
                    {game?.has_started &&
                        <Button variant="contained" color="primary" onClick={handleClick}>End Game</Button>
                    }
                </div>
            <EndGameDialog open={openDialog} handleClose={handleCancelEndGameClick}/>
            <RevealOzsDialog open={openOzRevealDialog} handleClose={handleCancelOzClick}/>
        </div>

    );
}

export default GameManagementCard;
