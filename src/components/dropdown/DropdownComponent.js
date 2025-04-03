import React from 'react';
import { arrayOf, element, func, number, oneOfType, shape, string } from 'prop-types';
import { Column } from 'simple-flexbox';
import { createUseStyles, useTheme } from 'react-jss';
import { IconArrowUp } from 'assets/icons';

const useStyles = createUseStyles((theme) => ({
    arrowContainer: {
        position: 'absolute',
        top: -19,
        right: 15
    },
    dropdownButton: {
        alignItems: 'center',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        padding: 0,
        outline: 'none',
        position: 'relative'
    },
    dropdownContainer: {
        position: 'relative',
        display: 'inline-block'
    },
    dropdownItemsContainer: {
        background: 'white',
        border: `1px solid ${theme.color.lightGrayishBlue2}`,
        borderRadius: 5,
        minWidth: 170,
        padding: 0,
        position: 'absolute',
        width: '100%',
        top: 45, // Adjusted to match the button's bottom edge
        right: 0,
        display: 'none', // Hidden by default
        zIndex: 1000 // Ensure the dropdown is above other content
    },
    dropdownItemsContainerVisible: {
        display: 'block' // Visible when dropdown is active
    },
    dropdownItem: {
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
        fontSize: 16,
        outline: 'none',
        padding: '10px 10px',
        '&:hover': {
            background: theme.color.paleBlue
        },
        '&:after': {
            content: '" "',
            display: 'block',
            position: 'relative',
            bottom: -10,
            width: '100%',
            height: 1,
            background: theme.color.paleBlue
        },
        '&:last-child:after': {
            content: '',
            display: 'none'
        }
    }
}));

function DropdownComponent({ label, options, position }) {
    const theme = useTheme();
    const classes = useStyles({ theme });

    // Handle dropdown visibility state
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Column className={classes.dropdownContainer} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <button className={classes.dropdownButton}>
                {label}
            </button>
            <Column className={`${classes.dropdownItemsContainer} ${isOpen ? classes.dropdownItemsContainerVisible : ''}`}>
                {options.map((option, index) => (
                    <button
                        key={`option-${index}`}
                        className={classes.dropdownItem}
                        onClick={() => option.onClick && option.onClick()}
                    >
                        {option.label}
                        {index === 0 && (
                            <div className={classes.arrowContainer}>
                                <IconArrowUp />
                            </div>
                        )}
                    </button>
                ))}
            </Column>
        </Column>
    );
}

DropdownComponent.propTypes = {
    label: oneOfType([string, element]),
    options: arrayOf(
        shape({
            label: oneOfType([string, arrayOf(element)]),
            onClick: func
        })
    ),
    position: shape({
        top: number,
        right: number,
        bottom: number,
        left: number
    })
};

DropdownComponent.defaultProps = {
    position: {
        top: 45,
        right: 0
    }
};

export default DropdownComponent;
