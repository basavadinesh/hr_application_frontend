import { useEffect, useState } from 'react';
import axios from 'axios';
import AppUtils from 'components/core/helpers/app-utils';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Backdrop from '@mui/material/Backdrop';
import { AppointmentLetterForm } from '../LetterForms/AppointmentLetterForm';
import DownloadIcon from '@mui/icons-material/Download';
import DownloadFilesModal from 'components/educations/components/DownloadFilesModal ';
import { getDesignations } from 'components/designations/actions/designation-actions';
import { AppConfigProps } from 'components/core/settings/app-config';
import { manageError } from 'components/core/actions/common-actions';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { getEmployees } from 'components/allEmployees/actions/employee-actions';
const pastelColors = {
    blue: '#AEDFF7',
    black: '#000',
    white: '#ffffff'
};

const propertyStyles = (color) => ({
    fontWeight: 'bold',
    color: color,
    width: '150px',
    fontSize: '18px',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    whiteSpace: 'nowrap'
});

const cardStyles = (backgroundColor) => ({
    borderWidth: 2,
    borderStyle: 'solid',
    boxShadow: 3,
    borderRadius: 2,
    borderColor: backgroundColor,
    backgroundColor: `${backgroundColor}20`,
    padding: '12px',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
});

export const AppointmentLetterDetailsCard = ({ userId, employeeDetails }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const [showModal, setShowModal] = useState(false);
    const [documents, setDocuments] = useState([]);
    const cancelToken = { cancelToken: _axiosSource.token };
    const [selectedMethod, setSelectedMethod] = useState('create');
    const [appointmentLetterDetails, setAppointmentLetterDetails] = useState({});
    const [designations, setDesignations] = useState(null);
    const [employees, setEmployees] = useState(null);

    const history = useHistory();
    const handleShowModal = (docs) => {
        setDocuments(docs || []);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
    const [employeeValues, setEmployeeValues] = useState({
        manager: employees?.manager || '',
        managerEmail: employees?.managerEmail || ''
    });
    const fetchAppointmentLetterByUserId = async (userId, cancelToken) => {
        try {
            const token = AppUtils.getIdentityAccessToken();
            const response = await axios.get(
                `http://localhost:8080/hrletters/appointmentletter/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    cancelToken: cancelToken.token
                }
            );
            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message);
            } else {
                console.error('Error fetching appointment letter details:', error);
            }
            throw error;
        }
    };

    const fetchAppointmentLetterDetailsByUserId = async (userId, cancelToken) => {
        try {
            const data = await fetchAppointmentLetterByUserId(userId, cancelToken);
            setAppointmentLetterDetails(data);
            setSelectedMethod('update');
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error('Error fetching appointment letter details:', error);
                if (setSelectedMethod) {
                    setSelectedMethod('create');
                }
            }
        }
    };

    useEffect(() => {
        fetchAppointmentLetterDetailsByUserId(userId, cancelToken);
        getEmployeeDesignations();
    }, [userId]);

    const handleDownload = async (relativePath) => {
        console.log('Relative Path:', relativePath);
        try {
            const fileName = relativePath;

            const response = await axios.get(`http://localhost:8080/api/v1/file/download`, {
                params: {
                    fileName: relativePath
                },
                responseType: 'blob'
            });

            // Check if the file extension is .pdf
            const fileExtension = fileName.split('.').pop().toLowerCase();

            if (fileExtension === 'pdf') {
                // Create a URL for the blob
                const url = window.URL.createObjectURL(
                    new Blob([response.data], { type: 'application/pdf' })
                );

                // Open PDF files in a new tab
                window.open(url, '_blank');

                // Clean up the URL object
                window.URL.revokeObjectURL(url);
            } else {
                console.warn('File is not a PDF. Ignoring.');
            }
        } catch (error) {
            console.error('Error handling file:', error);
        }
    };

    const handleEdit = () => {
        setIsPopupOpen(true);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
        fetchAppointmentLetterDetailsByUserId(userId, cancelToken);
    };
    const getEmployeeDesignations = async () => {
        await getDesignations(_cancelToken)
            .then(async (res) => {
                if (
                    res &&
                    res.status === AppConfigProps.httpStatusCode.ok &&
                    res.data &&
                    res.data
                ) {
                    setDesignations(res.data);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    useEffect(() => {
        loadPageData();
    }, []);

    const loadPageData = async () => {
        try {
            const res = await getEmployees(_cancelToken);
            if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                let filteredEmployees = res.data;
                filteredEmployees.sort((a, b) => b.id - a.id);

                setEmployees(filteredEmployees);
            } else {
                await manageError(res, history);
            }
        } catch (err) {
            await manageError(err, history);
        }
    };
    return (
        <Card
            variant='outlined'
            sx={{ ...cardStyles(pastelColors.blue), minWidth: '800px', marginLeft: '20px' }}
        >
            <CardContent sx={{ padding: '20px' }}>
                <DownloadFilesModal
                    open={showModal}
                    onClose={handleCloseModal}
                    documents={documents}
                    handleDownload={handleDownload}
                />
                <Box
                    sx={{
                        width: '90%',
                        borderRadius: '5px',
                        padding: '10px',
                        marginTop: '10px',
                        position: 'relative',
                        textAlign: 'center'
                    }}
                >
                    <Typography
                        variant='h5'
                        gutterBottom
                        sx={{ fontWeight: 'bold', paddingBottom: '5px' }}
                    >
                        Appointment Letter Information
                    </Typography>
                    <IconButton
                        onClick={handleEdit}
                        sx={{ position: 'absolute', top: '0', right: '50px', marginTop: '6px' }}
                        aria-label='edit'
                    >
                        <EditIcon />
                    </IconButton>
                    <AppointmentLetterForm
                        open={isPopupOpen}
                        onClose={handlePopupClose}
                        method={selectedMethod}
                        Backdrop={Backdrop}
                        employeeDetails={employeeDetails}
                        appointmentLetterDetails={appointmentLetterDetails}
                        designations={designations}
                        employeeValues={employeeValues}
                        setEmployeeValues={setEmployeeValues}
                        managers={employees}
                    />
                </Box>

                <Box
                    sx={{
                        width: '90%',
                        borderRadius: '5px',
                        padding: '10px',
                        marginTop: '10px'
                    }}
                >
                    <Typography
                        variant='body1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '11px'
                        }}
                    >
                        <span style={propertyStyles(pastelColors.black)}>
                            Letter Reference Number:
                        </span>
                        <Typography
                            variant='body1'
                            sx={{ marginRight: 'auto', marginLeft: '200px' }}
                        >
                            {appointmentLetterDetails.letterReferenceNumber || '-'}
                        </Typography>
                    </Typography>

                    <Typography
                        variant='body1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '11px'
                        }}
                    >
                        <span style={propertyStyles(pastelColors.black)}>Date of Appointment:</span>
                        <Typography
                            variant='body1'
                            sx={{ marginRight: 'auto', marginLeft: '200px' }}
                        >
                            {appointmentLetterDetails.dateOfAppointment || '-'}
                        </Typography>
                    </Typography>

                    <Typography
                        variant='body1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '11px'
                        }}
                    >
                        <span style={propertyStyles(pastelColors.black)}>Name As Per Aadhaar:</span>
                        <Typography
                            variant='body1'
                            sx={{ marginRight: 'auto', marginLeft: '200px' }}
                        >
                            {employeeDetails.nameAsPerAadhar || '-'}
                        </Typography>
                    </Typography>

                    <Typography
                        variant='body1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '11px'
                        }}
                    >
                        <span style={propertyStyles(pastelColors.black)}>Designation:</span>
                        <Typography
                            variant='body1'
                            sx={{ marginRight: 'auto', marginLeft: '200px' }}
                        >
                            {employeeDetails.designation || '-'}
                        </Typography>
                    </Typography>

                    <Typography
                        variant='body1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '11px'
                        }}
                    >
                        <span style={propertyStyles(pastelColors.black)}>CTC:</span>
                        <Typography
                            variant='body1'
                            sx={{ marginRight: 'auto', marginLeft: '200px' }}
                        >
                            {appointmentLetterDetails.ctc || '-'}
                        </Typography>
                    </Typography>

                    <Typography
                        variant='body1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '11px'
                        }}
                    >
                        <span style={propertyStyles(pastelColors.black)}>
                            Issued By Designation:
                        </span>
                        <Typography
                            variant='body1'
                            sx={{ marginRight: 'auto', marginLeft: '200px' }}
                        >
                            {appointmentLetterDetails.issuedByDesignation || '-'}
                        </Typography>
                    </Typography>

                    <Typography
                        variant='body1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '11px'
                        }}
                    >
                        <span style={propertyStyles(pastelColors.black)}>Issued By Name:</span>
                        <Typography
                            variant='body1'
                            sx={{ marginRight: 'auto', marginLeft: '200px' }}
                        >
                            {appointmentLetterDetails.issuedByName || '-'}
                        </Typography>
                    </Typography>
                    <Typography
                        variant='body1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '11px'
                        }}
                    >
                        <span style={propertyStyles(pastelColors.black)}>Document:</span>
                        {appointmentLetterDetails.documents &&
                        appointmentLetterDetails.documents.length > 0 ? (
                            <Typography
                                variant='body1'
                                sx={{
                                    cursor: 'pointer',
                                    marginRight: 'auto',
                                    marginLeft: '198px',
                                    color: '#0056b3',
                                    textDecoration: 'underline',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                onClick={() => handleShowModal(appointmentLetterDetails.documents)}
                            >
                                <DownloadIcon />
                                Document File
                            </Typography>
                        ) : (
                            <Typography
                                variant='body1'
                                sx={{ marginRight: 'auto', marginLeft: '200px' }}
                            >
                                -
                            </Typography>
                        )}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};
