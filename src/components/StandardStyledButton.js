import Button from "@mui/material/Button";
import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function StandardStyledButton({text, handleButtonClick, endIcon, loading}) {
    return <>
        <Button
            sx={{
                border: 4,
                textTransform: "none",
                borderStyle: "solid !important",
                borderRadius: "50px",
                backgroundColor: "#01BF71",
                borderColor: "#01BF71", ':hover': {
                    borderColor: "#01BF71",
                    borderStyle: "solid",
                    background: '#181d1c',
                    color: '#ffffff',
                }
            }}
            variant="contained"
            endIcon={endIcon}
            onClick={handleButtonClick}>
            {text}
            {loading && <CircularProgress
                size={24}
                style={{marginLeft: '10px'}}
            />
            }
        </Button>
    </>
}
