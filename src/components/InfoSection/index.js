import React from "react";
import {Column1, Column2, Img, ImgWrap, InfoContainer, InfoExtendedWrapper, InfoRow, InfoWrapper} from "./InfoElements";

const InfoSection = ({lightBg,
                         id,
                         imgStart,
                         img,
                         content,
                         overridePicture,
                         extend
                     }) => {
    function getInfoRow() {
        return <InfoRow imgStart={imgStart}>
            <Column1>
                {content}
            </Column1>
            <Column2>
                <ImgWrap>
                    {overridePicture ? overridePicture : <Img src={img}/>}
                </ImgWrap>
            </Column2>
        </InfoRow>;
    }

    function getInfoExtendedWrapper() {
        return <InfoExtendedWrapper>
            {getInfoRow()}
        </InfoExtendedWrapper>;
    }

    function getInfoWrapper() {
        return <InfoWrapper>
            {getInfoRow()}
        </InfoWrapper>;
    }

    return (<InfoContainer lightBg={lightBg} id={id}>
            {extend ? getInfoExtendedWrapper() : getInfoWrapper()}
        </InfoContainer>
    );
};

export default InfoSection;