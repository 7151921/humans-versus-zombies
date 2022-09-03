import React, {useState} from "react";
import {Card} from "@mui/material";
import {Form, FormContent, FormH1, FormH3, FormWrap, LinkText, XForm, XFormContent, XFormWrap} from "./SigninElements";
import {StyledTextField} from "../StyledTextField";
import StyledButton from "../StyledButton";
import {
    ExampleIcon,
    ExampleServiceCard,
    ExampleServicesP,
    ExampleServicesWrapper,
    ServicesH2
} from "../CardsSection/CardElements";
import poolData from "./CognitoClient";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import axios from "axios";
import {checkPasswordRequirements} from "../../util/helperutils";
import ImageUpload from "./ImageUploader";
import {signIn} from "./index";
import {useNavigate} from "react-router-dom";


const SignUp = ({
                    setAlert,
                    setFormType,
                    header,
                    setLoading,
                    profilePictureTitle,
                    profilePictureMessage,
                    img,
                }) => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [stage, setStage] = useState(1);
    const [confirmationCode, setConfirmationCode] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const passwordValidation = checkPasswordRequirements(password);

        if (!passwordValidation.isValid) {
            setAlert('error', passwordValidation.error);
            return
        }

        poolData.signUp(username, password, [{
            Name: 'email', Value: email
        }], null, (err, data) => {
            if (err) {
                if (err.code === 'UserLambdaValidationException') {
                    setAlert('error', 'Email is already registered.')
                } else {
                    console.log(err)
                    setAlert('error', err.message.toLowerCase() === 'user already exists' ? 'Username is taken.' : err.message);
                }
            } else {
                setStage(2)
            }
        });
    };

    function createdAccount(login_time) {
        const body = {
            name: name,
            email: email
        }

        const accessToken = JSON.parse(localStorage.getItem('accessToken')).value;

        const api = axios.create({
            baseURL: process.env.REACT_APP_BASE_URL,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        api.post('/create-account', body)
            .then(res => {
                localStorage.setItem('playerData', JSON.stringify({
                    value: res,
                    timestamp: login_time
                }));
            })
            .catch(err => {
                setAlert('error', err.message);
            })
    }

    const handleVerification = async (event) => {
        event.preventDefault();
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: username,
            Pool: poolData
        });

       await cognitoUser.confirmRegistration(confirmationCode, false,  async (err, result) => {
           if (err) {
               console.error(err);
           } else {
               try {
                   let currentTime = Date.now();
                   await signIn(setLoading, setAlert, username, password);
                   createdAccount(currentTime)
                   setStage(3)
               } catch (err) {
                   setAlert('error', err.message);
               }
           }
       });
    };

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
                        setAlert('success', 'Your account is officially created!');
                        setTimeout(() => {
                            setLoading(false)
                            navigate('/');
                        }, 250);
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

    function signup() {
        return <FormWrap>
            <FormContent>
                <Form onSubmit={handleSubmit}>
                    <FormH1>Sign Up</FormH1>
                    <StyledTextField
                        label="Username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        margin="normal"
                        fullWidth
                    />
                    <StyledTextField
                        label="Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        margin="normal"
                        fullWidth
                    />
                    <StyledTextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        margin="normal"
                        fullWidth
                    />
                    <StyledTextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        margin="normal"
                        fullWidth
                    />
                    <div style={{height: '20px'}}/>
                    <StyledButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        text={'Sign In'}
                    />
                    <div style={{height: '20px'}}/>
                    <div>
                        <LinkText href="#" onClick={(e) => {
                            e.preventDefault();
                            setFormType('');
                        }}>Have an Account? Sign In</LinkText>
                    </div>
                    <div style={{height: '10px'}}/>
                    <div>
                        <LinkText href="#" onClick={(e) => {
                            e.preventDefault();
                            setFormType('ForgotPassword');
                        }}>Forgot password?</LinkText>
                    </div>
                </Form>
            </FormContent>
        </FormWrap>;
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

    function verifyUser() {
        return (<FormWrap>
            <FormContent>
                <Form onSubmit={handleVerification}>
                    <FormH1>Confirm Your Account</FormH1>
                    <FormH3> You will receive a verification code to the email you signed up with.</FormH3>
                    <StyledTextField
                        value={confirmationCode}
                        onChange={(event) => setConfirmationCode(event.target.value)} required
                        fullWidth
                        id="confirmationCode"
                        label="Verification Code"
                        name="confirmationCode"
                        autoFocus
                    />
                    <div style={{height: '20px'}}/>
                    <StyledButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        text={'Submit'}
                    />
                </Form>
            </FormContent>
        </FormWrap>)

    }

    return (<div style={{width: 500}}>
            <Card>
                {stage === 1 && signup()}
                {stage === 2 && verifyUser()}
                {stage === 3 && getExampleCardSection()}
            </Card>
        </div>);
}

export default SignUp
