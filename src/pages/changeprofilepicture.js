import React, {useState} from "react";
import CustomizedSnackbars from "../components/InfoSection/Notification";
import {Card, LinearProgress} from "@mui/material";
import {HeroBg, VideoBg} from "../components/Cognito/HeroElements";
import video from "../video/background.gif";
import Navbar from "../components/Navbar";
import {isPlayerLoggedIn} from "../util/helperutils";
import axios from "axios";
import {XForm, XFormContent, XFormWrap} from "../components/Cognito/SigninElements";
import {
    ExampleIcon,
    ExampleServiceCard,
    ExampleServicesP,
    ExampleServicesWrapper,
    ServicesH2
} from "../components/CardsSection/CardElements";
import ImageUpload from "../components/Cognito/ImageUploader";
import StyledButton from "../components/StyledButton";
import {useNavigate} from "react-router-dom";
import Footer from "../components/Footer";


const PictureUpload = ({
                           header,
                           profilePictureTitle,
                           profilePictureMessage,
                           img,
                       }) => {
    const [sev, setSev] = React.useState('');
    const [msg, setMsg] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const[isOpen, setIsOpen] = useState(false)
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const toggle = () => {
        setIsOpen(!isOpen)
    }

    if (!isPlayerLoggedIn()) {
        navigate('/sign-in')
    }

    function getExampleCardSection() {
        return (<XFormWrap>
            <XFormContent>
                <XForm onSubmit={handleImageUpload}>
                    <ExampleServicesWrapper>
                        <ExampleServiceCard>
                            {!image && <ServicesH2>{header} a {profilePictureTitle}</ServicesH2>}
                            {image && <div style={{height: '20px'}}/>}
                            {!image && <ExampleIcon src={img}/>}
                            {image && <ExampleIcon src={URL.createObjectURL(image)} alt='Preview'/>}
                            <div style={{height: '10px'}}/>
                            <ImageUpload setImage={setImage} setAlert={setAlert}/>
                            <div style={{height: '20px'}}/>
                            <ExampleServicesP
                                style={{paddingBottom: "10px"}}>{profilePictureMessage}</ExampleServicesP>
                            <div style={{height: '20px'}}/>
                            {image && (<StyledButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                text={'Accept'}
                            />)}
                            <div style={{height: '20px'}}/>
                        </ExampleServiceCard>
                    </ExampleServicesWrapper>
                </XForm>
            </XFormContent>
        </XFormWrap>)
    }


    const handleImageUpload = async (event) => {
        event.preventDefault();
        setLoading(true)
        const reader = new FileReader();
        reader.readAsDataURL(image);

        reader.onload = async () => {
            const base64Image = reader.result.split(',')[1];
            try {
                const body = { 'picture_bytes': base64Image };
                const accessToken = JSON.parse(localStorage.getItem('accessToken')).value;
                const api = axios.create({
                    baseURL: process.env.REACT_APP_BASE_URL,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                });

                api.post('/profile-picture', body)
                    .then(res => {
                        setAlert('success', 'Profile Picture has been updated');
                        setTimeout(() => {
                            setLoading(false)
                            navigate('/');
                        }, 1500);
                    })
                    .catch(err => {
                        setLoading(false)
                        setAlert('error', err.message);
                    })
            } catch (err) {
                setLoading(false)
                setAlert('error', err.message);
            }
        };
    };

    function setAlert(sev, msg) {
        setSev(sev);
        setMsg(msg);
    }

    return (
        <div style={{background: '#000'}}>
            <HeroBg>
                <Navbar toggle={toggle} hideAll={true} style={{position: 'fixed', top: 0, left: 0, right: 0}} />
                {loading && <LinearProgress color="inherit" style={{backgroundColor: '#01BF71'}}/>}
                <VideoBg src={video} type="video/mp4"/>
            </HeroBg>
            <CustomizedSnackbars severity={sev} message={msg}/>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
                <div style={{width: 500}}>
                    <Card>
                        {getExampleCardSection()}
                    </Card>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default PictureUpload;