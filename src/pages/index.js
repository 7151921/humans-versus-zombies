import React, {useState} from 'react'
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import InfoSection from "../components/InfoSection";
import Footer from "../components/Footer";
import {ruleObj, rulesInfoObj} from "../components/InfoSection/Data";
import CardSection from "../components/CardsSection";
import RulesInfoElement from "../components/InfoSection/RulesInfoElement";
import CustomizedSnackbars from "../components/InfoSection/Notification";
import CalendarList from "../components/OrientationSection/calendarlist";
import {LinearProgress} from "@mui/material";

const Home = () => {
    const[isOpen, setIsOpen] = useState(false)


    const toggle = () => {
      setIsOpen(!isOpen)
    }

    const[moderators, setModerators] = useState([])
    const [sev, setSev] = React.useState('');
    const [msg, setMsg] = React.useState('');
    const [loading, setLoading] = useState(false);

    function setAlert(sev, msg) {
        setSev(sev);
        setMsg(msg);
    }

    return(
        <>
            <CustomizedSnackbars severity={sev} message={msg}/>
            <Sidebar isOpen = {isOpen} toggle = {toggle} setAlert={setAlert}/>
            <Navbar toggle = {toggle} setLoading={setLoading} setAlert={setAlert}/>
            {loading && <LinearProgress color="inherit" style={{backgroundColor: '#01BF71'}}/>}
            <HeroSection setAlert={setAlert}/>
            <CardSection loaded={loading} id={"moderators"} />
            <CalendarList/>
            <InfoSection{...rulesInfoObj}  content={<RulesInfoElement{...ruleObj}/>}/>
            <Footer/>
        </>
    )
}

export default Home