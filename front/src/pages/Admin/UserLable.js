import Chip from '@mui/material/Chip';


export const getStatusLabel = (status) => {
    switch (status) {
        case 'verified':
            return <Chip label="Verified" color="success" variant="outlined" />;
        case 'unverified':
            return <Chip label="Unverified" color="warning" variant="outlined" />;
        case 'banned':
            return <Chip label="Banned" color="error"variant="outlined"  />;
        default:
            return <Chip label="Unknown" variant="outlined" />;
    }
};
