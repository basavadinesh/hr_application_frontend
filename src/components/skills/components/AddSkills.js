import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Autocomplete from '@mui/material/Autocomplete';
import { createSkills, updateSkills } from '../actions/skills-actions';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import './skill.css';
import AppBar from '@mui/material/AppBar';
import { SkillsData } from '../Skills_Data'; 

// Styles for the modal
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    bgcolor: 'background.paper',
    border: 'px solid #000',
    boxShadow: 2
};

/**
 * Component to add or edit a skill.
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Whether the modal is open.
 * @param {Function} props.handleClose - Function to handle closing the modal.
 * @param {string} props.method - The method of the operation: 'add' or 'edit'.
 * @param {Object} [props.skillDetails] - Skill details for editing.
 * @param {Function} props.reloadSkills - Function to reload the list of skills.
 * @param {React.ElementType} [props.Backdrop] - Backdrop component for the modal.
 * @returns {JSX.Element} The rendered component.
 */
export default function AddSkill(props) {
    const history = useHistory();
    const [skillValues, setSkillValues] = useState({
        skill: '',
        level_type: '',
        status: 'Pending',
        user_id: ''
    });
    
    const [errors, setErrors] = useState({});
    const userId = localStorage.getItem('userId');

    // Initialize skill values and user ID on component mount and when props change
    useEffect(() => {
        if (userId) {
            setSkillValues((prevValues) => ({
                ...prevValues,
                user_id: userId
            }));
        }

        if (props.skillDetails) {
            setSkillValues((prevValues) => ({
                ...prevValues,
                skill: props.skillDetails.skill || '',
                level_type: props.skillDetails.level_type || '',
                status: 'Pending',
                userId: props.skillDetails.user_id || '',
            }));
        }
    }, [props.skillDetails]);

    /**
     * Handles input field changes.
     * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
     */
    const handleChange = (event) => {
        const { name, value } = event.target;
        setSkillValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));

        // Clear errors for the changed field
        if (name === 'skill') {
            setErrors({ ...errors, skill: '' });
        } else if (name === 'level_type') {
            setErrors({ ...errors, level_type: '' });
        }
    };

    /**
     * Handles form submission.
     */
    const handleSubmit = async () => {
        if (validate()) {
            if (props.method === 'add') {
                await addSkill();
                ClearedValues();
            } else if (props.method === 'edit') {
                await skillUpdate();
                ClearedValues();
            }
        }
    };

    /**
     * Validates the form inputs.
     * @returns {boolean} Whether the form inputs are valid.
     */
    const validate = () => {
        let isValid = true;
        if (!skillValues.skill || !skillValues.skill.trim()) {
            handleError('Skill is required', 'skill');
            isValid = false;
          }
          if (!skillValues.level_type) {
            handleError('Expertise level is required', 'level_type');
            isValid = false;
          }
         else if (isValid) {
            setErrors({});
          }
      
        return isValid;
    }

    /**
     * Sets an error message for a specific input field.
     * @param {string} error - The error message.
     * @param {string} input - The input field name.
     */
    const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
      };

     /**
     * Adds a new skill.
     */
    const addSkill = async () => {
        createSkills(skillValues)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    props.handleClose();
                    props.reloadSkills(skillValues.user_id);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    /**
     * Updates an existing skill.
     */
    const skillUpdate = async () => {
        const skillId = props.skillDetails?.id;
        updateSkills(skillId, skillValues)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    props.handleClose();
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    /**
     * Clears the form values.
     */
    const ClearedValues = () => {
        setSkillValues({
            skill: '',
            level_type: '',
            status: 'Pending',
            user_id:userId
        });
    };

    /**
     * Handles closing the modal.
     */
    const handleClose = () => {
        props.handleClose();
        setErrors({});
        ClearedValues();
    };


    // List of skill levels for the dropdown
    const Skill_level = ['Beginner', 'Intermediate', 'Competent', 'Proficient', 'Expert'];

    return (
        <Modal
            aria-labelledby='spring-modal-title'
            aria-describedby='spring-modal-description'
            open={props.open}
            onClose={props.handleClose}
            closeAfterTransition
            BackdropComponent={props.Backdrop}
            BackdropProps={{
                timeout: 500
            }}
        >
            <Card component='form' sx={style} noValidate autoComplete='off'>
                <AppBar
                    position='static'
                    sx={{ width: 650, height: 60, backgroundcolor: ' #DEECF4' }}
                >
                    <CardHeader title={props.method === 'add' ? 'Add skill' : 'Edit Skill'}>
                        {' '}
                    </CardHeader>
                    <IconButton
                        sx={{
                            position: 'absolute',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginLeft: '600px',
                            marginTop: '10px',
                            color: '#0070AC'
                        }}
                        onClick={handleClose}
                    >
                        <HighlightOffIcon />
                    </IconButton>
                </AppBar>
                <CardContent>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={6}>
                            <Typography sx={{ marginLeft: '20px' }}>Skill</Typography>
                            <Autocomplete
                                sx={{
                                    height: '70px',
                                    borderRadius: '7px solid bl',
                                    marginLeft: '20px',
                                    minWidth: 270
                                }}
                                defaultValue={props.skillDetails?.skill}
                                onChange={(event, newValue) => {
                                    setSkillValues((prevValues) => ({
                                        ...prevValues,
                                        skill: newValue
                                    }));
                                    setErrors({ ...errors, skill: '' });
                                }}
                                options={SkillsData}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        error={!!errors.skill}
                                        helperText={errors.skill}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography sx={{ marginLeft: '10px' }}>Expertise</Typography>
                            <TextField
                                select
                                name='level_type'
                                id='level_type'
                                style={{
                                    borderRadius: '7px',
                                    width: '280px',
                                    height: '55px'
                                }}
                                type='text'
                                SelectProps={{ native: true }}
                                value={skillValues.level_type}
                                onChange={handleChange}
                                error={!!errors.level_type}
                                helperText={errors.level_type}
                            >
                                <option value='' />
                                {Skill_level.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </CardContent>
                <Button
                    style={{
                        marginTop: '10px',
                        float: 'right',
                        marginRight: '20px',
                        marginBottom: '20px',
                        borderRadius: '40px',
                        backgroundColor: '#0070ac'
                    }}
                    variant='contained'
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
                <Button
                    sx={{
                        marginTop: '10px',
                        float: 'right',
                        marginRight: '20px',
                        marginBottom: '20px',
                        borderRadius: '40px',
                        backgroundColor: '#d3f0ff',
                        color: '#0070ac',
                        border: '1px solid #0070ac',
                        '&:hover': {
                            backgroundColor: '#0070ac',
                            color: '#fff'
                        }
                    }}
                    variant='contained'
                    onClick={handleClose}
                >
                    Cancel
                </Button>
            </Card>
        </Modal>
    );
}
