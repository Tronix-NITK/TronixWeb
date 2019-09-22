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
import AppContext from "../AppContext";
import {Link} from "react-router-dom";
import Container from "@material-ui/core/Container";

const dialogWidth = "xs";
const styles = theme => ({
    dialog: {},
    rootPaper: {
        ...theme.styles.translucentPaperContainer,
    },
    paperButton: {
        marginTop: theme.spacing(4),
        width: "100%",
    },
    dialogButton: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'flex',
        padding: 0,
        height: 'auto',
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        overflow: 'hidden',
    },
    noOptionsMessage: {
        padding: theme.spacing(1, 2),
    },
    singleValue: {
        fontSize: 16,
    },
    placeholder: {
        position: 'absolute',
        left: 2,
        bottom: 6,
        fontSize: 16,
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing(1),
        left: 0,
        right: 0,
    },
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
        };
    }

    render() {
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
            <Container maxWidth="md">
                {stageView}
            </Container>
        );
    }

    componentDidMount() {
        this.server = this.context.server;
        this.snack = this.context.snack;
        fetch(`${this.server}/part/auth/user`,
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
                    this.snack("warn", "Please login as a participant");
                    this.setState({
                        stage: "error(4)",
                    });
            }
        }).catch(err => {
            // Un-auth user
            this.setState({stage: "auth(1)"});
        });
    }

    loadColleges(cb) {
        fetch(`${this.server}/pub/college`, {
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
            this.snack("error", err.message);
            cb([]);
        });
    }

    signup() {
        fetch(`${this.server}/part/signup`, {
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
            this.snack("warn", err.message);
        });
    }

    continueWithGoogle() {
        // localStorage.setItem('restore.pathname', window.location.pathname);
        window.location.href = this.server + "/part/auth/login/google";
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

    getStage0View() {
        const {classes} = this.props;
        return (
            <Dialog
                fullWidth
                maxWidth={dialogWidth}
                open={true}
                className={classes.dialog}>
                <DialogTitle>Signup</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please wait.
                    </DialogContentText>
                </DialogContent>
                <DialogContent>
                    <LinearProgress/>
                </DialogContent>
                <DialogActions/>
            </Dialog>
        );
    }

    getStage1View() {
        const {classes} = this.props;
        return (
            <Dialog
                fullWidth
                maxWidth={dialogWidth}
                open={true}
                onClose={this.onClose.bind(this)} className={classes.dialog}>
                <DialogTitle>Signup</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Signup for Tronix using your Google Account.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.dialogButton}
                        fullWidth
                        onClick={this.continueWithGoogle.bind(this)}
                    >
                        Continue
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
            <Container maxWidth="sm">
                <Paper className={classes.rootPaper}>
                    <Typography variant="h4" gutterBottom>Signup</Typography>
                    <Typography variant="subtitle1" gutterBottom> Complete signup by filling your details </Typography>
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
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.paperButton}
                        onClick={this.signup.bind(this)}
                    >
                        Complete signup
                    </Button>
                </Paper>
            </Container>
        );
    }

    getStage3View() {
        const {classes} = this.props;
        return (
            <Dialog
                fullWidth
                maxWidth={dialogWidth}
                open={true}
                onClose={this.onClose.bind(this)}
                className={classes.dialog}>
                <DialogTitle>Signup</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Signup completed.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.dialogButton}
                        fullWidth
                        component={Link} to={'/'}
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    getStage4View() {
        const {classes} = this.props;
        return (
            <Dialog
                fullWidth
                maxWidth={dialogWidth}
                open={true}
                onClose={this.onClose.bind(this)}
                className={classes.dialog}>
                <DialogTitle>Signup</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        That's a no.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.dialogButton}
                        fullWidth
                        component={Link} to={'/'}
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

Signup.propTypes = {
    classes: PropTypes.object.isRequired,
};
Signup.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(Signup);