import React, {useEffect, useState} from 'react';
import {Grid, Typography} from '@mui/material';
import CalendarListItem from './calendarlistitem';
import axios from "axios";
import {ServicesH1} from "../CardsSection/CardElements";
import {TopLineNoBottom} from "../InfoSection/InfoElements";
import {utcToCurrentLocationTimeZone} from "../../util/helperutils";

const sortEventsByDate = (events) => {
    return events.sort((a, b) => {
        return new Date(a.time) - new Date(b.time);
    });
};

const getUpcomingEvents = (events) => {
    const today = new Date();
    return events.filter((event) => {
        return new Date(event.time) >= today.getTime();
    });
};

const CalendarList = () => {
    const [upcomingEvents, setUpcomingEvents] = useState([])
    useEffect(() => {
        const api = axios.create({baseURL: process.env.REACT_APP_BASE_URL});
        api.get("/list-orientations")
            .then((res) => {
                setUpcomingEvents(getUpcomingEvents(sortEventsByDate(res.data)))
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div style={{minHeight: '100vh', background: '#181A1B'}} id={'orientation'}>
            <div style={{height: '40px'}}/>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div>
                    <TopLineNoBottom>Orientations</TopLineNoBottom>
                    <ServicesH1>Understanding the Mechanics</ServicesH1>
                </div>
            </div>
            <div style={{height: '30px'}}/>
            <Typography variant="body2"
                        sx={{fontSize: 'inherit', overflowWrap: 'break-word', padding: '0 10%', color: '#e4e2de'}}>
                Orientations are required to join the game. During the orientation, you will receive information about
                the game, such as how to play, what the objectives are, and gameplay mechanics. You receive instructions
                on how to properly use any equipment or gear that is required for the game, such as your loadout and
                restricted gear.<br/><br/>
                Attending an orientation is important because it helps to ensure that everyone is aware of the rules and
                how to play the game safely and effectively. It also helps to create a level playing field and ensures
                that all participants are on the same page when the game begins. If a participant does not attend at
                least one orientation, the game engine will mark the player as deceased at the beginning of the game.
            </Typography>
            <div style={{height: '30px'}}/>
            <Grid container direction="column">
                {upcomingEvents.map((event) => (
                    <Grid item key={utcToCurrentLocationTimeZone(event.time)} sx={{padding: '0 10%'}}>
                        <CalendarListItem
                            date={new Date(utcToCurrentLocationTimeZone(event.time))}
                            title={event.location_name}
                            location={event.address}
                            description={event.note}
                        />
                        <div style={{height: '20px'}}/>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};


export default CalendarList;
