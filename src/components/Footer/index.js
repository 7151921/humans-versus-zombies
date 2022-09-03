import React from "react";
import {FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube,} from "react-icons/fa";
import {
    FooterContainer,
    FooterWrap,
    SocialIconLink,
    SocialIcons,
    SocialLogo,
    SocialMedia,
    SocialMediaWrap,
    WebsiteRights,
} from "./FooterElements";

import {animateScroll as scroll} from "react-scroll";

const Footer = () => {

    const toggleHome = () => {
        scroll.scrollToTop();
    };

    return (
        <FooterContainer>
            <FooterWrap>
                <SocialMedia>
                    <SocialMediaWrap>
                        <SocialLogo to="/" onClick = {toggleHome}>{process.env.REACT_APP_GAME_TITLE}</SocialLogo>
                        <SocialIcons>
                            <SocialIconLink href={process.env.REACT_APP_FACEBOOK} target="_blank" aria-label="Facebook">
                                <FaFacebook />
                            </SocialIconLink>
                            <SocialIconLink href={process.env.REACT_APP_INSTAGRAM} target="_blank" aria-label="Instagram">
                                <FaInstagram />
                            </SocialIconLink>
                            <SocialIconLink href={process.env.REACT_APP_TWITTER} target="_blank" aria-label="Twitter">
                                <FaTwitter />
                            </SocialIconLink>
                            <SocialIconLink href={process.env.REACT_APP_LINKEDIN} target="_blank" aria-label="Linkedin">
                                <FaLinkedin />
                            </SocialIconLink>
                            <SocialIconLink href={process.env.REACT_APP_YOUTUBE} target="_blank" aria-label="Youtube">
                                <FaYoutube/>
                            </SocialIconLink>
                        </SocialIcons>
                        <div style={{height: '20px'}}/>
                        <WebsiteRights>
                            {process.env.REACT_APP_GAME_TITLE} by Wyatt Yost
                        </WebsiteRights>
                    </SocialMediaWrap>
                </SocialMedia>
            </FooterWrap>
        </FooterContainer>
    );
};

export default Footer;