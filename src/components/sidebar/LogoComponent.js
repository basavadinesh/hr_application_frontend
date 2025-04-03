import React from 'react';
import { Row } from 'simple-flexbox';
import { createUseStyles, useTheme } from 'react-jss';
import sideBarLogo from 'assets/sideBar-Logo.png'
import './LogoComponent.css';


// Styles
const useStyles = createUseStyles((theme) => ({
    container: {
        marginLeft: 32,
        marginRight: 32
    },
    title: {
        ...theme.typography.cardTitle,
        color: theme.color.grayishBlue,
        opacity: 0.7,
        marginLeft: 12
    }
}));

// Main Component
function LogoComponent() {
    // Theme and Styles
    const theme = useTheme();
    const classes = useStyles({ theme });
    return (
        <Row >
            <img className='ensarlogo' sx={{width: '230px'}}
            src={sideBarLogo}
            alt={"side bar logo"}
            />
            <h6 className='admin'>Admin</h6>
        </Row>
    );
}

export default LogoComponent;
