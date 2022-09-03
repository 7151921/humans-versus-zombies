import React, {useEffect, useState} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {StyledTextField} from "../StyledTextField";
import StyledButton from "../StyledButton";
import {Card} from "reactstrap";
import {Form, FormContent, FormWrap} from "./EditElements"
import Switch from "@material-ui/core/Switch";
import {FormControlLabel} from "@mui/material";
import {apiWithHeader} from "../../util/helperutils";
import {makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";


const tabStyle = {
    default_tab: {
        color: 'white',
    },
    active_tab: {
        color: '#01BF71',
    }
};

const useStyles = makeStyles((theme) => ({
    tabs: {
        '& button': {
            minWidth: 100,
            [theme.breakpoints.down('sm')]: {
                minWidth: 'auto', // Set the minimum width to be automatic for screens smaller than 'sm'
                padding: theme.spacing(0, 2), // Add some padding to the left and right of the button for better spacing
            },
        },
    },
    toggle: {
        color: '#e4e2de',
        '& .Mui-checked': {
            color: '#01BF71',
        },
        '& .MuiSwitch-track': {
            backgroundColor: '#01BF71',
        },
        '& .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#01BF71', //orange
        },
    },
}));



function EditProfileCard({setAlert, setLoading}) {
    const [value, setValue] = useState(0);
    const [name, setName] = useState('');
    const [emergencyPhone, setEmergencyPhone] = useState('');
    const [phone, setPhone] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [email, setEmail] = useState('');
    const [emailOptIn, setEmailOptIn] = useState(true);
    const [squadName, setSquadName] = useState('');
    const [playerBio, setPlayerBio] = useState('');
    const navigate = useNavigate();
    const classes = useStyles();

    useEffect(() => {
        setLoading(true)
        const playerData = JSON.parse(localStorage.getItem('playerData'))?.value
        setName(playerData?.name ?? '')
        setSquadName(playerData?.squad_name ?? '')
        setPlayerBio(playerData?.player_biography ?? '')
        setEmailOptIn((!playerData?.email_opt_out ?? false))

        const api = apiWithHeader(navigate)
        if (api === null) {
            return
        }
        api.get('/player-data-by-usersname')
            .then((res) => {
                setEmail(res.data?.email)
                setEmergencyPhone(res.data?.emergency_contact?.phone)
                setPhone(res.data?.phone?.phone)
                setContactInfo(res.data.phone?.instructions)
                setLoading(false)
            })
            .catch((error) => {
                console.log(error);
                setLoading(false)
            });
    }, [])

    const getStyle = (isActive) => {
        return isActive ? tabStyle.active_tab : tabStyle.default_tab
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true)

        const data = {
            'name': name,
            'player_biography': playerBio,
            'squad_name': squadName,
            'email': email,
            'email_opt_out': !emailOptIn,
            'phone': {'phone': phone, 'instructions': contactInfo},
            'emergency_contact': {'phone': emergencyPhone}
        };

        const api = apiWithHeader(navigate)
        if (api === null) {
            return
        }
        api.post('/save-player-changes', data)
            .then((res) => {
                console.log(res)
                setLoading(false)
            })
            .catch((error) => {
                console.log(error);
                setLoading(false)
            });
    };

    return (
        <Card>
            <FormWrap>
                <FormContent>
                    <Form onSubmit={handleSubmit}>
                        <div>
                            <div>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    centered
                                    TabIndicatorProps={{
                                        style: {background: "#01BF71"}
                                    }}
                                    className={classes.tabs}

                                    style={{width: "100%"}}
                                >
                                    <Tab label="Personal" style={getStyle(value === 0)}/>
                                    <Tab label="In-game" style={getStyle(value === 1)}/>
                                    <Tab label="Mod" style={getStyle(value === 2)}/>
                                </Tabs>
                            </div>
                            {value === 0 && (
                                <div>
                                    <StyledTextField
                                        label="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <StyledTextField
                                        label="Emergency Phone Number"
                                        value={emergencyPhone}
                                        onChange={(e) => setEmergencyPhone(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <StyledTextField
                                        label="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                className={classes.toggle}
                                                checked={emailOptIn}
                                                onChange={(e) => setEmailOptIn(e.target.checked)}
                                            />
                                        }
                                        label={
                                            <span style={{color: 'white'}}>
                                              {emailOptIn ? "Email Opt-in" : "Email Opt-out"}
                                            </span>
                                        }
                                    />
                                </div>
                            )}
                            {value === 1 && (
                                <div>
                                    <StyledTextField
                                        label="Squad Name"
                                        value={squadName}
                                        onChange={(e) => setSquadName(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                    />

                                    <StyledTextField
                                        label="Player Biography"
                                        value={playerBio}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 240) {
                                                setPlayerBio(e.target.value);
                                            }
                                        }}
                                        fullWidth
                                        margin="normal"
                                        multiline
                                        rows={4}
                                        maxLength={240}
                                    />

                                </div>
                            )}
                            {value === 2 && (
                                <div>
                                    <StyledTextField
                                        label="Contact"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <StyledTextField
                                        label="Contact Instructions"
                                        value={contactInfo}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 240) {
                                                setContactInfo(e.target.value);
                                            }
                                        }}
                                        fullWidth
                                        margin="normal"
                                        multiline
                                        rows={4}
                                        maxLength={240}
                                    />
                                </div>
                            )}
                            <div style={{height: '20px'}}/>
                            <StyledButton text={'Submit'}/>
                        </div>
                    </Form>
                </FormContent>
            </FormWrap>
        </Card>
    );
}

export default EditProfileCard;
