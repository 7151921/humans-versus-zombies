import React from 'react';
import {Box, Card, Grid, Typography} from '@mui/material';

const CalendarListItem = ({ date, title, location, description }) => {
    const day = date.toLocaleString('en-US', { weekday: 'short' });
    const dateNum = date.getDate();
    const monthYear = date.toLocaleString('en-US', { month: 'short', day: 'numeric' });
    const time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    // Handle click on address to open in Google Maps
    const handleClickAddress = () => {
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title+ " " + location)}`;
        window.open(mapsUrl, '_blank');
    };

    return (
        <Card sx={{ display: 'flex', backgroundColor: "#0F1111"}}>
            <Grid container direction="row" sx={{ flexWrap: 'wrap' }}>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'flex-start', p: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mr: 3, color: '#e4e2de' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 'inherit' }}>
                            {day.toUpperCase()}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontSize: 'inherit' }}>{dateNum}</Typography>
                        </Box>
                    </Box>
                    <Box >
                        <Typography variant="body2" color="text.secondary" sx={{color: '#89918F'}}>
                            {`${monthYear} @ ${time} (${process.env.REACT_APP_TIME_ZONE})`}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0, color: '#e4e2de' }}>
                            {title}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="primary"
                            sx={{ cursor: 'pointer', mt: 0 }}
                            onClick={handleClickAddress}
                        >
                            {location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 'inherit', overflowWrap: 'break-word', color: '#89918F' }}>
                            {description}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Card>
    );
};

export default CalendarListItem;
