import React, {useState} from "react";
import {LinearProgress} from "@mui/material";
import {HeroBg, VideoBg} from "../Cognito/HeroElements";
import Navbar from "../Navbar";
import {isPlayerLoggedIn} from "../../util/helperutils";
import CustomizedSnackbars from "../InfoSection/Notification";
import video from "../../video/background.gif";
import ProfileEditTabs from "./EditProfileForm";
import {useNavigate} from "react-router-dom";
import Footer from "../Footer";


const EditProfile = () => {
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
        <div style={{background: '#000'}}>
            <HeroBg>
                <Navbar toggle={toggle} hideAll={true} style={{position: 'fixed', top: 0, left: 0, right: 0}} setLoading={setLoading} />
                {loading && <LinearProgress color="inherit" style={{backgroundColor: '#01BF71'}}/>}
                <VideoBg src={video} type="video/mp4"/>
            </HeroBg>
            <CustomizedSnackbars severity={sev} message={msg}/>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
                <ProfileEditTabs setAlert={setAlert} setLoading={setLoading}/>
            </div>
            <Footer/>
        </div>
    );
};

export default EditProfile;