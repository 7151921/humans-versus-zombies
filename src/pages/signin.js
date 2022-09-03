import React, {useState} from "react";
import SignInForm from "../components/Cognito";
import CustomizedSnackbars from "../components/InfoSection/Notification";
import {LinearProgress} from "@mui/material";
import {HeroBg, VideoBg} from "../components/Cognito/HeroElements";
import video from "../video/background.gif";
import LoggedInAs from "../components/Cognito/LoggedInAs";
import {isPlayerLoggedIn} from "../util/helperutils";
import ForgotPassword from "../components/Cognito/ForgotPassword";
import Navbar from "../components/Navbar";
import SignUp from "../components/Cognito/SignUp";
import {exampleCard} from "../components/InfoSection/Data";
import Footer from "../components/Footer";
import ExternalNavbar from "../components/Navbar/ExternalNav";


const SignIn = () => {
    const [sev, setSev] = React.useState('');
    const [msg, setMsg] = React.useState('');
    const [formType, setFormType] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const[isOpen, setIsOpen] = useState(false)

    const toggle = () => {
        setIsOpen(!isOpen)
    }

    function setAlert(sev, msg) {
        setSev(sev);
        setMsg(msg);
    }

    function getForm() {
        if (formType === 'ForgotPassword') {
            return <ForgotPassword setAlert={setAlert} setFormType={setFormType}/>
        }

        if (formType === 'SignUp') {
            return <SignUp{...exampleCard} setAlert={setAlert} setFormType={setFormType} setLoading={setLoading} />
        }

        if (formType === '') {
            if (isPlayerLoggedIn()) {
                return <LoggedInAs/>
            } else {
                return <SignInForm setFormType={setFormType} setAlert={setAlert} formType={formType} setLoading={setLoading}/>;
            }
        }
    }

    return (
        <div style={{background: '#000'}}>
            <HeroBg>
                <ExternalNavbar toggle={toggle} hideAll={true} style={{position: 'fixed', top: 0, left: 0, right: 0}} />
                {loading && <LinearProgress color="inherit" style={{backgroundColor: '#01BF71'}}/>}
                <VideoBg src={video} type="video/mp4"/>
            </HeroBg>
            <CustomizedSnackbars severity={sev} message={msg}/>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
                {getForm()}
            </div>
            <Footer/>
        </div>
    );
};

export default SignIn;