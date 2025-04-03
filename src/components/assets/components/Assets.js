import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Input from '@mui/material/Input';
import CircularProgress from '@mui/material/CircularProgress';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getAssets, viewAssetsDetails, deleteAsset } from '../actions/assets-actions';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import { AssetsMsgResProps } from '../messeges/assets-properties';
import { createAssets } from '../actions/assets-actions';
import { manageImportError } from '../../core/actions/common-actions';
import AddAsset from './Addassets';
import Backdrop from '@mui/material/Backdrop';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AppUtils from '../../core/helpers/app-utils';
import ReturnAssets from './Returnasset';
import TextField from '@mui/material/TextField';
import DownloadIcon from '@mui/icons-material/Download';
import TablePagination from '@mui/material/TablePagination';

import * as XLSX from 'xlsx';
import PublishIcon from '@mui/icons-material/Publish';

// Styled components for table cells and rows
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.gray,
        color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        maxWidth: '200px', // Adjust as necessary
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover
    },
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));

// Styles for table columns
const columnBorderStyle = {
    borderRight: '1px solid #ccc',
    minWidth: '140px',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    overflow: 'hidden' // Adjust the border color and style as needed
};
const actionsBorderStyle = {
    borderRight: '1px solid #ccc',
    minWidth: '100px',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    overflow: 'hidden' // Adjust the border color and style as needed
};

const remarksWidthStyle = {
    borderRight: '1px solid #ccc',
    minWidth: '200px',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    overflow: 'hidden'
};
const dateWidthStyle = {
    borderRight: '1px solid #ccc',
    minWidth: '150px',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    overflow: 'hidden'
};

