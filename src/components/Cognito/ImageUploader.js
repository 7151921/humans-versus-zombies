import React from 'react';
import StandardStyledButton from "../StandardStyledButton";
import UploadIcon from '@mui/icons-material/Upload';

const ImageUpload = ({setImage, setAlert}) => {

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file.size > 5000000) {
            setAlert('error', 'File size must be less than 5 MB.');
        } else {
            setImage(file);
        }
    };

    const handleButtonClick = (event) => {
        event.preventDefault();
        document.getElementById('image-input').click();
    };

    return (
        <div>
            <StandardStyledButton
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
                handleButtonClick={handleButtonClick}
                text={'Upload Image'}
                endIcon={<UploadIcon/>}
                >
            </StandardStyledButton>
            <input
                type='file'
                id='image-input'
                style={{ display: 'none' }}
                onChange={handleImageChange}
                accept='image/*'
            />
        </div>
    );
};

export default ImageUpload;
