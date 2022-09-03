import styled from "styled-components";

export const ModServicesContainer = styled.div`
  min-height: 100vh;
  background: #010606;
  @media screen and (max-width: 1600px) {
    height: 100%;
  }
  @media screen and (max-width: 999px) {
    position: relative;
    padding-top: 2rem;
    padding-bottom: 2rem;
    justify-content: center;
    height: 100%;
  }
  @media screen and (max-width: 480px) {
    position: relative;
    justify-content: center;
    height: 100%;
  }
`

export const ExampleServicesWrapper = styled.div`
  margin: 0 auto;
  grid-gap: 16px;
  padding: 0 50px;

  @media screen and (max-width: 768px) {
    padding: 0 20px;
  }
`

export const ExampleServiceCard = styled.div`
  background: rgba(1, 1, 1, 0.65);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  //box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;

`

export const ModServicesWrapper = styled.div`
  max-width: 100%;
  margin: 0 auto;
  display: grid;
  padding: 0 50px;
  
`

export const ModServiceCard = styled.div`
  background: #181A1B;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-height: 140px;
  align-items: center;
  border-radius: 10px;
  height: 100%;
  //padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.02);
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }
`

export const LookupElement = styled.div`
  @media only screen and (max-width: 767px) {
    display: flex;
    flex-direction: column;

    .MuiFormControl-root {
      width: 100% !important;
    }
  }
`;

export const ExampleIcon = styled.img`
  min-height: 200px;
  max-height: 200px;
  border-radius: 5px;
  width: 200px;
  object-fit: cover;
  object-position: center;
  margin-bottom: 10px;
`

export const ServicesIcon = styled.img`
  //min-height: 240px;
  max-height: 240px;
  border-radius: 5px;
  max-width: 240px;
  object-fit: cover;
  object-position: center;
  margin-bottom: 10px;
`

export const ServicesH1 = styled.h1`
  font-size: 2.5rem;
  color: #e4e2de;
  @media screen and (max-width: 480px) {
    font-size: 2rem;
    text-align: center; /* add this line to center the text */

  }
`

export const ServicesH2 = styled.h2`
  color: #e4e2de;
  font-size: 1rem;
  margin-bottom: 10px;
`

export const ModServicesP = styled.p`
  color: #e4e2de;
  font-size: 1rem;
  text-align: center;
`

export const ExampleServicesP = styled.p`
  color: #e4e2de;
  font-size: 1rem;
  text-align: left;
`
