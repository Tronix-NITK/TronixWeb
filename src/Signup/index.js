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
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import InfoSnackIcon from '@material-ui/icons/Info';
import SuccessSnackIcon from '@material-ui/icons/CheckCircle';
import WarningSnackIcon from '@material-ui/icons/Warning';
import ErrorSnackIcon from '@material-ui/icons/Error';
import green from "@material-ui/core/es/colors/green";
import amber from "@material-ui/core/es/colors/amber";
import red from "@material-ui/core/es/colors/red";

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
    snackMessage: {
        display: 'flex',
        alignItems: 'center',
    },
    snackIcon: {
        fontSize: 20,
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    infoSnack: {
        backgroundColor: theme.palette.primary.dark,
    },
    successSnack: {
        backgroundColor: green[600],
    },
    warnSnack: {
        backgroundColor: amber[700],
    },
    errorSnack: {
        backgroundColor: red[700],
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
            college: null,
            collegeSuggestions: [],
            infoSnack: "", successSnack: "", warnSnack: "", errorSnack: "",
        };
    }

    componentDidMount() {
        fetch(`${API_SERVER}/part/info/self`,
            {
                mode: 'cors',
                credentials: 'include',
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
                    this.loadColleges((suggestions) => {
                        this.setState({
                            collegeSuggestions: suggestions,
                            email: user.email,
                            stage: "fillDetails(2)"
                        });
                    });
                    break;
                case UserGroup.PARTICIPANT:
                    this.setState({
                        stage: "completed(3)"
                    });
                    break;
                default:
                    this.setState({
                        stage: "error(4)",
                        warnSnack: "Please login as a participant",
                    });
            }
        }).catch(err => {
            // Un-auth user
            this.setState({stage: "auth(1)"});
        });
    }

    loadColleges(cb) {
        fetch(`${API_SERVER}/college/all`, {
            mode: 'cors',
            credentials: 'include',
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
                value: suggestion.name,
                label: suggestion.name,
            }));
            cb(suggestions);
        }).catch(err => {
            console.error(err);
        });
    }

    signup() {
        fetch(`${API_SERVER}/part/signup`, {
            mode: 'cors',
            credentials: 'include',
            method: "POST",
            body: JSON.stringify({
                displayName: this.state.displayName,
                college: this.state.college !== null ? this.state.college.value : "",
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (!res.ok)
                throw Error(res.statusText);
            this.setState({stage: "completed(3)"});
        }).catch(err => {
            this.setState({warnSnack: "Signup failed."});
            console.error(err);
        });
    }

    static continueWithGoogle() {
        localStorage.setItem('restore.pathname', window.location.pathname);
        window.location.href = API_SERVER + "/part/auth/login/google";
    }

    handleCollegeChange = value => {
        this.setState({
            college: value,
        });
    };

    handleTextChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    onClose() {
        if (this.props.onClose)
            this.props.onClose();
        else if (this.props.history)
            this.props.history.goBack();
    }

    handleCloseSnack() {
        this.setState({infoSnack: "", successSnack: "", warnSnack: "", errorSnack: "",});
    }

    render() {
        const {classes} = this.props;
        let stageView = null;
        switch (this.state.stage) {
            case "error(4)":
                stageView = this.getStage4View();
                break;
            case "completed(3)":
                stageView = this.getStage3View();
                break;
            case "fillDetails(2)":
                stageView = this.getStage2View();
                break;
            case "auth(1)":
                stageView = this.getStage1View();
                break;
            default:
                stageView = this.getStage0View();
        }
        return (
            <div>
                {stageView}
                <Snackbar
                    anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                    open={this.state.infoSnack.length !== 0}
                    autoHideDuration={2000}
                    onClose={this.handleCloseSnack.bind(this)}
                >
                    <SnackbarContent
                        className={classes.infoSnack}
                        message={
                            <span className={classes.snackMessage}>
                            <InfoSnackIcon className={classes.snackIcon}/>{this.state.infoSnack}
                        </span>
                        }
                    />
                </Snackbar>
                <Snackbar
                    anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                    open={this.state.successSnack.length !== 0}
                    onClose={this.handleCloseSnack.bind(this)}
                >
                    <SnackbarContent
                        className={classes.successSnack}
                        message={
                            <span className={classes.snackMessage}>
                            <SuccessSnackIcon className={classes.snackIcon}/>{this.state.successSnack}
                        </span>
                        }
                    />
                </Snackbar>
                <Snackbar
                    anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                    open={this.state.warnSnack.length !== 0}
                    onClose={this.handleCloseSnack.bind(this)}>
                    <SnackbarContent
                        className={classes.warnSnack}
                        message={
                            <span className={classes.snackMessage}>
                            <WarningSnackIcon className={classes.snackIcon}/>{this.state.warnSnack}
                        </span>
                        }
                    />
                </Snackbar>
                <Snackbar
                    anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                    open={this.state.errorSnack.length !== 0}
                    onClose={this.handleCloseSnack.bind(this)}
                >
                    <SnackbarContent
                        className={classes.errorSnack}
                        message={
                            <span className={classes.snackMessage}>
                            <ErrorSnackIcon className={classes.snackIcon}/>{this.state.errorSnack}
                        </span>
                        }
                    />
                </Snackbar>
            </div>
        );
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
                        Signup for Tronix using your Google Account.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        fullWidth
                        onClick={Signup.continueWithGoogle}
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
                        onChange={this.handleTextChange('displayName')}
                        fullWidth
                    />
                    <NoSsr>
                        <Select
                            classes={classes}
                            styles={selectStyles}
                            options={this.state.collegeSuggestions}
                            components={components}
                            value={this.state.college}
                            onChange={this.handleCollegeChange}
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

    getStage3View() {
        const {classes} = this.props;
        const history = this.props.history;
        return (
            <Dialog open={true}>
                <DialogTitle>Signup for Tronix</DialogTitle>
                <DialogContent className={classes.root}>
                    <DialogContentText>
                        Signup completed.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        fullWidth
                        onClick={() => history.push('/')}
                    >
                        Continue to Tronix
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    getStage4View() {
        const {classes} = this.props;
        const history = this.props.history;
        return (
            <Dialog open={true}>
                <DialogTitle>Signup for Tronix</DialogTitle>
                <DialogContent className={classes.root}>
                    <DialogContentText>
                        That's a no.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        fullWidth
                        onClick={() => history.push('/')}
                    >
                        Continue to Tronix
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