import CustomizedSnackbars from "../InfoSection/Notification";
import Footer from "../Footer";
import React, {useState} from "react";
import CurrentPlayerCard from "./Cards";
import {LinearProgress} from "@mui/material";
import ExternalNavbar from "../Navbar/ExternalNav";
import ExternalSidebar from "../Sidebar/ExternalSidebar";


const CurrentPlayerCardList = () => {
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
    }

    return(
        <>
            <CustomizedSnackbars severity={sev} message={msg}/>
            <ExternalSidebar isOpen = {isOpen} toggle = {toggle} setAlert={setAlert}/>
            <ExternalNavbar toggle = {toggle} setLoading={setLoading}/>
            {loading && <LinearProgress color="inherit" style={{backgroundColor: '#01BF71'}}/>}
            <CurrentPlayerCard loading={loading} setLoading={setLoading}/>
            <Footer/>
        </>
    )
}

export default CurrentPlayerCardList