import {styled} from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {outlinedInputClasses} from "@mui/material/OutlinedInput";
import {inputLabelClasses} from "@mui/material/InputLabel";
import {FormControl} from "@mui/material";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";

export const StyledTextField = styled(TextField)({
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: "rgba(228,226,222,0.23)"
    },
    [`&:hover .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: "#7c7367"
    },
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: "#01BF71"
    },
    [`& .${outlinedInputClasses.input}`]: {
        color: "#e4e2de"
    },
    [`&:hover .${outlinedInputClasses.input}`]: {
        color: "#7c7367"
    },
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.input}`]: {
        color: "#e4e2de"
    },
    [`& .${inputLabelClasses.outlined}`]: {
        color: "#e4e2de"
    },
    [`&:hover .${inputLabelClasses.outlined}`]: {
        color: "#7c7367"
    },
    [`& .${inputLabelClasses.outlined}.${inputLabelClasses.focused}`]: {
        color: "#01BF71"
    }
});


export const StyledFormControl = styled(FormControl)({
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: "#2e2d2a"
    },
    [`&:hover .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: "#7c7367"
    },
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: "#01BF71"
    },
    [`& .${outlinedInputClasses.input}`]: {
        color: "#e4e2de"
    },
    [`&:hover .${outlinedInputClasses.input}`]: {
        color: "#7c7367"
    },
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.input}`]: {
        color: "#e4e2de"
    },
    [`& .${inputLabelClasses.outlined}`]: {
        color: "#e4e2de"
    },
    [`&:hover .${inputLabelClasses.outlined}`]: {
        color: "#7c7367"
    },
    [`& .${inputLabelClasses.outlined}.${inputLabelClasses.focused}`]: {
        color: "#01BF71"
    },
    '& .MuiSelect-icon': {
        color: '#e4e2de',
    },
});

export const StyledModeratorTextField = styled(TextField)(({ theme }) => ({
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: "rgba(228,226,222,0.23)"
    },
    [`&:hover .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: "#7c7367"
    },
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: theme.palette.primary.main
    },
    [`& .${outlinedInputClasses.input}`]: {
        color: "#e4e2de"
    },
    [`&:hover .${outlinedInputClasses.input}`]: {
        color: "#7c7367"
    },
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.input}`]: {
        color: "#e4e2de"
    },
    [`& .${inputLabelClasses.outlined}`]: {
        color: "#e4e2de"
    },
    [`&:hover .${inputLabelClasses.outlined}`]: {
        color: "#7c7367"
    },
    [`& .${inputLabelClasses.outlined}.${inputLabelClasses.focused}`]: {
        color: theme.palette.primary.main
    }
}));

export const StyledDateTimePickerControl = styled(DateTimePicker)(({ theme }) => ({
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: "#2e2d2a"
    },
    [`&:hover .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: "#7c7367"
    },
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: theme.palette.primary.main
    },
    [`& .${outlinedInputClasses.input}`]: {
        color: "#e4e2de"
    },
    [`&:hover .${outlinedInputClasses.input}`]: {
        color: "#7c7367"
    },
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.input}`]: {
        color: "#e4e2de"
    },
    [`& .${inputLabelClasses.outlined}`]: {
        color: "#e4e2de"
    },
    [`&:hover .${inputLabelClasses.outlined}`]: {
        color: "#7c7367"
    },
    [`& .${inputLabelClasses.outlined}.${inputLabelClasses.focused}`]: {
        color: theme.palette.primary.main
    },
    '& .MuiSelect-icon': {
        color: '#e4e2de',
    },
    '& .MuiInputBase-input[aria-disabled="true"]': {
        color: 'red',
    },
}));

export const StyledModFormControl = styled(FormControl)(({ theme }) => ({
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: "#2e2d2a"
    },
    [`&:hover .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: "#7c7367"
    },
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: theme.palette.primary
    },
    [`& .${outlinedInputClasses.input}`]: {
        color: "#e4e2de"
    },
    [`&:hover .${outlinedInputClasses.input}`]: {
        color: "#7c7367"
    },
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.input}`]: {
        color: "#e4e2de"
    },
    [`& .${inputLabelClasses.outlined}`]: {
        color: "#e4e2de"
    },
    [`&:hover .${inputLabelClasses.outlined}`]: {
        color: "#7c7367"
    },
    [`& .${inputLabelClasses.outlined}.${inputLabelClasses.focused}`]: {
        color: theme.palette.primary
    },
    '& .MuiSelect-icon': {
        color: '#e4e2de',
    },
}));
