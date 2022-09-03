import React, {useState} from "react";
import {Card} from "@mui/material";
import StyledButton from "../StyledButton";
import {Form, FormContent, FormH1, FormWrap} from "./SigninElements";
import {StyledTextField} from "../StyledTextField";
import poolData from "./CognitoClient";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import {AuthenticationDetails} from "amazon-cognito-identity-js";
import {checkPasswordRequirements, handleClearSession} from "../../util/helperutils";
import {useNavigate} from "react-router-dom";

const ChangePassword = ({setAlert, setFormType}) => {
    const [username, setUsername] = useState('');
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    function getCognitoUser() {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: username,
            Pool: poolData
        });
    }


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

        const authenticationData = {
            Username: username,
            Password: oldPassword,
        };

        const authenticationDetails = new AuthenticationDetails(authenticationData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: () => {
                cognitoUser.changePassword(oldPassword, password, (err, result) => {
                    if (err) {
                        setAlert('error', 'Error changing password.')
                        console.log('Error changing password:', err);
                    } else {
                        handleClearSession(event);
                        setAlert('success', 'Password changed successfully.')
                        navigate('/sign-in')
                    }
                });
            },
            onFailure: (err) => {
                console.log(err)
                setAlert('error', err.message)
            },
        });
    };

    function submitNewPassword() {
        return (
            <Form onSubmit={handlePasswordReset}>
                <FormH1>Change Password</FormH1>
                <StyledTextField
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                />
                <div style={{height: '20px'}}/>
                <StyledTextField
                    required
                    fullWidth
                    name="oldPassword"
                    label="Old Password"
                    type="password"
                    value={oldPassword}
                    onChange={(event) => setOldPassword(event.target.value)}
                    id="oldPassword"
                />
                <div style={{height: '20px'}}/>
                <StyledTextField
                    required
                    fullWidth
                    name="New password"
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    id="newPassword"
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
                        {submitNewPassword()}
                    </FormContent>
                </FormWrap>
            </Card>
        </div>
    )
}

export default ChangePassword