import * as React from 'react';
import {styled} from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowBackIosSharpIcon from '@mui/icons-material/ArrowBackIosSharp';
import {useEffect} from "react";

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
    outline: 'none !important',
    border: 'none !important',
    maxHeight: '1%',
    background: '#0d0d0d', // add background color
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowBackIosSharpIcon sx={{ fontSize: '0.9rem', color: '#fff', justifyContent: 'center'}} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor: '#0d0d0d', // transparent background
    flexDirection: 'row',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(-90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
        justifyContent: 'center', // added property to center the text
    },
    outline: 'none',
    '&:focus': {
        outline: 'none', // remove outline when in focus
    },
    root: {
        "&.Mui-focused": {
            outline: 'none !important',
            border: 'none !important',
        }
    }
}));


const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    background: 'rgba(45,43,43,0.31)',
    border: 'none',
    outline: 'none',
}));

export default function CustomizedAccordions({userManagement, isOpen}) {
    const [expanded, setExpanded] = React.useState();

    useEffect(() => {
        if (!isOpen) {
            setExpanded(false)
        }
    }, [isOpen])

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
        event.stopPropagation()
    };

    function getTypography(str) {
        return <Typography sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            textDecoration: 'none',
            listStyle: 'none',
            transition: '0.2s ease-in-out',
            color: '#fff',
            cursor: 'pointer'
        }}
        >{str}</Typography>;
    }

    return (
        <div>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary  aria-controls="panel1d-content" id="panel1d-header">
                    {getTypography('Profile')}
                </AccordionSummary>
                <AccordionDetails>
                    {userManagement}
                </AccordionDetails>
            </Accordion>
        </div>
    );
}