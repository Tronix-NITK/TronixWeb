import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import NoSsr from "@material-ui/core/NoSsr";
import Select from 'react-select';
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'flex',
        padding: 0,
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        overflow: 'hidden',
    },
    noOptionsMessage: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    singleValue: {
        fontSize: 16,
    },
    placeholder: {
        position: 'absolute',
        left: 2,
        fontSize: 16,
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    root: {overflow: 'visible'}
});

const suggestions = [
    {label: 'NITK, Surathkal'},
    {label: 'MIT, Manipal'},
    {label: 'RVCE, Bengaluru'},
    {label: 'NITTE, Mangaluru'},
    {label: 'NITK1, Surathkal'},
    {label: 'MIT1, Manipal'},
    {label: 'RVCE1, Bengaluru'},
    {label: 'NITTE1, Mangaluru'},
    {label: 'NITK2, Surathkal'},
    {label: 'MIT2, Manipal'},
    {label: 'RVCE2, Bengaluru'},
    {label: 'NITTE2, Mangaluru'},
].map(suggestion => ({
    value: suggestion.label,
    label: suggestion.label,
}));

function NoOptionsMessage(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.noOptionsMessage}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function inputComponent({inputRef, ...props}) {
    return <div ref={inputRef} {...props} />;
}

function Control(props) {
    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}
            {...props.selectProps.textFieldProps}
        />
    );
}

function Option(props) {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}

function Placeholder(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.placeholder}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function SingleValue(props) {
    return (
        <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
            {props.children}
        </Typography>
    );
}

function ValueContainer(props) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function Menu(props) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

const components = {
    Control,
    Menu,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
};

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            college: '',
        };
    }

    handleChange = name => value => {
        this.setState({
            [name]: value,
        });
    };

    onClose() {
        if (this.props.onClose)
            this.props.onClose();
        else if (this.props.history)
            this.props.history.goBack();
    }

    render() {
        const {classes, theme} = this.props;
        const selectStyles = {
            input: base => ({
                ...base,
                color: theme.palette.text.primary,
                '& input': {
                    font: 'inherit',
                },
            }),
        };
        return (
            <Dialog open={true} onClose={this.onClose.bind(this)} classes={{paperScrollPaper: classes.root}}>
                <DialogTitle>Register</DialogTitle>
                <DialogContent className={classes.root}>
                    <DialogContentText>
                        You will need a Google account to register for Tronix.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        placeholder="Name"
                        type="text"
                        fullWidth
                    />
                    <NoSsr>
                        <Select
                            classes={classes}
                            styles={selectStyles}
                            options={suggestions}
                            components={components}
                            value={this.state.college}
                            onChange={this.handleChange('college')}
                            placeholder="College"
                            isClearable
                            fullWidth
                        />
                    </NoSsr>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        fullWidth
                    >
                        Continue with Google
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

Register.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(Register);