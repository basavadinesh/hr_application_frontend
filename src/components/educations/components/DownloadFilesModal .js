import React from 'react';
import {
    Modal,
    Box,
    AppBar,
    CardHeader,
    IconButton,
    CardContent,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Button
} from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// Modal component to display downloadable files
const DownloadFilesModal = ({ open, onClose, documents, handleDownload }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby='download-modal-title'
            aria-describedby='download-modal-description'
        >
            <Box
                sx={{
                    width: 600,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <AppBar position='static'>
                    <CardHeader title='Download Files'>
                        <IconButton
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: 'inherit'
                            }}
                            onClick={onClose}
                        >
                            <HighlightOffIcon />
                        </IconButton>
                    </CardHeader>
                </AppBar>
                <CardContent>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 500 }} aria-label='documents table'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>File Name</TableCell>
                                    <TableCell>Download</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {documents.map((doc, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{doc.filename}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant='contained'
                                                color='primary'
                                                onClick={() => handleDownload(doc.filepath)}
                                            >
                                                {doc.filename.endsWith('.pdf')
                                                    ? 'View'
                                                    : 'Download'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Box>
        </Modal>
    );
};

export default DownloadFilesModal;
