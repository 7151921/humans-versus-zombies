import React, {useState} from "react";
import CustomizedSnackbars from "../components/InfoSection/Notification";
import {LinearProgress} from "@mui/material";
import {HeroBg, VideoBg} from "../components/Cognito/HeroElements";
import video from "../video/background.gif";
import Navbar from "../components/Navbar";
import ChangePassword from "../components/Cognito/ChangePassword";
import {isPlayerLoggedIn} from "../util/helperutils";
import {useNavigate} from "react-router-dom";


const UpdateProfile = () => {
    const [sev, setSev] = React.useState('');
    const [msg, setMsg] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const[isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate();


    const toggle = () => {
        setIsOpen(!isOpen)
    }

    if (!isPlayerLoggedIn()) {
        navigate('/sign-in')
    }

    function setAlert(sev, msg) {
        setSev(sev);
        setMsg(msg);
    }

    return (
        <div>
            <HeroBg>
                <Navbar toggle={toggle} hideAll={true} style={{position: 'fixed', top: 0, left: 0, right: 0}} />
                {loading && <LinearProgress color="inherit" style={{backgroundColor: '#01BF71'}}/>}
                <VideoBg src={video} type="video/mp4"/>
            </HeroBg>
            <CustomizedSnackbars severity={sev} message={msg}/>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
                <ChangePassword setAlert={setAlert} setLoading={setLoading}/>
            </div>
        </div>
    );
};

export default UpdateProfile;