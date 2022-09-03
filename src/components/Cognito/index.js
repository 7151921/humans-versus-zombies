import React, {useState} from "react";
import {AuthenticationDetails, CognitoUser} from 'amazon-cognito-identity-js';
import poolData from './CognitoClient';

import {Form, FormContent, FormH1, FormWrap, LinkText} from "./SigninElements";
import {Card} from "@mui/material";
import StyledButton from "../StyledButton";
import {StyledTextField} from "../StyledTextField";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export async function signIn(setLoading, setAlert, username, password) {
    return new Promise((resolve, reject) => {
        try {
            console.log('Logging User In')
            const user = new CognitoUser({Username: username, Pool: poolData});
            const authDetails = new AuthenticationDetails({Username: username, Password: password});
            user.authenticateUser(authDetails, {
                onSuccess: (data) => {
                    let currentTime = Date.now();
                    localStorage.setItem('accessToken', JSON.stringify({
                        value: data.getIdToken().getJwtToken(),
                        timestamp: currentTime
                    }));
                    localStorage.setItem('username', JSON.stringify({
                        value: username,
                        timestamp: currentTime
                    }));
                    resolve();
                },
                onFailure: (err) => {
                    reject(err);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

export function getPlayerData(setAlert, token, currentTime) {
    if (!token) {
        return;
    }

    const api = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return new Promise((resolve, reject) => {
        api.get('/player')
            .then(res => {
                localStorage.setItem('playerData', JSON.stringify({
                    value: res.data,
                    timestamp: currentTime
                }));
                resolve(res);
            })
            .catch(err => {
                setAlert('error', err.message);
                reject(err);
            });
    });
}


const SignInForm = ({setFormType, setAlert, setLoading}, formType) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true)
            await signIn(setLoading, setAlert, username, password);
            await getPlayerData(setAlert,
                JSON.parse(localStorage.getItem('accessToken')).value, Date.now());
            navigate('/');
            setLoading(false)
        } catch (err) {
            setAlert('error', err.message);
            console.log(err.message)
            setLoading(false)
        }
    };

    return (
        <div style={{ width: 500}}>
            <Card>
                <FormWrap>
                    <FormContent>
                        <Form onSubmit={handleSubmit}>
                            <FormH1>Sign in to your Account</FormH1>
                            <StyledTextField
                                value={username}
                                onChange={(event) => setUsername(event.target.value)} required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoFocus
                                autoComplete="username"
                            />
                            <div style={{ height: '20px' }} />
                            <StyledTextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                id="password"
                                autoComplete="new-password"
                            />
                            <div style={{ height: '20px' }} />
                            <StyledButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                text={'Sign In'}
                            />
                            <div style={{ height: '20px' }} />
                            <div>
                                <LinkText href="#" onClick={(e) => {
                                    e.preventDefault();
                                    setFormType('ForgotPassword');
                                }}>Forgot password?</LinkText>
                            </div>
                            <div style={{ height: '10px' }} />
                            <div>
                                <LinkText href="#" onClick={(e) => {
                                    e.preventDefault();
                                    setFormType('SignUp');
                                }}>Don't have an account? Sign up</LinkText>
                            </div>
                        </Form>
                    </FormContent>
                </FormWrap>
            </Card>
        </div>
    )
}

export default SignInForm