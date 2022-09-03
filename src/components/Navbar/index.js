import React, {useEffect, useState} from "react";
import {FaBars} from 'react-icons/fa'
import {animateScroll as scroll} from 'react-scroll';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MUIButton from "@material-ui/core/Button";

import {
    MobileIcon,
    Nav,
    NavbarContainer,
    NavBtn,
    NavBtnLink,
    NavHiddenBtnLink,
    NavItem,
    NavLinks,
    NavLogo,
    NavMenu,
    NavRoute
} from "./NavbarElements";
import {LinkText} from "../Cognito/SigninElements";
import {apiWithHeader, getName, handleLogout, isPlayerLoggedIn} from "../../util/helperutils";
import axios from "axios";
import GameCodeDialog from "../ReportTag";
import {useNavigate} from "react-router-dom";

const Navbar = ({toggle, hideAll, setLoading, setAlert}) => {
    const [registrationOpen, setRegistrationOpen] = useState(false);
    const [gameEngine, setGameEngine] = useState(null);
    const [playerData, setPlayerData] = useState(null);
    const [gameStatus, setGameStatus] = useState('HUMAN');
    const [inOzPool, setInOzPool] = useState(false);
    const [joinGameClicked, setJoinGameClicked] = useState(false);
    const [dialogReportTagDialogOpen, setReportTagDialogOpen] = useState(false);
    const navigate = useNavigate();

    const handleReportTagDialogOpenDialog = () => {
        setReportTagDialogOpen(true);
    }

    const handleReportTagDialogCloseDialog = () => {
        setReportTagDialogOpen(false);
    }

    const toggleHome = () => {
        scroll.scrollToTop();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)
        if (!isPlayerLoggedIn()) {
            navigate('/sign-in');
        }
        try {
            await joinGame(JSON.parse(localStorage.getItem('accessToken')).value, Date.now());
            setAlert('success', 'You have joined the game!')
            setJoinGameClicked(!joinGameClicked)
            setLoading(false)
        } catch (err) {
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

    useEffect(() => {
        renderBasedOnGameData()
    }, [joinGameClicked]);

    useEffect(() => {
        renderBasedOnGameData();
    }, []);

    function renderBasedOnGameData() {
        setPlayerData(JSON.parse(localStorage.getItem('playerData'))?.value)
        const isRegistrationOpen = (localStorage.getItem('registration_open') === 'true');
        setRegistrationOpen(isRegistrationOpen);
        const ge = JSON.parse(localStorage.getItem('playerData'))?.value?.game_engine;
        setGameEngine(ge ?? null);
        setGameStatus(ge?.game_status)
        setInOzPool(ge?.in_original_zombie_pool)
    }

    isPlayerLoggedIn()

    function handleOnLogout(event) {
        handleLogout(event, navigate)
    }

    function getNavBtn() {
        if (isPlayerLoggedIn()) {
            return <div className="dropdown">
                <MUIButton variant="contained" endIcon={<ArrowDropDownIcon/>} className="dropbtn"
                           style={{backgroundColor: 'transparent'}}>
                    {getName()}
                </MUIButton>
                <div className="dropdown-content">
                    <LinkText to="/change-profile-picture"> Change Profile Picture </LinkText>
                    <LinkText to="/change-password">Change Password</LinkText>
                    <LinkText to="/update-profile">Edit Profile</LinkText>
                    <LinkText to="/humans-versus-zombies" onClick={handleOnLogout}>Logout</LinkText>
                </div>
            </div>
        }

        return <NavBtnLink to="/sign-in">Sign In</NavBtnLink>;
    }

    function handleToggleOzPool() {
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

    function getNavbarContainer() {
        return <>
            <NavMenu>
                <GameCodeDialog open={dialogReportTagDialogOpen} onClose={handleReportTagDialogCloseDialog} />
                <NavItem>
                    {playerData && ((playerData?.role?.toLowerCase() ?? '') === 'head_mod' || (playerData?.role?.toLowerCase() ?? '') === 'moderator') &&
                        <NavRoute to="/moderator-panel"
                                  smooth={true}
                                  duration={500}
                                  spy={true}
                                  exact='true'
                                  offset={-80}>Dashboard</NavRoute>
                    }
                </NavItem>
                <NavItem>
                    <NavLinks to="moderators"
                              smooth={true}
                              duration={500}
                              spy={true}
                              exact='true'
                              offset={-80}>Our Mods</NavLinks>
                </NavItem>
                <NavItem>
                    <NavLinks to="orientation"
                              smooth={true}
                              duration={500}
                              spy={true}
                              exact='true'
                              offset={-70}>Orientation</NavLinks>
                </NavItem>
                <NavItem>
                    <NavLinks to="rules"
                              smooth={true}
                              duration={500}
                              spy={true}
                              exact='true'
                              offset={-70}>Rules</NavLinks>
                </NavItem>
                <div className="dropdown">
                    <MUIButton variant="contained" endIcon={<ArrowDropDownIcon/>} className="dropbtn"
                               style={{backgroundColor: 'transparent'}}>
                        In-Game
                    </MUIButton>
                    <div className="dropdown-content">
                        {/*<LinkText href="#">Upgrade Store</LinkText>*/}
                        {/*<LinkText href="#">Open World</LinkText>*/}
                        <LinkText to="/zombie-tree">Zombie Tree</LinkText>
                    </div>
                </div>
                <NavBtn>
                    {playerData && (playerData.role?.toLowerCase() ?? '') === 'player' && gameStatus === 'HUMAN' &&
                        <NavHiddenBtnLink onClick={handleToggleOzPool} to="/">{inOzPool ? 'Leave': 'Join'} Oz Pool</NavHiddenBtnLink>
                    }
                </NavBtn>
                <NavBtn>
                    {!((playerData?.role?.toLowerCase() ?? '') === 'head_mod' || (playerData?.role?.toLowerCase() ?? '') === 'moderator') && (gameStatus && gameStatus !== 'HUMAN' && gameStatus !== 'DECEASED') &&
                        <NavHiddenBtnLink onClick={handleReportTagDialogOpenDialog} to="/">Report Tag</NavHiddenBtnLink>}
                </NavBtn>
                <NavBtn>
                    {registrationOpen && !gameEngine && <NavHiddenBtnLink onClick={handleSubmit} to="#">Join Game
                    </NavHiddenBtnLink>}
                </NavBtn>
            </NavMenu>
        </>;
    }

    return (
        <>
            <Nav>
                <NavbarContainer>
                    <NavLogo to='/' onClick={toggleHome}>{process.env.REACT_APP_GAME_TITLE}</NavLogo>
                    <MobileIcon to='/' onClick={toggle}>
                        <FaBars/>
                    </MobileIcon>
                    {!hideAll && getNavbarContainer()}
                    <NavBtn>
                        {getNavBtn()}
                    </NavBtn>
                </NavbarContainer>
            </Nav>
        </>
    )
}

export default Navbar