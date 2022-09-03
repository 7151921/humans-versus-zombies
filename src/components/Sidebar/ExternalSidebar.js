import React, {useEffect, useState} from 'react';
import {
    CloseIcon,
    Icon,
    SidebarContainer,
    SidebarLink,
    SidebarLinkRoute,
    SidebarMenu,
    SidebarRoute,
    SidebarWrapper,
    SideBtnWrap,
    SubSidebarRoute
} from "./SidebarElements";
import {apiWithHeader, handleLogout, isPlayerLoggedIn} from "../../util/helperutils";
import {Role} from "../../model/models";
import {LinearProgress} from "@mui/material";
import GameCodeDialog from "../ReportTag";
import axios from "axios";
import CustomizedAccordions from "./Accordion";
import {scroller} from "react-scroll";
import {useLocation, useNavigate} from "react-router-dom";


const ExternalSidebar = ({isOpen, toggle, setAlert}) => {
    const [isModerator, setIsModerator] = useState(false);
    const [gameStatus, setGameStatus] = useState(null);
    const [inOzPool, setInOzPool] = useState(false);
    const [inGame, setInGame] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dialogReportTagDialogOpen, setReportTagDialogOpen] = useState(false);
    const location = useLocation().pathname;
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            const playerData = JSON.parse(localStorage.getItem('playerData'))?.value;
            const role = playerData?.role ?? 'PLAYER'
            const gameEngine = playerData?.game_engine
            setIsModerator(Role[role] === Role.HEAD_MOD || Role[role] === Role.MODERATOR)
            setGameStatus(gameEngine?.game_status)
            setInOzPool(gameEngine?.in_original_zombie_pool)
            setInGame(gameEngine?.game_status !== undefined && gameEngine?.game_status !== null)
        }
    }, [isOpen])

    function handleToggleOzPool(event) {
        event.stopPropagation();
        setLoading(true)
        const api = apiWithHeader(navigate)
        if (api === null) {
            setLoading(false)
            return
        }
        api.post('/toggle-oz')
            .then((res) => {
                setInOzPool(res.data?.in_oz_pool)
                let playerData = JSON.parse(localStorage.getItem('playerData'));
                playerData.value.game_engine.in_original_zombie_pool = res.data?.in_oz_pool;
                localStorage.setItem('playerData', JSON.stringify(playerData));
                setLoading(false)
            })
            .catch((error) => {
                console.log(error);
                setLoading(false)
            });
    }

    function handleOnLogout(event) {
        handleLogout(event, navigate)
    }

    function showLoginLogout() {
        if (isPlayerLoggedIn()) {
            return <SidebarRoute to="/" onClick={handleOnLogout}>Logout</SidebarRoute>;
        }
        return <SidebarRoute to="/sign-in">Sign In</SidebarRoute>;
    }

    const handleReportTagDialogOpenDialog = (event) => {
        event.stopPropagation()
        setReportTagDialogOpen(true);
    }

    const handleReportTagDialogCloseDialog = (event) => {
        event.stopPropagation()
        setReportTagDialogOpen(false);
    }

    const handleJoinGame = async (event) => {
        event.preventDefault();
        if (!isPlayerLoggedIn()) {
            navigate('/sign-in')
        }
        try {
            setLoading(true)
            await joinGame(JSON.parse(localStorage.getItem('accessToken')).value, Date.now());
            setAlert('success', 'You have joined the game!')
            setTimeout(() => {
                setLoading(false)
                navigate('/');
            }, 250);
        } catch (err) {
            setAlert('error', 'An Error Occured')
            console.log(err.message)
            setLoading(false)
        }
    };

    function joinGame(token) {
        const api = axios.create({
            baseURL: process.env.REACT_APP_BASE_URL,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        let playerData = JSON.parse(localStorage.getItem('playerData'));
        console.log(playerData)
        return new Promise((resolve, reject) => {
            api.post('/join-game')
                .then(res => {
                    let playerData = JSON.parse(localStorage.getItem('playerData'));
                    playerData.value.game_engine = res.data.game_engine;
                    localStorage.setItem('playerData', JSON.stringify(playerData));
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    const scrollToRules = (divId, offset= -70) => {
        setTimeout(() => {
            scroller.scrollTo(divId, {
                smooth: true,
                duration: 500, // set the duration of the scroll animation
                offset: offset, // adjust the scroll offset as needed
            });
        }, location === '/' ? "0" : "250")

    };
    console.log(location)

    return (
        <div>
            <GameCodeDialog open={dialogReportTagDialogOpen} onClose={handleReportTagDialogCloseDialog}/>
            <SidebarContainer isOpen={isOpen} onClick={toggle}>
                <Icon onClick={toggle}>
                    <CloseIcon/>
                </Icon>
                {loading && <LinearProgress color="inherit" style={{
                    backgroundColor: '#01BF71',
                    position: 'absolute',
                    top: '80px',
                    left: 0,
                    right: 0
                }}/>}
                <SidebarWrapper>
                    {isPlayerLoggedIn() &&
                        <CustomizedAccordions isOpen={isOpen} userManagement={
                            <div>
                            <SubSidebarRoute to="/change-profile-picture" onClick={toggle}>Change Profile
                                    Picture</SubSidebarRoute>
                                <SubSidebarRoute to="/change-password" onClick={toggle}>Change
                                    Password</SubSidebarRoute>
                                <SubSidebarRoute to="/update-profile" onClick={toggle}>Edit Profile</SubSidebarRoute>
                            </div>
                        }/>}
                    <SidebarMenu>
                        {isModerator &&
                            <SidebarLinkRoute to="/moderator-panel" onClick={toggle}> Dashboard </SidebarLinkRoute>}
                        <SidebarLinkRoute to="/" onClick={() => scrollToRules("moderators", -80)}> Moderators </SidebarLinkRoute>
                        <SidebarLinkRoute to="/" onClick={() => scrollToRules("orientation")}> Orientations </SidebarLinkRoute>
                        <SidebarLinkRoute to="/" onClick={() => scrollToRules("rules")}> Rules </SidebarLinkRoute>
                        {isPlayerLoggedIn() && !isModerator && (gameStatus && gameStatus !== 'HUMAN' && gameStatus !== 'DECEASED') &&
                            <SidebarLink to="/" onClick={handleReportTagDialogOpenDialog}> Report Tag </SidebarLink>}
                        {isPlayerLoggedIn() && !isModerator && gameStatus === 'HUMAN' &&
                            <SidebarLink to="/" onClick={handleToggleOzPool}> {inOzPool ? 'Leave' : 'Join'} Oz
                                Pool </SidebarLink>}
                        {isPlayerLoggedIn() && !inGame &&
                            <SidebarLink to="/" onClick={handleJoinGame}> Join Game </SidebarLink>}
                        <SidebarLinkRoute to="/zombie-tree"> Zombie Tree </SidebarLinkRoute>
                        {!isPlayerLoggedIn() &&
                            <SidebarLinkRoute to="/sign-up" onClick={toggle}> Sign Up </SidebarLinkRoute>}
                    </SidebarMenu>
                    <div style={{height: '20px'}}/>

                    <SideBtnWrap>
                        {showLoginLogout()}
                    </SideBtnWrap>
                </SidebarWrapper>
            </SidebarContainer>

        </div>
    );
};

export default ExternalSidebar;