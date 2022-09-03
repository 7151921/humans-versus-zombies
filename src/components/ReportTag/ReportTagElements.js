import styled from "styled-components";


export const TreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

export const InfoContainer = styled.div`
  color: #191414;
  background: #161819;
  justify-content: center;
  padding-top: 25px;
  @media screen and (max-width: 768px) {
    padding-top: 0;

  }
`
export const InfoWrapper = styled.div`
  display: grid;
  z-index: 1;
  height: 856px;
  width: 100%;
  max-width: 1100px;
  margin-right: auto;
  margin-left: auto;
  justify-content: center;
  @media screen and (max-width: 875px) {
    padding-top: 0;
    height: 1200px;

  }
`
export const ButtonWrapperRow = styled.div`
  display: grid;
  align-items: center;
`

export const InfoRow = styled.div`
  display: grid;
  grid-auto-columns: minmax(auto, 1fr);
  grid-gap: 2em;
  align-items: center;
  grid-template-areas: ${({imgStart}) => imgStart ? `'col2 col1'` : `'col1 col2'`};

  @media screen and (max-width: 768px) {
    grid-template-areas: ${({ imgStart }) => imgStart ? `'col1' 'col2'` : `'col1 col1' 'col2 col2'`};
    grid-gap: 0;
  }
`

export const Column1 = styled.div`
  padding: 0 15px;
  grid-area: col1;
`

export const Column2 = styled.div`
  margin-bottom: 15px;
  padding: 0 15px;
  grid-area: col2;
`

export const ImgWrap = styled.div`
  height: 100%;
`

export const ModPanelCard = styled.div`
  background: #131516;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`

export const ModPanelH1 = styled.h1`
  font-size: 24px;
  text-align: center;
  @media screen and (max-width: 768px) {
    font-size: 20px;
  }
  @media screen and (max-width: 480px) {
    font-size: 18px;
  }
`

export const PanelH1 = styled.h1`
  font-size: 24px;
  @media screen and (max-width: 768px) {
    font-size: 20px;
  }
  @media screen and (max-width: 480px) {
    font-size: 18px;
  }
`