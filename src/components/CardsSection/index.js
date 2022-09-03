import React, {useEffect, useState} from "react";
import {ModServiceCard, ModServicesContainer, ServicesH1,} from "./CardElements";
import {formatPhoneNumber, getPhoneInstructions} from "../../util/helperutils";
import axios from "axios";
import {CardContent, Grid, Typography} from '@material-ui/core';
import {CardMedia} from "@mui/material";
import {Role} from "../../model/models";
import {TopLineNoBottom} from "../InfoSection/InfoElements";


const CardSection = () => {
    const [items, setItems] = useState([]);
    useEffect(() => {
        const api = axios.create({ baseURL: process.env.REACT_APP_BASE_URL });
        api
            .get("/moderator")
            .then((res) => {
                setItems(JSON.parse(res.data.body));
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <ModServicesContainer id="moderators" style={{padding: window.innerWidth > 1000 ? '0 50px' : '0'}}>
            <div style={{height: '40px'}}/>
            <div>
                <TopLineNoBottom>Moderator Team</TopLineNoBottom>
                <ServicesH1>Got a Question?</ServicesH1>
            </div>
            <div style={{height: '20px'}}/>
            <Grid container spacing={2} style={{maxWidth: '100%'}}>
                {items.map(card => (
                    <Grid item xs={12} sm={6} md={4} key={card.name}>
                        <ModServiceCard>
                            <Grid container direction="row">
                                <Grid item style={{ width: '140px' }}>
                                    <CardMedia component="img" image={card.profile_picture_file_name} style={{ height: '100%', borderRadius: '10px' }} />
                                </Grid>
                                <Grid item style={{ width: 'calc(100% - 140px)' }}>
                                    <CardContent>
                                        <Typography variant="h5" component="h2" style={{color: '#e4e2de'}}>
                                            {card.name}
                                        </Typography>
                                        <Typography variant="body2" component="p" style={{color: '#e4e2de'}}>
                                            {Role[card.role]}
                                        </Typography>
                                        <Typography variant="body2" component="p" style={{color: '#e4e2de'}}>
                                            Contact: {formatPhoneNumber(card.phone)}
                                        </Typography>
                                        <Typography variant="body2" component="p" style={{color: '#e4e2de'}}>
                                            Instructions: {getPhoneInstructions(card.phone)}
                                        </Typography>
                                    </CardContent>
                                </Grid>
                            </Grid>
                        </ModServiceCard>
                    </Grid>
                ))}
            </Grid>
            <div style={{height: '20px'}}/>
        </ModServicesContainer>
    );
};

export default CardSection;
