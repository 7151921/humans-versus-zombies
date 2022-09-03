import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import EmailIcon from '@mui/icons-material/Email';
import GroupsIcon from '@mui/icons-material/Groups';
import FolderSharedIcon from '@mui/icons-material/FolderShared';

export const mainListItems = (setSelectedItem, navigate) => {
    return (
        <React.Fragment>
            <ListItemButton onClick={() => navigate('/')}>
                <ListItemIcon >
                    <HomeIcon style={{fill: '#898887'}}/>
                </ListItemIcon>
                <ListItemText primary="Home" style={{color: '#898887'}}/>
            </ListItemButton>
            <ListItemButton onClick={() => setSelectedItem(1)}>
                <ListItemIcon>
                    <DashboardIcon style={{fill: '#898887'}}/>
                </ListItemIcon>
                <ListItemText primary="Dashboard" style={{color: '#898887'}}/>
            </ListItemButton>
            <ListItemButton onClick={() => setSelectedItem(2)}>
                <ListItemIcon>
                    <SportsKabaddiIcon  style={{fill: '#898887'}}/>
                </ListItemIcon>
                <ListItemText primary="Oz Selection" style={{color: '#898887'}}/>
            </ListItemButton>
            <ListItemButton onClick={() => setSelectedItem(3)}>
                <ListItemIcon>
                    <GroupsIcon style={{fill: '#898887'}}/>
                </ListItemIcon>
                <ListItemText primary="Orientations" style={{color: '#898887'}}/>
            </ListItemButton>
            <ListItemButton onClick={() => setSelectedItem(4)}>
                <ListItemIcon>
                    <FolderSharedIcon style={{fill: '#898887'}}/>
                </ListItemIcon>
                <ListItemText primary="Players" style={{color: '#898887'}}/>
            </ListItemButton>
            {/*<ListItemButton onClick={() => setSelectedItem(4)}>*/}
            {/*    <ListItemIcon>*/}
            {/*        <ShoppingCartIcon style={{fill: '#898887'}}/>*/}
            {/*    </ListItemIcon>*/}
            {/*    <ListItemText primary="Game Items" style={{color: '#898887'}}/>*/}
            {/*</ListItemButton>*/}
            <ListItemButton onClick={() => setSelectedItem(5)}>
                <ListItemIcon>
                    <EmailIcon style={{fill: '#898887'}}/>
                </ListItemIcon>
                <ListItemText primary="Email" style={{color: '#898887'}}/>
            </ListItemButton>
        </React.Fragment>
    );
};
