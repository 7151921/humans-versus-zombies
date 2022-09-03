import React from "react";

import {ExampleIcon, ExampleServiceCard, ExampleServicesP, ExampleServicesWrapper, ServicesH2} from "./CardElements";

const ExampleCardSection = ({
                                header,
                                description,
                                profilePictureTitle,
                                profilePictureMessage,
                                emailTitle,
                                emailMessage,
                                img,
                                button

                            }) => {
    return (
        <ExampleServicesWrapper >
            <ExampleServiceCard>
                <ServicesH2>{header}</ServicesH2>
                <ExampleIcon src={img}/>
                <ServicesH2>{profilePictureTitle}</ServicesH2>
                <ExampleServicesP style={{paddingBottom: "10px"}}>{profilePictureMessage}</ExampleServicesP>
                <div style={{height: '20px'}}/>
                {button}
                <div style={{height: '20px'}}/>
            </ExampleServiceCard>
        </ExampleServicesWrapper>
    );
};

export default ExampleCardSection;