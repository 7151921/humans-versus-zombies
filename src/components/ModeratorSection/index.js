import CustomizedSnackbars from "../InfoSection/Notification";
import Sidebar from "../Sidebar";
import React, {useEffect, useState} from "react";
import {LinearProgress} from "@mui/material";
import ModeratorDashboard from "./ModeratorPanel";


const ModeratorSection = () => {
    const[isOpen, setIsOpen] = useState(false)

    const toggle = () => {
      setIsOpen(!isOpen)
    }

    const [error, setError] = useState(null);
    const [sev, setSev] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = React.useState(false);


    function setAlert(sev, msg) {
        setSev(sev);
        setMsg(msg);
        setTimeout(() => {
            setSev(null);
            setMsg(null);
        }, 1500);
    }

    return(
        <>
            <>
                <Sidebar isOpen = {isOpen} toggle = {toggle}/>
                {/*<Navbar toggle = {toggle}/>*/}
                {loading && <LinearProgress color="inherit" style={{backgroundColor: '#01BF71'}}/>}
                <CustomizedSnackbars severity={sev} message={msg}/>
                <ModeratorDashboard setAlert={setAlert}/></>
            {/*{isModerator() && <> <CustomizedSnackbars severity={sev} message={msg}/>*/}
            {/*<Sidebar isOpen = {isOpen} toggle = {toggle}/>*/}
            {/*/!*<Navbar toggle = {toggle}/>*!/*/}
            {/*{loading && <LinearProgress color="inherit" style={{backgroundColor: '#01BF71'}}/>}*/}
            {/*<ModeratorDashboard/></>}*/}
        </>
    )
}

export default ModeratorSection