import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button/index";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AppContext from "../../AppContext";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
    root: {
        ...theme.styles.horizontalCenter,
    },
    rootPaper: {
        margin: theme.spacing(2),
        padding: theme.spacing(4),
        maxWidth: "600px",
    },
    actionButtonContainer: {
        display: "flex",
        flexDirection: "row-reverse",
        marginTop: theme.spacing(2),
    },
    button: {
        marginLeft: theme.spacing(2),
    },
    paperWrap: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2),
    },
});

function copyToClipboard(text) {
    const dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute("value", text);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            teamName: "",
            teamContact: "",
            eventName: "",
            linkID: "",
        };
    }

    render() {
        const {classes} = this.props;
        let view;
        if (this.state.linkID.length)
            view = this.getState2View();
        else
            view = this.getState1View();
        return (
            <div className={classes.root}>
                {view}
            </div>
        );
    }

    getState1View() {
        const {classes} = this.props;
        const title = "Register for " + (this.state.eventName ? `${this.state.eventName}` : "events");
        const menu = this.state.events.map(e =>
            <MenuItem key={`e_${e.code}`} value={e.name}>{e.name}</MenuItem>
        );
        return (
            <Paper className={classes.rootPaper}>
                <Typography variant="h4" gutterBottom>{title}</Typography>
                <Typography variant="subtitle1" gutterBottom>Create a team to participate.</Typography>
                <TextField
                    autoFocus
                    margin="dense"
                    placeholder="Team name"
                    type="text"
                    onChange={this.handleChange("teamName")}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    placeholder="Phone number"
                    type="text"
                    onChange={this.handleChange("teamContact")}
                    fullWidth
                />
                <Select
                    value={this.state.eventName}
                    onChange={this.handleChange("eventName")}
                    displayEmpty
                    fullWidth
                >
                    <MenuItem value="" disabled>
                        Select an event
                    </MenuItem>
                    {menu}
                </Select>
                <div className={classes.actionButtonContainer}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={this.onRegister.bind(this)}
                    >
                        Register
                    </Button>
                    <Button
                        variant="contained"
                        className={classes.button}
                        onClick={this.onClose.bind(this)}
                    >
                        Cancel
                    </Button>
                </div>
            </Paper>
        );
    }

    getState2View() {
        const {classes} = this.props;
        const title = `Registered for ${this.state.eventName}!`;
        const linkID = this.state.linkID;
        return (
            <Paper className={classes.rootPaper}>
                <Typography variant="h4" gutterBottom>{title}</Typography>
                <Typography variant="subtitle1" gutterBottom>Share the team invite link.</Typography>
                <Paper className={classes.paperWrap}>
                    <Typography>
                        {`https://tronixweb.herokuapp.com/j/${linkID}`}
                    </Typography>
                </Paper>
                <div className={classes.actionButtonContainer}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={copyToClipboard.bind(null, linkID)}
                    >
                        Copy Link
                    </Button>
                    <Button
                        variant="contained"
                        className={classes.button}
                        onClick={this.resetFields.bind(this)}
                    >
                        Back
                    </Button>
                </div>
            </Paper>
        );
    }

    componentDidMount() {
        this.server = this.context.server;
        this.snack = this.context.snack;
        this.getEvents((err, events) => {
            if (err)
                this.snack("error", err.message);
            else {
                this.setState({events});
                const eventCode = this.props.match.params["code"];
                if (!eventCode) return;
                const selectedEvent = events.find(e => e.code === eventCode);
                if (!selectedEvent) return;
                this.setState({eventName: selectedEvent.name});
            }
        });
    }

    handleChange = name => event => {
        this.setState({[name]: event.target.value});
    };

    getEvents(cb) {
        fetch(`${this.server}/pub/event/namesAndCodes`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
            headers: {
                'Accept': 'application/json',
            }
        }).then((res) => {
            if (!res.ok)
                throw Error(res.statusText);
            else
                return res.json();
        }).then((events) => {
            cb(null, events);
        }).catch(err => {
            cb(err, null);
        });
    }

    onClose() {
        if (this.props.onClose)
            this.props.onClose();
        else if (this.props.history)
            this.props.history.goBack();
    }

    onRegister() {
        const data = {
            teamName: this.state.teamName,
            eventName: this.state.eventName,
            contact: this.state.teamContact
        };
        this.register(data);
    }

    register(data) {
        fetch(`${this.server}/part/team/register`, {
            mode: 'cors',
            credentials: 'include',
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (!res.ok)
                throw Error(res.statusText);
            else
                return res.json();
        }).then((linkID) => {
            this.snack("success", "Registered");
            this.setState({linkID: linkID});
        }).catch(err => {
            this.snack("error", err.message);
        });
    }

    resetFields() {
        this.setState({
            eventName: "",
            linkID: "",
        });
    }
}

Register.propTypes = {
    classes: PropTypes.object.isRequired,
};
Register.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(Register);