export default function Asset() {
    // Create a cancel token for axios requests
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const history = useHistory();

    // State variables
    const [assets, setAssets] = useState(null);
    const [open, setOpen] = React.useState(false);
    const userId = localStorage.getItem('userId');
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedAssetID, setSelectedAssetID] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedAssetDetails, setSelectedAssetDetails] = useState(null);
    const [isLoading, setLoading] = useState(false);

    // Open or close modal based on event type ('add', 'edit', 'return')
    const handleOpen = async (event) => {
        if (event === 'add') {
            await setSelectedAssetDetails(null);
        }
        await setSelectedMethod(event);
        await setOpen(true);
    };

    // Close modal and reload asset data
    const handleClose = () => {
        setOpen(false);
        loadPageData(userId);
        handlePopUpClose();
    };
    

    // Open popover for asset actions (edit, delete, etc.)
    const handlePopUpClick = (event, asetId) => {
        setSelectedAssetID(asetId);
        setAnchorEl(event.currentTarget);
    };

    // Close popover
    const handlePopUpClose = () => {
        setAnchorEl(null);
    };

    // Check if popover is open
    const popUpOen = Boolean(anchorEl);

    // Load asset data from the server
    const loadPageData = async () => {
        await getAssets(_cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {

                    // Filter and sort the data ensuring user_id exists and has disabled property
                    const filteredData = res.data
                        .filter((asset) => asset.user_id && asset.user_id.disabled !== undefined)
                        .sort((a, b) => b.user_id.id - a.user_id.id);

                    setAssets(filteredData);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    // Load asset data on component mount
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            loadPageData(userId);
        }
    }, []);

    // Delete selected asset
    const deleteAssets = async () => {
        let assetId = selectedAssetID;
        await deleteAsset(assetId, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok) {
                    loadPageData(userId);
                    handlePopUpClose();
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    // Edit selected asset
    const handleEditAsset = async () => {
        let assetId = selectedAssetID;
        await viewAssetsDetails(assetId, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    setSelectedAssetDetails(res.data);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });

        await handleOpen('edit');
    };

    // Open edit modal if asset details are available
    useEffect(() => {
        if (selectedMethod === 'edit' && selectedAssetDetails) {
            setOpen(true);
        }
    }, [selectedAssetDetails]);

    // Handle asset return
    const handleReturnAsset = async () => {
        let assetId = selectedAssetID;
        await viewAssetsDetails(assetId, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    setSelectedAssetDetails(res.data);
                    // handleOpen('return')
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
        await handleOpen('return');
    };

    // Handle page change in pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change in pagination
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Filter assets based on search query
    const filteredAssets = assets
        ? assets.filter((asset) => {
              const searchString = `${asset.invoice_number} ${asset.processor} ${asset.asset_type} ${asset.serial_number}`;
              return searchString.toLowerCase().includes(searchQuery.toLowerCase());
          })
        : [];
    
    // Paginate filtered assets
    const paginatedAssets = filteredAssets.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    
    // Export asset data to CSV
    const exportToCSV = () => {
        const csvRows = [];
        // Add header row
        csvRows.push(
            [
                'ID',
                'Invoice Number',
                'Invoice Date',
                'Quantity',
                'RAM',
                'Processor',
                'Hard Disk Type',
                'Hard Disk Size',
                'Company',
                'Amount/Invoice wise',
                'Warranty Date',
                'Warranty Expires in',
                'Department',
                'Delivered To',
                'Project',
                'Handovered Type',
                'Remarks',
                'Employee Id',
                'Employee Name',
                'asset_type',
                'serial_number',
                'asset_given_at',
                'asset_approved_at',
                'asset_received_at',
                'asset_return_at',
                'assignee_comment',
                'received_comment',
                'return_comment',
                'status',
                'Make',
                ''
            ].join(',')
        );
        // Adding data rows
        filteredAssets.forEach((asset) => {
            const daysLeft = asset.warranty_date ? calculateDaysLeft(asset.warranty_date) : null;
            const rowData = [
                asset.id || '-',
                asset.invoice_number || '-',
                asset.invoice_date || '-',
                asset.quantity || '-',
                asset.ram || '-',
                asset.processor || '-',
                asset.hard_disk_type || '-',
                asset.hard_disk_size || '-',
                asset.company || '-',
                asset.amount_or_invoice_wise || '-',
                asset.warranty_date || '-',
                daysLeft !== null 
                ? daysLeft > 0
                  ? `${daysLeft} days`
                  : `Expired ${Math.abs(daysLeft)} days ago`
                : '-',
                asset.department || '-',
                asset.delivered_to || '-',
                asset.project || '-',
                asset.handovered_type || '-',
                asset.remarks || '-',
                asset.user_id?.employeeid || '-',
                asset.user_id?.fullname || '-',
                asset.asset_type || '-',
                asset.serial_number || '-',
                asset.asset_given_at || '-',
                asset.asset_approved_at || '-',
                asset.asset_received_at || '-',
                asset.asset_return_at || '-',
                asset.assignee_comment || '-',
                asset.received_comment || '-',
                asset.return_comment || '-',
                asset.status || '-',
                asset.make || '-'
            ];
            csvRows.push(rowData.join(','));
        });
        const csvData = csvRows.join('\n');
        const blob = new Blob([csvData], { type: 'text/csv' });
        const blobUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = 'Asset_data.csv';
        anchor.click();
        URL.revokeObjectURL(blobUrl);
    };
    const formatExcelDate = (excelDate) => {
        // Check if the input is null, undefined, or not a number
        if (excelDate == null || isNaN(excelDate)) {
            return null;
        }
    
        // Calculate the JavaScript date from the Excel date
        const jsDate = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
    
        // Check if the calculated date is valid
        if (isNaN(jsDate.getTime())) {
            return null;
        }
    
        // Extract year, month, and day from the JavaScript date
        const year = jsDate.getFullYear();
        const month = String(jsDate.getMonth() + 1).padStart(2, '0'); // Add leading zero to month if necessary
        const day = String(jsDate.getDate()).padStart(2, '0'); // Add leading zero to day if necessary
    
        // Format the date as yyyy-MM-dd
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    };

    const fileInputRef = useRef(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    // Handle file import and processing
    const processAssetData = async (jsonData) => {
        setLoading(true);
        let errors = [];

        try {
            const promises = jsonData.map(async (row) => {
                const transformedData = {
                    invoice_number: row['Inv Number'],
                    invoice_date: formatExcelDate(row['Invoice Date']),
                    make: row['Make'],
                    quantity: row['Quantity'],
                    ram: row['RAM'],
                    processor: row['Processor'],
                    hard_disk_size: row['Hard Disk Size'],
                    hard_disk_type: row['Hard Disk Type'],
                    company: row['Company'],
                    amount_or_invoice_wise: row['Amount / Invoice Wise'],
                    warranty_date:  formatExcelDate(row['Warranty Date']),
                    delivered_to: row['Delivered To'],
                    department: row['Department'],
                    project: row['Project'],
                    handovered_type: row['Handovered Type By Hand / Courier Number'],
                    emp_code: row['EMP Code'],
                    remarks: row['Remarks if Any'],
                    asset_type: row['Product'],
                    serial_number: row['Serial No'],
                    asset_given_at: formatExcelDate(row['Asset Given At']),
                    asset_approved_at: formatExcelDate(row['Asset Approved At']),
                    asset_received_at: formatExcelDate(row['Asset Received At']),
                    asset_return_at: formatExcelDate(row['Asset Return At']),
                    assignee_comment: row['Assignee Comment'],
                    received_comment: row['Received Comment'],
                    return_comment: row['Return Comment'],
                    status: row['Status']
                };

                try {
                    const res = await createAssets(transformedData);
                    if (!res || res.status !== AppConfigProps.httpStatusCode.ok || !res.data) {
                        const errorDetails = await manageImportError(res, history);
                        errors.push(errorDetails);
                    }
                } catch (err) {
                    const errorDetails = await manageImportError(err, history);
                    errors.push(errorDetails);
                }
            });

            await Promise.all(promises);
        } catch (error) {
            const errorDetails = {
                path: 'processing loop',
                statusCode: error.status,
                message: error.message
            };
            errors.push(errorDetails);
        } finally {
            setLoading(false);
            if (errors.length > 0) {
                // Store errors in a way that the error page can access them
                localStorage.setItem('processingErrors', JSON.stringify(errors));
                history.push('/importError');
            } else {
                window.location.reload();
            }
        }
    };

    const handleFileImport = async (file) => {
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                processAssetData(jsonData);
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('Error importing file:', error);
        }
    };

    // Calculate days left until warranty expires
    const calculateDaysLeft = (warrantyDate) => {
        const today = new Date();
        const endDate = new Date(warrantyDate);
        const timeDiff = endDate - today;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysLeft;
    };

    return (
        <div>
            <Input
                type='text'
                placeholder='Search... Assets Details'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                    color: '#0070ac',
                    marginBottom: 2,
                    padding: 1,
                    width: 200, // Adjust the width as needed
                    height: 33,
                    borderRadius: 3.1,
                    fontSize: 12,
                    border: '2px solid #0070ac',
                    '&:focus': {
                        borderColor: '#0070ac', // Change color on focus
                        boxShadow: (theme) => `0 0 0 0.2rem ${theme.palette.primary.main}`
                    }
                }}
            />
            <input
                type='file'
                ref={fileInputRef}
                onChange={(event) => {
                    const files = event.target.files;
                    if (files && files.length > 0) {
                        handleFileImport(files[0]);
                    }
                }}
                style={{ display: 'none' }}
            />
            <Button
                onClick={handleImportClick}
                style={{
                    marginLeft: '20px',
                    float: 'right',
                    fontSize: '10px',
                    borderRadius: '20px',
                    color: '#F06D4B',
                    borderColor: '#F06D4B',
                    marginBottom: '10px'
                }}
                variant='outlined'
                startIcon={<DownloadIcon style={{ fontSize: 12 }} />}
            >
                {isLoading ? (
                    <>
                        <CircularProgress
                            size={10}
                            variant='indeterminate'
                            color='inherit'
                            style={{
                                borderColor: '#F06D4B',
                                marginRight: '8px',
                                borderRadius: '50%'
                            }}
                        />
                        Importing Data...
                    </>
                ) : (
                    'Import Data'
                )}
            </Button>
            <Button
                onClick={exportToCSV}
                style={{
                    marginLeft: '20px',
                    float: 'right',
                    fontSize: '10px',
                    borderRadius: '20px',
                    color: '#F06D4B',
                    borderColor: '#F06D4B',
                    marginBottom: '10px'
                }}
                variant='outlined'
                startIcon={<DownloadIcon style={{ fontSize: 12 }} />}
            >
                Export Data
            </Button>
            <Button
                variant='outlined'
                onClick={() => handleOpen('add')}
                style={{
                    color: '#F06D4B',
                    borderColor: '#F06D4B',
                    float: 'right',
                    marginBottom: '10px',
                    borderRadius: '40px',
                    fontSize: '10px'
                }}
            >
                + Add Asset
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                    <TableHead sx={{ backgroundColor: '#E7E9EA' }}>
                        <TableRow>
                        <StyledTableCell style={actionsBorderStyle}>
                                {AssetsMsgResProps.body.form.action.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.invoice_number.label}
                            </StyledTableCell>
                            <StyledTableCell style={dateWidthStyle}>
                                {AssetsMsgResProps.body.form.invoice_date.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.asset_type.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.make.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.quantity.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.processor.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.ram.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.hard_disk_size.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.hard_disk_type.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.company.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.invoice_wise.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.warranty_date.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.warranty_expires_in.label}
                            </StyledTableCell>
                            <StyledTableCell style={dateWidthStyle}>
                                {AssetsMsgResProps.body.form.asset_approved_at.label}
                            </StyledTableCell>
                            <StyledTableCell style={dateWidthStyle}>
                                {AssetsMsgResProps.body.form.asset_given_at.label}
                            </StyledTableCell>
                            <StyledTableCell style={dateWidthStyle}>
                                {AssetsMsgResProps.body.form.asset_received_at.label}
                            </StyledTableCell>

                            <StyledTableCell style={dateWidthStyle}>
                                {AssetsMsgResProps.body.form.asset_return_at.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.serial_number.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.asset_status.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.assignee_comment.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.received_comment.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.return_comment.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.delivered_to.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.asset_department.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.project.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.employee_name.lable}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.handovered_type.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.emp_code.label}
                            </StyledTableCell>
                            <StyledTableCell style={remarksWidthStyle}>
                                {AssetsMsgResProps.body.form.remarks.label}
                            </StyledTableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedAssets && paginatedAssets.length > 0 ? (
                            paginatedAssets.map((asset, index) => (
                                <StyledTableRow key={index}>
                                <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={actionsBorderStyle}
                                    >
                                        &nbsp;&nbsp;&nbsp;{' '}
                                        <MoreVertIcon
                                            aria-describedby={asset.id}
                                            id={asset.id}
                                            onClick={(event) => handlePopUpClick(event, asset.id)}
                                        />
                                        <Popover
                                            style={{ marginLeft: '20px' }}
                                            id={asset.id}
                                            open={popUpOen}
                                            anchorEl={anchorEl}
                                            onClose={handlePopUpClose}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left'
                                            }}
                                        >
                                            <MenuList dense>
                                                <MenuItem
                                                    onClick={() => {
                                                        handleEditAsset();
                                                    }}
                                                >
                                                    <EditIcon />{' '}
                                                    <ListItemText inset className='pl-5'>
                                                        Edit
                                                    </ListItemText>
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        deleteAssets();
                                                    }}
                                                >
                                                    <DeleteIcon />{' '}
                                                    <ListItemText inset className='pl-5'>
                                                        Delete
                                                    </ListItemText>
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        handleReturnAsset();
                                                    }}
                                                >
                                                    <ListItemText inset className='pl-5'>
                                                        Return Asset
                                                    </ListItemText>
                                                </MenuItem>
                                            </MenuList>
                                        </Popover>
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.invoice_number ? asset.invoice_number : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.invoice_date ? asset.invoice_date : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.asset_type ? asset.asset_type : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.make ? asset.make : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.quantity ? asset.quantity : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.processor ? asset.processor : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.ram ? asset.ram : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.hard_disk_size ? asset.hard_disk_size : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.hard_disk_type ? asset.hard_disk_type : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.company ? asset.company : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.amount_or_invoice_wise
                                            ? asset.amount_or_invoice_wise
                                            : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.warranty_date ? asset.warranty_date : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.warranty_date
                                            ? calculateDaysLeft(asset.warranty_date) > 0
                                                ? `${calculateDaysLeft(asset.warranty_date)} days`
                                                : `Warranty expired ${Math.abs(
                                                      calculateDaysLeft(asset.warranty_date)
                                                  )} days ago`
                                            : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.asset_approved_at ? asset.asset_approved_at : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.asset_given_at ? asset.asset_given_at : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.asset_received_at ? asset.asset_received_at : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.asset_return_at ? asset.asset_return_at : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.serial_number ? asset.serial_number : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.status ? asset.status : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.assignee_comment ? asset.assignee_comment : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.received_comment ? asset.received_comment : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.return_comment ? asset.return_comment : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.delivered_to ? asset.delivered_to : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.department ? asset.department : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.project ? asset.project : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.user_id?.fullname ? asset.user_id?.fullname : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.handovered_type ? asset.handovered_type : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {asset.user_id?.employeeid
                                            ? asset.user_id?.employeeid
                                            : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={remarksWidthStyle}
                                    >
                                        {asset.remarks ? asset.remarks : '-'}
                                    </StyledTableCell>

                                    
                                </StyledTableRow>
                            ))
                        ) : (
                            <StyledTableRow>
                                <StyledTableCell>No Data Found.</StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component='div'
                    count={filteredAssets.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <ReturnAssets
                open={open}
                handleClose={handleClose}
                Backdrop={Backdrop}
                method={selectedMethod}
                assetDetails={selectedAssetDetails}
            />

            <AddAsset
                open={open}
                handleClose={handleClose}
                Backdrop={Backdrop}
                method={selectedMethod}
                assetDetails={selectedAssetDetails}
                reloadAssets={loadPageData}
            />
        </div>
    );
}
