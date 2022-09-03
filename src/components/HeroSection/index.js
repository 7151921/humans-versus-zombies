import React, {useEffect, useState} from "react";
import {Button} from "../ButtonElement";
import {useNavigate} from "react-router-dom";

import {
    ArrowForward,
    ArrowRight,
    HeroBg,
    HeroBtnWrapper,
    HeroContainer,
    HeroContent,
    HeroH1,
    HeroP,
    VideoBg,
} from "./HeroElementsV2";
import video from "../../video/background.gif";
import axios from "axios";
import {LinearProgress} from "@mui/material";
import {isPlayerLoggedIn} from "../../util/helperutils";

interface GameData {
    start_time: string;
    registration_open: boolean;
    zombie_count: number;
    human_count: number;
}

const HeroSection = ({setAlert}) => {
    let navigate = useNavigate();
    const routeChange = () => {
        let path = '/current-game';
        navigate(path);
    }

    const [hover, setHover] = useState(false);
    const onHover = () => {
        setHover(!hover);
    };
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [hours, setHours] = useState(0);
    const [days, setDays] = useState(0);
    const [gameTime, setGameTime] = useState();
    const [joined, setJoined] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [humanCount, setHumanCount] = useState(0);
    const [zombieCount, setZombieCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // window.scrollTo(0, 0);
        setLoading(true)
        const api = axios.create({baseURL: process.env.REACT_APP_BASE_URL})
        api.get('/game-data').then(res => {
            const data: GameData = res.data;
            console.log(data)
            localStorage.removeItem('registration_open');
            const currentTimeUTC = Date.UTC(
                new Date().getUTCFullYear(),
                new Date().getUTCMonth(),
                new Date().getUTCDate(),
                new Date().getUTCHours(),
                new Date().getUTCMinutes(),
                new Date().getUTCSeconds(),
                new Date().getUTCMilliseconds()
            );

            const startTimeUTC = new Date(data.start_time + 'Z').getTime();
            const timeDifference = currentTimeUTC - startTimeUTC;
            setGameTime(timeDifference)
            setHumanCount(data.human_count)
            setZombieCount(data.zombie_count)
            setJoined(data.human_count + data.zombie_count)
            setGameStarted(data.has_started)
            if (!isNaN(startTimeUTC)) {
                localStorage.setItem('registration_open', data.registration_open);
            }
            setLoading(false)
        }).catch(error => {
            console.log(error)
            setAlert('error', process.env.REACT_APP_GENERIC_ERROR)
            setError(error);
            setLoading(false)
        })
    }, []);

    function make_value_positive(value) {
        return value < 0 ? value * -1 : value;
    }

    function use_ceiling_or_floor(milliseconds) {
        return gameTime < 0 ? Math.ceil(milliseconds) : Math.floor(milliseconds);
    }

    useEffect(() => {
        let myInterval = setInterval(() => {
            if (isNaN(gameTime)) {
                return
            }
            let ms = 86400000;
            let ms1 = 3600000;
            setGameTime(currentDiff => currentDiff + 1000)
            setDays(make_value_positive(use_ceiling_or_floor(gameTime / ms)))
            setHours(make_value_positive(use_ceiling_or_floor((gameTime % ms) / ms1)))
            setMinutes(make_value_positive(use_ceiling_or_floor(((gameTime % ms) % ms1) / (60000))))
            setSeconds(make_value_positive(use_ceiling_or_floor((((gameTime % ms) % ms1) % (60000)) / 1000)))
        }, 1000)
        return () => {
            clearInterval(myInterval);
        };
    });

    function getGameTimeLabel() {

        return <div style={{whiteSpace: 'nowrap', overflow: 'hidden', fontSize: '80%'}}>
            <HeroP>Days: {days} Hrs: {hours} Mins: {minutes} Sec: {seconds}</HeroP>
        </div>;
    }

    function getNotStartedHero() {
        return <div>
            <HeroH1>Players Joined: {joined}</HeroH1>
            <HeroP>
                {!isPlayerLoggedIn() && <label>Login and join the game.</label>}
            </HeroP>
            {gameTime <= 0 ? <>
                {getGameTimeLabel()}
            </> : <HeroP>Game will be starting soon</HeroP>
            }
        </div>;
    }

    function getStartedHero() {
        return <div>
            <HeroH1>{process.env.REACT_APP_HUMAN}: {humanCount}</HeroH1>
            <HeroH1>{process.env.REACT_APP_ZOMBIE}: {zombieCount}</HeroH1>
            {getGameTimeLabel()}
        </div>;
    }

    function hasGame() {
        return <>
            {gameStarted ? getStartedHero() : getNotStartedHero()}
            <HeroBtnWrapper>
                <Button to="/#" onClick={routeChange}
                        onMouseEnter={onHover}
                        onMouseLeave={onHover} primary="true" dark="true">
                    View Current Game {hover ? <ArrowForward/> : <ArrowRight/>}
                </Button>
            </HeroBtnWrapper>
        </>
    }

    function getHeroContent() {
        return (isNaN(gameTime) ? <>
            <HeroH1>No Active Game</HeroH1>
            <HeroP>
                <label>Watch your email for game updates</label>
            </HeroP>
        </> : hasGame());
    }

    return (
        <HeroContainer id="home">
            <HeroBg>
                {loading && <LinearProgress color="inherit" style={{backgroundColor: '#01BF71'}}/>}
                <VideoBg src={video} type="video/mp4"/>
            </HeroBg>
            <HeroContent>
                {getHeroContent()}
            </HeroContent>
        </HeroContainer>
    );
};

export default HeroSection;