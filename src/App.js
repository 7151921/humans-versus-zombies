import React from 'react';
import './App.css';
import { HashRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Home from "./pages";
import SignIn from "./pages/signin";
import ChangePasswordPage from "./pages/changepassword";
import PictureUpload from "./pages/changeprofilepicture";
import { exampleCard } from "./components/InfoSection/Data";
import { isPlayerLoggedIn } from "./util/helperutils";
import CurrentPlayerCardList from "./components/CurrentPlayerCard";
import ModeratorSection from "./components/ModeratorSection";
import EditProfile from "./components/PlayerSection";
import ZombieFamilyTree from "./pages/zombiefamilytree";

function App() {
    isPlayerLoggedIn();
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Home/>} />
                <Route exact path="/sign-in" element={<SignIn/>} />
                <Route exact path="/change-password" element={<ChangePasswordPage/>} />
                <Route exact path="/change-profile-picture" element={<PictureUpload {...exampleCard} />} />
                <Route exact path="/current-game" element={<CurrentPlayerCardList/>} />
                <Route exact path="/moderator-panel" element={<ModeratorSection/>} />
                <Route exact path="/zombie-tree" element={<ZombieFamilyTree/>} />
                <Route exact path="/update-profile" element={<EditProfile/>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
