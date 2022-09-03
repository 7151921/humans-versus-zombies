import Button from "@mui/material/Button";
import * as React from "react";

export default function StyledButton({text, endIcon, mb, mt, maxWidth, maxHeight}) {
    return <>
        <Button
            sx={{
                maxWidth: maxWidth,
                maxHeight: maxHeight,
                mt: mb,
                mb: mt,
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
            type="submit"
            fullWidth
            variant="contained"
            endIcon={endIcon}
        >
            {text}
        </Button>
    </>
}
