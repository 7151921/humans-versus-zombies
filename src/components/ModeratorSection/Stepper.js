import * as React from 'react';
import {useEffect} from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import {stepLabelClasses} from "@mui/material";
import { styled } from "@mui/material/styles";
import {withStyles} from "@mui/styles";

const steps = ['Create Game', 'Select OZ', 'In Progress', 'End'];

export default function LinearStepper({ game }) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

    const isStepOptional = (step) => {
        return step === 1;
    };


    const ColorlibStepLabel = styled(StepLabel)(() => ({
        [`& .${stepLabelClasses.label}`]: {
            [`&.${stepLabelClasses.completed}`]: {
                // color: "#e4e2de"
            },
            [`&.${stepLabelClasses.active}`]: {
                // color: "#e4e2de"
            },
            // color: "#e4e2de !important"
        }
    }));

    const WhiteTextTypography = withStyles({
        root: {
            // color: "#e4e2de"
        }
    })(Typography);

    React.useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (game) {
            const { has_started, end_time } = game;
            if (!has_started) {
                setActiveStep(1);
            } else if (end_time) {
                setActiveStep(3);
            } else {
                setActiveStep(2);
            }
        }
    }, [game]);

    const isMobile = windowWidth < 547;
    const showAllSteps = !isMobile || activeStep === 0;

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} >
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = (
                            <WhiteTextTypography  variant="caption"  >Optional</WhiteTextTypography >
                        );
                    }

                    const showStep = showAllSteps || index === activeStep;

                    return showStep ? (
                        <Step key={label} {...stepProps}   >
                            <ColorlibStepLabel {...labelProps}>
                                {label}
                            </ColorlibStepLabel>
                            {isMobile && index === activeStep && (
                                <WhiteTextTypography variant="caption"  >
                                    Next Step
                                </WhiteTextTypography>
                            )}
                        </Step>
                    ) : null;
                })}
            </Stepper>
        </Box>
    );
}
