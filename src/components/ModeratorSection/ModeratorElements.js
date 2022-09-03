import styled from "styled-components";
import {MdArrowForward, MdKeyboardArrowRight} from "react-icons/md";
import {Link} from "react-scroll";

export const ModPanelServiceCard = styled.div`
  background: #181A1B;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`

export const ModServicesP = styled.p`
  color: #e4e2de;
  font-size: 1rem;
  text-align: center;
`

export const HeroContainer = styled.div`
  background: #0c0c0c;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
  height: 880px;
  position: relative;
  z-index: 1;
  :before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.2) 0%,
        rgba(0, 0, 0, 0.6) 100%
      ),
      linear-gradient(108deg, rgba(0, 0, 0, 0.2) 0%, transparent 100%);
    z-index: 1;
  }
`

export const HeroBg = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

export const VideoBg = styled.img`
  width: 100%;
  height: 100%;
  o-object-fit: cover;
  object-fit: cover;
  background: #232834;
`

export const HeroContent = styled.div`
  z-index: 1;
  max-width: 1200px;
  position: absolute;
  padding: 8px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const HeroH1 = styled.h1`
  color: #fff;
  font-size: 24px;
  text-align: center;
  @media screen and (max-width: 768px) {
    font-size: 20px;
  }
  @media screen and (max-width: 480px) {
    font-size: 18px;
  }
`

export const HeroNoCurrentGame = styled.p`
  margin-top: 5px;
  margin-bottom: -15px;
  color: #ffffff;
  font-size: 2rem;
  text-align: center;
  max-width: 600px;
  @media screen and (max-width: 768px) {
    font-size: 24px;
  }
  @media screen and (max-width: 480px) {
    font-size: 18px;
  }
`

export const HeroNoGame = styled.p`
  margin-top: 5px;
  color: #ffffff;
  font-size: 2rem;
  text-align: center;
  max-width: 600px;
  @media screen and (max-width: 768px) {
    font-size: 24px;
  }
  @media screen and (max-width: 480px) {
    font-size: 18px;
  }
`

export const HeroCurrentGame = styled.p`
  margin-top: 5px;
  margin-bottom: 10px;
  color: #ffffff;
  font-size: 2rem;
  text-align: center;
  max-width: 600px;
  @media screen and (max-width: 768px) {
    font-size: 24px;
  }
  @media screen and (max-width: 480px) {
    font-size: 18px;
  }
`

export const HeroCurrentGameH2 = styled.p`
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
`

export const GameNotStartedInfoWrapper = styled.div`
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  grid-gap: 10px;
  @media screen and (max-width: 1500px) {
    grid-template-columns: 1fr 1fr;
  }
  @media screen and (max-width: 1050px) {
    grid-template-columns: 1fr;
    padding: 0 20px;
  }
`

export const GameNotStartedButtonWrapper = styled.div`
  //margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: center;
  grid-gap: 15px;
  padding-top: 5px;
  margin-bottom: -25px;
  @media screen and (max-width: 1500px) {
    grid-template-columns: 1fr 1fr;
  }
  @media screen and (max-width: 1050px) {
    grid-template-columns: 1fr;
    padding: 0 20px;
  }
`

export const HeroCurrentGameData = styled.p`
  color: #ffffff;
  font-size: 15px;
  text-align: center;
  max-width: 600px;
  @media screen and (max-width: 768px) {
    font-size: 24px;
  }
  @media screen and (max-width: 480px) {
    font-size: 18px;
  }
`

export const HeroBtnWrapper = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const ArrowForward = styled(MdArrowForward)`
  margin-left: 8px;
  font-size: 20px;
`

export const ArrowRight = styled(MdKeyboardArrowRight)`
  margin-left: 8px;
  font-size: 20px;
`


export const InfoContainer = styled.div`
  color: #191414;
  background: ${({ lightBg }) => (lightBg ? "#f9f9f9" : "#010606")};
  
  @media screen and (max-width: 768px) {
    padding: 25px 0;
  }
`
export const InfoWrapper = styled.div`
  z-index: 1;
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding: 15px 24px;
  justify-content: center;
`

export const InfoRow = styled.div`
  padding-top: 15px;
  display: grid;
  grid-auto-columns: minmax(auto, 1fr);
  grid-template-areas: ${({imgStart}) => imgStart ? `'col2 col1'` : `'col1 col2'`};
 
  @media screen and (max-width: 768px) {
    grid-template-areas: ${({ imgStart }) => imgStart ? `'col1' 'col2'` : `'col1 col1' 'col2 col2'`};
  }
`

export const Column1 = styled.div`
  grid-area: col1;
`

export const Column2 = styled.div`
  grid-area: col2;
`
export const TextWrapper = styled.div`
  max-width: 540px;
  padding-top: 0;
  padding-bottom: 60px;
`

export const TopLine = styled.p`
  color: #01bf71;
  padding-top: 10px;
  font-size: 16px;
  line-height: 16px;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  margin-bottom: 16px;
`

export const Heading = styled.h1`
  margin-bottom: 24px;
  font-size: 30px;
  line-height: 1.1;
  font-weight: 600;
  color: ${({lightText}) => (lightText ? "#f7f8fa" : "#010606")};
  
  @media screen and (max-width: 480px) {
    font-size: 32px;
  }
`

export const FrontPageHeading = styled.h1`
  margin-bottom: 24px;
  padding-top: 85px;
  font-size: 48px;
  line-height: 1.1;
  font-weight: 600;
  color: ${({lightText}) => (lightText ? "#f7f8fa" : "#010606")};
  
  @media screen and (max-width: 480px) {
    font-size: 32px;
  }
`

export const Subtitle = styled.div`
  max-width: 440px;
  margin-bottom: 35px;
  font-size: 18px;
  line-height: 24px;
  color: ${({darkText}) => (darkText ? "#010606" : "#fff")};
`

export const BtnWrap = styled.div`
  padding-bottom: 15px;
  justify-content: space-evenly;
  justify-items: center;
  align-content: space-evenly;
  align-items: center;
  display: flex;
  grid-gap: 16px;
`


export const ImgWrap = styled.div`
  max-width: 555px;
  height: 100%;
`

export const Img = styled.img`
  width: 100%;
  margin: 0 0 10px 0;
  padding-right: 0;
`

export const ErrorP = styled.p`
  margin-top: 14px;
  color: #a94442;
  font-size: 14px;
  max-width: 600px;
  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
  @media screen and (max-width: 480px) {
    font-size: 12px;
  }
`

export const HeroPTitle = styled.p`
  text-decoration: underline;
  font-weight: bold;
  margin-top: 14px;
  color: #ffffff;
  font-size: 14px;
  max-width: 600px;
  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
  @media screen and (max-width: 480px) {
    font-size: 12px;
  }
`

export const Load = styled.div`
  body {background-color: coral;}
`

export const ServiceCard = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;

`

export const HeroBullets = styled.li`
  font-size: 14px;
  margin-left: 10px;
  list-style-type: disc;
  margin-bottom: 15px;
`

export const HeroNumeric = styled.li`
  font-size: 14px;
  margin-left: 25px;
  list-style-type: decimal;
  margin-bottom: 15px;
`

export const Button = styled(Link)`
  border-radius: 50px;
  background: ${({ primary }) => (primary ? "#01BF71" : "#010606")};
  white-space: nowrap;
  padding: 12px 30px;
  color: ${({ dark }) => (dark ? "#010606" : "#fff")};
  font-size: 14px;
  outline: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;
  &:hover {
    transition: all 0.2s ease-in-out;
    background: ${({ primary }) => (primary ? "#fff" : "#01BF71")};
  }
`