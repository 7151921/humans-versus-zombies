import React from "react";
import {Button} from "../ButtonElement";
import {BtnWrap, Heading, Subtitle, TextWrapper, TopLine} from "./InfoElements";

const RulesInfoSection = ({
                         lightText,
                         topLine,
                         headline,
                         darkText,
                         description,
                         buttonLabel,
                         primary,
                         dark,
                         dark2
                     }) => {
    const docLink = 'https://docs.google.com/document/d/1V9W5uBsbGhwixh6XDQN8j3GMQWa6dtvB6GfRTyLusuM/edit?usp=sharing';

    const handleClick = () => {
        window.open(docLink, '_blank');
    };
    return (
    <>
        <TextWrapper>
            <TopLine>{topLine}</TopLine>
            <Heading lightText={lightText}>{headline}</Heading>
            <Subtitle darkText={darkText}>{description}</Subtitle>
            <BtnWrap>
                <Button
                    to={'#'}
                    onClick={handleClick}
                    smooth = {true}
                    duration = {500}
                    spy = {true}
                    exact = "true"
                    offset = {0}
                    primary = {primary ? 1 : 0}
                    dark = {dark ? 1 : 0}
                    dark2 = {dark2 ? 1 : 0}>
                    {buttonLabel}
                </Button>
            </BtnWrap>
        </TextWrapper>
    </>
);
};

export default RulesInfoSection;