import React, {useState} from 'react';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
import {Role} from "../../model/models";
import {Chip, Tab, Tabs} from "@mui/material";
import {formatDuration} from "../../util/helperutils";

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        [theme.breakpoints.up('sm')]: {
            overflow: 'auto'
        }
    },
    paper: {
        backgroundColor: '#181A1B',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        outline: 'none',
        borderRadius: '10px',
        maxWidth: '400px',
        width: '90%',
        [theme.breakpoints.up('sm')]: {
            maxWidth: '700px',
            width: '70%',
        },
        [theme.breakpoints.up('md')]: {
            maxWidth: '400px',
            width: '90%',
        }
    },
    avatar: {
        width: '100%',
        height: 'auto',
        borderRadius: '10px'
    }
}));

const tabStyle = {
    default_tab:{
        color: '#7c7367',
    },
    active_tab:{
        color: '#01BF71',
    }
};

const ProfileModal = ({open, onClose, profile, zombieUUIDLookup}) => {
    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleClose = () => {
        onClose();
    };

    const getStyle = (isActive) => {
        return isActive ? tabStyle.active_tab : tabStyle.default_tab
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="profile-modal-title"
            aria-describedby="profile-modal-description"
            className={classes.modal}
        >
            <div className={classes.paper}>
                <Grid container spacing={1}>
                    <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
                        <Avatar alt={'picture'} src={profile.profile_picture_file_name} className={classes.avatar}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h5" id="profile-modal-title" style={{color: '#e4e2de'}}>
                            {profile.name}
                        </Typography>
                        <div style={{height: '5px'}}/>
                        <Grid item xs={12}>
                            {profile?.role && profile?.role.toLowerCase().includes('mod') &&  <Chip
                                label={Role[profile?.role] ?? ''}
                                color={profile?.role?.toLowerCase().includes('head') ? "secondary" : "primary"}
                            />}
                            {profile?.legendary_player && <Chip
                                label="Hall of Fame"
                                style={{ backgroundColor: '#9a8100', color: '#fff'}}
                            />}
                            {profile?.role && profile?.role.toLowerCase().includes('player') &&  <Chip
                                label={profile?.game_status ?? ''}
                                color={profile?.game_status?.toLowerCase().includes('zombie') ? "error" : "success"}
                            />}

                        </Grid>
                        <div style={{height: '5px'}}/>
                        <Tabs value={value} onChange={handleTabChange}
                              TabIndicatorProps={{
                                  style: { background: "#01BF71"}
                              }}                        >
                            <Tab label="Info" style={getStyle(value === 0)}/>
                            <Tab label="Stats" style={getStyle(value === 1)}/>
                        </Tabs>
                    </Grid>
                    {value === 0 && <div style={{minHeight: ''}}>
                        {!profile?.player_biography && !profile?.squad_name && <Typography variant="subtitle1" id="profile-modal-description" style={{color: '#e4e2de'}}>
                            No Info
                        </Typography>
                        }
                        <Grid item xs={12}>
                            {profile?.squad_name && <Typography variant="subtitle1" id="profile-modal-description" style={{color: '#e4e2de'}}>
                                Squad: {profile?.squad_name ?? ''}
                            </Typography>}
                        </Grid>
                        <Grid item xs={12}>
                            {profile?.player_biography && <Typography variant="subtitle1" id="profile-modal-description" style={{color: '#e4e2de'}}>
                                About: {profile?.player_biography ?? ''}
                            </Typography>}
                        </Grid>
                    </div>}
                    {value === 1 && <div>
                        {profile?.game_status && profile?.role.toLowerCase().includes('player') && profile.game_status.toLowerCase().includes('zombie') && <Grid item xs={12}>
                            <div>
                                <Typography variant="subtitle1" id="profile-modal-description" style={{color: '#e4e2de'}}>
                                    Tagged By: {profile?.zombie?.name?.toLowerCase().includes('original zombie') ? profile?.zombie.name : <a href="#"
                                                   onClick={() => zombieUUIDLookup(profile?.tagged_by ?? null)}>{profile?.zombie?.name ?? ''}</a>}
                                </Typography>
                            </div>
                        </Grid>}
                        <Grid item xs={12}>
                            {profile?.game_status && profile?.role.toLowerCase().includes('player') && profile.game_status.toLowerCase().includes('zombie') && <Typography variant="subtitle1" id="profile-modal-description" style={{color: '#e4e2de'}}>
                                Tags as Zombie : {profile?.tag_count ?? 0}
                            </Typography>}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" id="profile-modal-description" style={{color: '#e4e2de'}}>
                                Total Tags as Zombie: {profile?.total_players_tagged ?? 0}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <div>
                                <Typography variant="subtitle1" id="profile-modal-description" style={{color: '#e4e2de'}}>
                                    Life Time Alive:
                                </Typography>
                                <Typography variant="subtitle1" id="profile-modal-description" style={{color: '#e4e2de'}}>
                                    {formatDuration(profile?.time_alive ?? '')}
                                </Typography>
                            </div>
                        </Grid>

                    </div>}
                </Grid>
            </div>
        </Modal>
    );
};

export default ProfileModal;
