import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getAssets, viewAssetsDetails, deleteAsset } from '../actions/assets-actions';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import { AssetsMsgResProps } from '../messeges/assets-properties';
import AddAsset from './Addassets';
import Backdrop from '@mui/material/Backdrop';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReturnAssets from './Returnasset';
import Input from '@mui/material/Input';
import DownloadIcon from '@mui/icons-material/Download';
import TablePagination from '@mui/material/TablePagination';

// Styled components for table cells and rows
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.gray,
        color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));

// Inline style for column borders
const columnBorderStyle = {
    borderRight: '1px solid #ccc' // Adjust the border color and style as needed
};

export default function Asset() {
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const history = useHistory();
    const [assets, setAssets] = useState(null);
    const [open, setOpen] = React.useState(false);
    const userId = localStorage.getItem('userId');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedAssetID, setSelectedAssetID] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedAssetDetails, setSelectedAssetDetails] = useState(null);


    const handleOpen = async (event) => {
        console.log(event, 'method');
        if (event === 'add') {
            await setSelectedAssetDetails(null);
        }
        await setSelectedMethod(event);
        await setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        loadPageData(userId);
        handlePopUpClose();
    };

    const handlePopUpClick = (event, astId) => {
        setSelectedAssetID(astId);
        setAnchorEl(event.currentTarget);
    };

    const handlePopUpClose = () => {
        setAnchorEl(null);
    };

    const popUpOen = Boolean(anchorEl);

 
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredAssets = assets
        ? assets.filter(
              (item) =>
                  item.asset_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.serial_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (item.assignee_comment &&
                      item.assignee_comment.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (item.received_comment &&
                      item.received_comment.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        : [];

    const paginatedAssets = filteredAssets.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    const loadPageData = async (userId) => {
        try {
            const res = await getAssets(_cancelToken);

            if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                const assetData = res.data.content || res.data;
                const userAssets = assetData.filter(
                    (asset) => asset.user_id.id.toString() === userId
                );
                setAssets(userAssets);
            } else {
                await manageError(res, history);
            }
        } catch (err) {
            await manageError(err, history);
        }
    };

    // Load assets data when the component mounts
    useEffect(() => {
        const userId = localStorage.getItem('userId');

        if (userId) {
            loadPageData(userId);
        }
    }, []);

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

    const handleReturnAsset = async () => {
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
        await handleOpen('return');
    };

  

    const exportToCSV = () => {
        const csvRows = [];
        // Adding headers
        csvRows.push(
            [
                'asset_type',
                'serial_number',
                'asset_given_at',
                'asset_approved_at',
                'asset_received_at',
                'asset_return_at',
                'assignee_comment',
                'received_comment',
                'return_comment',
                'status'
            ].join(',')
        );
        // Adding data rows
        filteredAssets.forEach((asset) => {
            const rowData = [
                asset.asset_type || '-',
                asset.serial_number || '-',
                asset.asset_given_at || '-',
                asset.asset_approved_at || '-',
                asset.asset_received_at || '-',
                asset.asset_return_at || '-',
                asset.assignee_comment || '-',
                asset.received_comment || '-',
                asset.return_comment || '-',
                asset.status || '-'
                // asset.documents && asset.documents.length > 0
                //     ? asset.documents.map((doc) => doc.filename).join(', ')
                //     : '-'
            ];
            csvRows.push(rowData.join(','));
        });
        // Joining rows with newlines
        const csvData = csvRows.join('\n');
        // Creating a Blob with CSV data
        const blob = new Blob([csvData], { type: 'text/csv' });
        // Creating an anchor tag with Blob URL
        const blobUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = 'Asset_data.csv';
        // Triggering anchor click to download CSV
        anchor.click();
        // Cleanup
        URL.revokeObjectURL(blobUrl);
    };

    return (
        <div>
            <Button
                variant='outlined'
                onClick={() => handleOpen('add')}
                style={{
                    color: '#F06D4B',
                    borderColor: '#F06D4B',
                    float: 'right',
                    fontSize: '12px',
                    marginBottom: '10px',
                    borderRadius: '40px'
                }}
            >
                + Add Asset
            </Button>

            <Input
                type='text'
                placeholder='Search ... Assets'
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                    color: '#0070ac',
                    marginBottom: 2,
                    padding: 1,
                    fontSize: 12,
                    width: 300, // Adjust the width as needed
                    borderRadius: 4,
                    border: '2px solid #0070ac',
                    '&:focus': {
                        borderColor: '#0070ac', // Change color on focus
                        boxShadow: (theme) => `0 0 0 0.2rem ${theme.palette.primary.main}`
                    }
                }}
            />

            <Button
                onClick={exportToCSV}
                style={{
                    marginLeft: '20px',
                    float: 'right',
                    fontSize: 12,
                    // fontSize: '10px',
                    borderRadius: '20px',
                    color: '#F06D4B',
                    borderColor: '#F06D4B',
                    marginBottom: '10px',
                    marginRight: '10px'
                }}
                // variant='contained'
                variant='outlined'
                // color='primary'
                startIcon={<DownloadIcon style={{ fontSize: 12 }} />}
            >
                Export to CSV
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                    <TableHead sx={{ backgroundColor: '#E7E9EA' }}>
                        <TableRow>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.asset_type.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.serial_number.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.asset_given_at.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.asset_approved_at.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.asset_received_at.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.assignee_comment.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.received_comment.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {AssetsMsgResProps.body.form.action.label}
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
                                        style={columnBorderStyle}
                                    >
                                        {asset.asset_type ? asset.asset_type : '-'}
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
                                        {asset.asset_given_at ? asset.asset_given_at : '-'}
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
                                        {asset.asset_received_at ? asset.asset_received_at : '-'}
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
                                    {/* <StyledTableCell component='th' scope='row'>
                                        {asset.assetdate ? asset.assetdate : '-'}
                                    </StyledTableCell> */}
                                    {/* <StyledTableCell component='th' scope='row'>
                                        {asset.assetdate
                                            ? AppUtils.getDateFormat(asset.assetdate)
                                            : '-'}
                                    </StyledTableCell> */}
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
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
                    count={paginatedAssets.length}
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
