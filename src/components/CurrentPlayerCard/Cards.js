import React, {useEffect, useState} from "react";
import axios from "axios";
import {CardContent, Grid, Typography} from '@material-ui/core';
import {CardMedia, Chip, InputLabel, MenuItem, Select} from "@mui/material";
import {Role} from "../../model/models";
import {TopLineNoBottom} from "../InfoSection/InfoElements";
import {StyledFormControl, StyledTextField} from "../StyledTextField";
import {LookupElement, ModServiceCard, ModServicesContainer, ServicesH1} from "./CardElements";
import {makeStyles} from "@mui/styles";
import {Pagination} from "@mui/lab";
import ProfileModal from "./ViewProfileModal";


const useStyles = makeStyles(() => ({
    ul: {
        "& .MuiPaginationItem-root": {
            color: "#e4e2de",
            "&:hover": {
                backgroundColor: "#01BF71"
            }
        },
        '& .Mui-selected': {
            color: '#fff',
            backgroundColor: '#181d1c',
            boxShadow: '0 0 0 2px #01BF71',
        },
    }
}));

const CurrentPlayerCard = ({loading, setLoading}) => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(55);
    const [showPagination, setShowPagination] = useState(false);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const classes = useStyles();
    const [filterGameStatus, setFilterGameStatus] = useState('ALL');
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);

    async function fetchExtraPlayerInfo(uuid) {
        setLoading(true);
        const api = axios.create({
            baseURL: process.env.REACT_APP_BASE_URL,
        });

        return new Promise((resolve, reject) => {
            api.get(`/player-by-id?id=${uuid}`)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    function zombieUUIDLookup(uuid) {
        if (!uuid) {
            return;
        }
        handleProfileModalClose();
        handleProfileClick(items.find((obj) => obj.id === uuid))
    }

    const handleProfileClick = (profile) => {
        fetchExtraPlayerInfo(profile.id).then(r => {
            console.log(r.data)
            setSelectedProfile({...profile, ...r.data})
            setLoading(false);
            setProfileModalOpen(true);
        })
    };

    const handleProfileModalClose = () => {
        setSelectedProfile(null);
        setProfileModalOpen(false);
    };
    const handleChange = (event) => {
        setFilterGameStatus(event.target.value);
    };

    useEffect(() => {
        setLoading(true);
        const api = axios.create({baseURL: process.env.REACT_APP_BASE_URL});
        api
            .get("/in-game-players")
            .then((res) => {
                const body = JSON.parse(res.data.body);
                setItems(body)
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    const presliceLength = items.filter(item => ((item.role && item.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.full_name && item.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.squad_name && item.squad_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())))
        &&
        ((filterGameStatus === 'ALL') ||
            ((item.game_status && (
                    (filterGameStatus === 'ZOMBIE' && item.game_status.toLowerCase().includes('zombie')) ||
                    (filterGameStatus === 'HUMAN' && !item.game_status.toLowerCase().includes('zombie')) ||
                    (filterGameStatus === 'DECEASED' && item.game_status.toLowerCase().includes('deceased'))
                ))
                &&
                (item.role && item.role.toLowerCase() !== 'head_mod' && item.role.toLowerCase() !== 'moderator'))

        )
    )

    const filteredItems = presliceLength.slice(startIndex, endIndex);


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }


    useEffect(() => {
        const windowWidth = window.innerWidth;
        let perPage;
        perPage = windowWidth < 768 ? 10 : 12;
        setItemsPerPage(perPage);
        setShowPagination(presliceLength.length > perPage);
    }, [presliceLength, searchTerm]);


    return (
        <ModServicesContainer
            style={{padding: window.innerWidth > 1000 ? '0 50px' : '0', minHeight: '100vh', maxWidth: '100%'}}>
            <div style={{height: '20px'}}/>
            <div style={{textAlign: "center"}}>
                <div style={{display: "inline-block", textAlign: "left"}}>
                    <TopLineNoBottom>Current Game</TopLineNoBottom>
                    <ServicesH1>Game Roster</ServicesH1>
                </div>
            </div>
            <div style={{height: '20px'}}/>
            <div style={{padding: '0 5%'}}>
                <LookupElement style={{display: 'flex', justifyContent: 'space-between'}}>
                    <StyledTextField
                        label="Search"
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{marginRight: '10px'}}
                    />
                    <div style={{paddingTop: window.innerWidth <= 768 ? '20px' : '0'}}/>
                    <StyledFormControl
                        style={{width: '200px'}}>
                        <InputLabel>Game Status</InputLabel>
                        <Select
                            value={filterGameStatus}
                            label="filterGameStatus"
                            onChange={handleChange}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        backgroundColor: "#1b1e1f",
                                        boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
                                        color: '#e4e2de',
                                        "& .MuiMenuItem-root.Mui-selected": {
                                            backgroundColor: "rgb(79,83,84)"
                                        },
                                        "& .MuiMenuItem-root:hover": {
                                            backgroundColor: '#2b2f31',
                                            transition: 'all 0.2s ease-in-out',
                                            color: '#04ff82'
                                        },
                                        "& .MuiMenuItem-root.Mui-selected:hover": {
                                            backgroundColor: '#2b2f31',
                                            transition: 'all 0.2s ease-in-out',
                                            color: '#04ff82'
                                        }
                                    }
                                }
                            }}
                        >
                            <MenuItem value={"ALL"}>All</MenuItem>
                            <MenuItem value={"HUMAN"}>Human</MenuItem>
                            <MenuItem value={"ZOMBIE"}>Zombie</MenuItem>
                            <MenuItem value={"DECEASED"}>Deceased</MenuItem>
                        </Select>
                    </StyledFormControl>
                </LookupElement>
                <div style={{height: '20px'}}/>
                {!loading && (!items || items.length === 0) &&
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <ServicesH1>No Game Data</ServicesH1>
                    </div>}
                <Grid container spacing={2} style={{display: 'flex', alignItems: 'stretch'}}>
                    {filteredItems.map(card => (
                        <Grid item xs={12} sm={6} md={4} key={card.name}>
                            <ModServiceCard onClick={() => handleProfileClick(card)}>
                                <Grid container direction="row" style={{height: '100%'}} id="my-rendered-view">
                                    <Grid item style={{width: '140px'}}>
                                        <CardMedia component="img" image={card.profile_picture_file_name}
                                                   style={{height: '100%', borderRadius: '5px'}}/>
                                    </Grid>
                                    <Grid item
                                          style={{width: 'calc(100% - 140px)', height: '100%', position: 'relative'}}>
                                        <CardContent>
                                            <Typography variant="h5" component="h2" style={{
                                                color: '#e4e2de',
                                                fontSize: '1.5rem',
                                                paddingBottom: '3%'
                                            }}>
                                                {card.name}
                                            </Typography>
                                            {Role[card.role] === Role.HEAD_MOD || Role[card.role] === Role.MODERATOR ?
                                                <Chip label={Role[card.role]} size="small"
                                                      color={card?.role?.toLowerCase().includes('head') ? "secondary" : "primary"}/> :
                                                <> </>
                                            }
                                            {card?.legendary_player && <Chip
                                                label="Hall of Fame"
                                                size="small"
                                                style={{backgroundColor: '#9a8100', color: '#fff'}}
                                            />}
                                            {Role[card.role] === Role.HEAD_MOD || Role[card.role] === Role.MODERATOR ?
                                                <></> :
                                                <Chip label={card.game_status} size="small"
                                                      color={card?.game_status?.toLowerCase().includes('zombie') ? "error" : "success"}
                                                />
                                            }
                                            <Typography variant="body2" component="p" style={{
                                                color: '#e4e2de',
                                                fontSize: '.75rem',
                                                paddingTop: '3%'
                                            }}>
                                                Squad: {card.squad_name}
                                            </Typography>
                                            {/*<Grid item style={{position: 'absolute', bottom: 0, right: 0}}>*/}
                                            {/*    <OpenInFullIcon style={{color: '#e4e2de'}}/>*/}
                                            {/*</Grid>*/}
                                        </CardContent>
                                    </Grid>
                                </Grid>
                            </ModServiceCard>
                        </Grid>
                    ))}
                </Grid>
            </div>
            <div style={{height: '20px'}}/>
            <div style={{display: "flex", justifyContent: "center", paddingTop: "20px"}}>
                {showPagination && <Pagination
                    count={Math.ceil(presliceLength.length / itemsPerPage)}
                    page={page}
                    classes={{ul: classes.ul}}
                    onChange={(event, value) => setPage(value)}
                />}
            </div>
            <div style={{height: '20px'}}/>
            {selectedProfile && (
                <ProfileModal
                    open={profileModalOpen}
                    onClose={handleProfileModalClose}
                    profile={selectedProfile}
                    zombieUUIDLookup={zombieUUIDLookup}
                />
            )}
        </ModServicesContainer>
    );
};

export default CurrentPlayerCard;
