import React, {useState} from 'react'
import Footer from "../components/Footer";
import CustomizedSnackbars from "../components/InfoSection/Notification";
import FamilyTree from "../components/ReportTag/zombietree";
import ExternalNavbar from "../components/Navbar/ExternalNav";
import {TopLineNoBottom} from "../components/InfoSection/InfoElements";
import {ServicesH1} from "../components/CardsSection/CardElements";
import {TreeContainer} from "../components/ReportTag/ReportTagElements";
import {LinearProgress} from "@mui/material";
import ExternalSidebar from "../components/Sidebar/ExternalSidebar";

const ZombieFamilyTree = () => {
    const[isOpen, setIsOpen] = useState(false)
    const [sev, setSev] = React.useState('');
    const [msg, setMsg] = React.useState('');
    const [loading, setLoading] = useState(false);
    const [resetToggle, setResetToggle] = useState(false);

    const toggle = () => {
      setIsOpen(!isOpen)
    }


    function setAlert(sev, msg) {
        setSev(sev);
        setMsg(msg);
    }

    return(
        <>
            <CustomizedSnackbars severity={sev} message={msg}/>
            <ExternalSidebar isOpen = {isOpen} toggle = {toggle}/>
            <ExternalNavbar toggle = {toggle} setLoading={setLoading} setAlert={setAlert}/>
            {loading && <LinearProgress color="inherit" style={{backgroundColor: '#01BF71'}}/>}
            <TreeContainer>
                <div style={{height: '40px'}}/>
                <div style={{textAlign: "center"}}>
                    <div style={{display: "inline-block", textAlign: "left"}}>
                        <TopLineNoBottom>Zombie</TopLineNoBottom>
                        <ServicesH1>Family Tree</ServicesH1>
                    </div>
                </div>
            </TreeContainer>
            <FamilyTree setLoading={setLoading} setAlert={setAlert} resetToggle={resetToggle} style={{minHeight: '100vh'}}/>
            <Footer/>
        </>
    )
}

export default ZombieFamilyTree