import React, {useState} from "react";
import {Card} from "@mui/material";
import StyledButton from "../StyledButton";
import {Form, FormContent, FormH1, FormH3, FormWrap, LinkText} from "./SigninElements";
import {StyledTextField} from "../StyledTextField";
import poolData from "./CognitoClient";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import {checkPasswordRequirements} from "../../util/helperutils";

const ForgotPassword = ({setAlert, setFormType}) => {
    const [stage, setStage] = useState(1);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function getCognitoUser() {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: username,
            Pool: poolData
        });
    }

    const handleForgotPassword = (event) => {
        event.preventDefault();
        setAlert('success', 'Code delivered to email.')
        const cognitoUser = getCognitoUser();
        cognitoUser.forgotPassword({
            onSuccess: function (data) {
                setStage(2);
                setAlert('success', 'Password reset successful. Code delivered to email.')
            },
            onFailure: function (err) {
                setAlert('error', err.message)
                console.error('Error resetting password: ', err.message);
            }
        });
    };

    const handlePasswordReset = (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setAlert('error', 'The Password and confirm password do not match.')
            return;
        }

        const passwordValidation = checkPasswordRequirements(password);

        if (!passwordValidation.isValid) {
            setAlert('error', passwordValidation.error);
            return
        }

        const cognitoUser = getCognitoUser();

        cognitoUser.confirmPassword(code, password, {
            onSuccess: data => {
                setFormType('')
            },
            onFailure: err => {
                setAlert('error', err.message)
            }
        });
    };

    function emailForgotPassword() {
        return <Form onSubmit={handleForgotPassword}>
            <FormH1>Lost your Password?</FormH1>
            <FormH3>Please enter your username.
                You will receive a verification code to create a new password via email. </FormH3>
            <StyledTextField
                value={username}
                onChange={(event) => setUsername(event.target.value)} required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus
            />
            <div style={{height: '20px'}}/>
            <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                text={'Submit'}
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
                    setFormType('SignUp');
                }}>Don't have an account? Sign up</LinkText>
            </div>
        </Form>;
    }

    function submitNewPassword() {
        return (
            <Form onSubmit={handlePasswordReset}>
                <FormH1>Change Password</FormH1>
                <StyledTextField
                    value={code}
                    onChange={(event) => setCode(event.target.value)} required
                    fullWidth
                    id="code"
                    label="Verification Code"
                    name="code"
                    autoFocus
                />
                <div style={{height: '20px'}}/>
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
                <div style={{height: '20px'}}/>
                <StyledTextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    id="confirmPassword"
                    autoComplete="new-password"
                />
                <div style={{height: '20px'}}/>
                <StyledButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    text={'Change password'}
                />
            </Form>
        )
    }

    return (
        <div style={{width: 500}}>
            <Card>
                <FormWrap>
                    <FormContent>
                        {stage === 1 && emailForgotPassword()}
                        {stage === 2 && submitNewPassword()}
                    </FormContent>
                </FormWrap>
            </Card>
        </div>
    )
}

export default ForgotPassword