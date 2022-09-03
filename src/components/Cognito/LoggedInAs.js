import React from "react";
import {Card} from "@mui/material";
import StyledButton from "../StyledButton";
import {Form, FormContent, FormH1, FormWrap} from "./SigninElements";
import {getUsername, handleLogout} from "../../util/helperutils";
import {useNavigate} from "react-router-dom";

const LoggedInAs = () => {
    const navigate = useNavigate();

    function handleSubmit (event) {
        handleLogout(event, navigate)
    }

    return (
        <div style={{ width: 500}}>
            <Card>
                <FormWrap>
                    <FormContent>
                        <Form onSubmit={handleSubmit}>
                            <FormH1>You're Signed in as {getUsername()}</FormH1>
                            <StyledButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                text={'Logout'}
                            />
                        </Form>
                    </FormContent>
                </FormWrap>
            </Card>
        </div>
    )
}

export default LoggedInAs