import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {LinearProgress, withStyles} from "@material-ui/core";
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
import UserGroup from "../helpers/userGroup";

const API_SERVER = "https://tronixserver.herokuapp.com";

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

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: "unknown(0)",
            email: "",
            displayName: "",
            college: "",
            collegeSuggestions: [],
        };
    }

    componentDidMount() {
        switch (this.state.stage) {
            default: {
                fetch(`${API_SERVER}/part/info/self`,
                    {
                        method: "GET",
                        headers: {
                            'Accept': 'application/json',
                        },
                    }).then((res) => {
                    if (res.ok)
                        return res.json();
                    else
                        throw Error(res.statusText);
                }).then(user => {
                    switch (user.group) {
                        case UserGroup.URP:
                            this.loadColleges();
                            this.setState({stage: "fillDetails(2)"});
                            break;
                        default:
                            // Error
                            break;
                    }
                }).catch(err => {
                    // Un-auth user
                    this.setState({stage: "auth(1)"});
                });
            }
                break;
        }
    }

    loadColleges() {
        fetch(`${API_SERVER}/college/all`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
            }
        }).then((res) => {
            if (res.ok)
                return res.json();
            else
                throw Error(res.statusText);
        }).then(colleges => {
            let suggestions = colleges.map(suggestion => ({
                value: suggestion.label,
                label: suggestion.label,
            }));
            this.setState({collegeSuggestions: suggestions});
        }).catch(err => {
            console.error(err);
        });
    }

    signup() {
        fetch(`${API_SERVER}/part/signup`, {
            method: "POST",
            body: JSON.stringify({
                displayName: this.state.displayName,
                college: this.state.college,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (!res.ok)
                throw Error(res.statusText);
        }).catch(err => {
            console.error(err);
        });
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
        switch (this.state.stage) {
            case "fillDetails(2)":
                return this.getStage2View();
            case "auth(1)":
                return this.getStage1View();
            default:
                return this.getStage0View();
        }
    }

    getStage0View() {
        const {classes} = this.props;
        return (
            <Dialog open={true}>
                <DialogTitle>Signup for Tronix</DialogTitle>
                <DialogContent className={classes.root}>
                    <DialogContentText>
                        Please wait
                    </DialogContentText>
                    <LinearProgress/>
                </DialogContent>
            </Dialog>
        );
    }

    getStage1View() {
        const {classes} = this.props;
        return (
            <Dialog open={true} onClose={this.onClose.bind(this)}>
                <DialogTitle>Signup</DialogTitle>
                <DialogContent className={classes.root}>
                    <DialogContentText>
                        You need a Google account to signup for Tronix.
                    </DialogContentText>
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

    getStage2View() {
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
                <DialogTitle>Signup</DialogTitle>
                <DialogContent className={classes.root}>
                    <DialogContentText>
                        Complete signup by filling your details
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        placeholder="Email"
                        type="email"
                        value={this.state.email}
                        disabled
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        placeholder="Name"
                        type="text"
                        value={this.state.displayName}
                        onChange={this.handleChange('displayName')}
                        fullWidth
                    />
                    <NoSsr>
                        <Select
                            classes={classes}
                            styles={selectStyles}
                            options={this.state.collegeSuggestions}
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
                        onClick={this.signup.bind(this)}
                    >
                        Complete signup
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

Signup.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(Signup);