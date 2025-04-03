import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';

function ImageUpload() {
    const [imageurl, setImageurl] = useState('');
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadedImage, setUploadedImage] = useState('');
    const [fileStatus, setFileStatus] = useState(true);
    const [loading, setLoading] = useState(false);
    const [imageKey, setImageKey] = useState(Date.now()); // Added to force re-render

    const userRole = JSON.parse(localStorage.getItem('userData'));
    const userId = userRole ? userRole.id : null; // Use userRole.id
    const history = useHistory();
    const filePickerRef = useRef();

    const isSignedUrlValid = (timestamp) => {
        const currentTime = new Date().getTime();
        return currentTime - timestamp < 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    };

    const loadPageData = async (userId) => {
        try {
            const response = await axios.get(
                `${AppConfigProps.serverRoutePrefix}/api/v1/user/${userId}`
            );
            if (response.status === AppConfigProps.httpStatusCode.ok && response.data) {
                let imageUrl = response.data.imageurl;
                console.log('Loaded image URL:', imageUrl); // Log loaded image URL

                if (!imageUrl || !imageUrl.trim()) {
                    setUploadedImage(
                        'https://a0.anyrgb.com/pngimg/1140/162/user-profile-login-avatar-heroes-user-blue-icons-circle-symbol-logo.png'
                    );
                } else {
                    const cachedSignedUrl = localStorage.getItem(`signedUrl_${userId}`);
                    const cachedTimestamp = localStorage.getItem(`signedUrlTimestamp_${userId}`);

                    if (cachedSignedUrl && cachedTimestamp && isSignedUrlValid(cachedTimestamp)) {
                        imageUrl = cachedSignedUrl;
                    } else {
                        localStorage.removeItem(`signedUrl_${userId}`);
                        localStorage.removeItem(`signedUrlTimestamp_${userId}`);

                        const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
                        const signedUrlResponse = await axios.get(
                            `${AppConfigProps.serverRoutePrefix}/generate-signed-url`,
                            { params: { filePath: fileName } }
                        );

                        if (signedUrlResponse.data && signedUrlResponse.data.signedUrl) {
                            imageUrl = signedUrlResponse.data.signedUrl;
                            localStorage.setItem(`signedUrl_${userId}`, imageUrl);
                            localStorage.setItem(
                                `signedUrlTimestamp_${userId}`,
                                new Date().getTime()
                            );
                        }
                    }
                    setUploadedImage(imageUrl);
                }
                setImageurl(response.data.imageurl);
            } else {
                await manageError(response, history);
            }
        } catch (error) {
            await manageError(error, history);
        }
    };

    const pickedHandler = (event) => {
        const pickedFile = event.target.files[0];
        if (pickedFile) {
            setFile(pickedFile);
            setFileStatus(true);
        } else {
            setFile(null);
            setFileStatus(false);
        }
    };

    const pickedImageHandler = () => {
        filePickerRef.current.click();
    };

    useEffect(() => {
        if (!file) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file]);

    const handleClick = async () => {
        try {
            if (!file) {
                console.log('No file selected for upload');
                return;
            }

            setLoading(true);

            const formData = new FormData();
            formData.append('image', file);
            console.log('Sending file with name', file.name);

            const response = await axios.post(
                `${AppConfigProps.serverRoutePrefix}/api/v1/user/employeeImage/${userId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 200) {
                const newImageUrl = response.data.imageurl;
                console.log('New image URL:', newImageUrl); // Log new image URL

                const fileName = newImageUrl.substring(newImageUrl.lastIndexOf('/') + 1);
                const signedUrlResponse = await axios.get(
                    `${AppConfigProps.serverRoutePrefix}/generate-signed-url`,
                    { params: { filePath: fileName } }
                );

                if (signedUrlResponse.data && signedUrlResponse.data.signedUrl) {
                    const updatedImageUrl = signedUrlResponse.data.signedUrl;
                    console.log('Updated image URL:', updatedImageUrl);

                    localStorage.removeItem(`signedUrl_${userId}`);
                    localStorage.removeItem(`signedUrlTimestamp_${userId}`);

                    // Update localStorage with the new signed URL and timestamp
                    localStorage.setItem(`signedUrl_${userId}`, updatedImageUrl);
                    localStorage.setItem(`signedUrlTimestamp_${userId}`, new Date().getTime());

                    setUploadedImage(updatedImageUrl);
                    setImageKey(Date.now()); // Update key to force re-render

                    // Reset file and preview URL
                    setFile(null);
                    setPreviewUrl(null);
                    console.log('Image uploaded and updated successfully');
                } else {
                    console.error('Failed to fetch signed URL');
                }
            } else {
                console.error('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image', error);
        } finally {
            setLoading(false);
            window.location.reload();
        }
    };

    useEffect(() => {
        if (userId) {
            loadPageData(userId);
        }
    }, [userId]);

    console.log('Uploaded Image', uploadedImage);

    return (
        <div className='imgcard'>
            <input
                type='file'
                id='image-upload'
                ref={filePickerRef}
                style={{ display: 'none' }}
                accept='.jpg,.png,.jpeg'
                onChange={pickedHandler}
            />
            <div className={`image-upload center`}>
                <div className='image-upload__preview'>
                    {previewUrl ? (
                        <img
                            key={imageKey} // Add key here to force re-render
                            src={previewUrl}
                            alt='preview'
                            style={{
                                width: '250px',
                                height: '250px',
                                borderRadius: '50%'
                            }}
                        />
                    ) : (
                        <Button
                            className='imagebutton'
                            type='button'
                            style={{ width: '180px', height: '178px', borderRadius: '50%' }}
                            onClick={pickedImageHandler}
                        >
                            <img
                                key={imageKey} // Add key here to force re-render
                                src={uploadedImage}
                                alt='done'
                                style={{
                                    width: '180px',
                                    height: '178px',
                                    borderRadius: '50%'
                                }}
                            />
                        </Button>
                    )}
                </div>
            </div>
            <Button
                className='editimagebutton'
                type='button'
                style={{ width: '60px', height: '58px', borderRadius: '50%' }}
                onClick={pickedImageHandler}
            >
                <FiEdit />
            </Button>
            <div>
                <Button
                    style={{ width: '110px', marginTop: '10px', borderRadius: '20px' }}
                    variant='contained'
                    onClick={handleClick}
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Save'}
                </Button>
            </div>
        </div>
    );
}

export default ImageUpload;
