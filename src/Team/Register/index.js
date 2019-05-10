import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button/index";
import Dialog from '@material-ui/core/Dialog/index';
import DialogTitle from "@material-ui/core/DialogTitle/index";
import DialogContent from "@material-ui/core/DialogContent/index";
import DialogContentText from "@material-ui/core/DialogContentText/index";
import DialogActions from "@material-ui/core/DialogActions/index";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AppContext from "../../AppContext";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import CopyIcon from "@material-ui/icons/FileCopy";

const API_SERVER = "https://tronixserver.herokuapp.com";

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    iconButton: {
        padding: 10,
    },
    paperWrap: {
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
    },
    inputWrap: {
        marginLeft: 8,
        flex: 1,
    },
    divider: {
        width: 1,
        height: 28,
        margin: 4,
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
        let view;
        if (this.state.linkID.length)
            view = this.getState2View();
        else
            view = this.getState1View();
        return view;
    }

    getState1View() {
        const {classes} = this.props;
        const title = "Register for " + (this.state.eventName ? `${this.state.eventName}` : "Tronix events");
        const menu = this.state.events.map(e => <MenuItem key={`e_${e}`} value={e}>{e}</MenuItem>);
        return (
            <Dialog
                open={true}
                onClose={this.onClose.bind(this)}
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Create a team to participate
                    </DialogContentText>
                </DialogContent>
                <DialogContent>
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
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        onClick={this.onClose.bind(this)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={this.onRegister.bind(this)}
                    >
                        Register
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    getState2View() {
        const {classes} = this.props;
        const title = `Registered for ${this.state.eventName}!`;
        const linkID = this.state.linkID;
        return (
            <Dialog
                open={true}
                onClose={this.onClose.bind(this)}
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Share the team invite link
                    </DialogContentText>
                </DialogContent>
                <DialogContent>
                    <Paper className={classes.paperWrap} elevation={1}>
                        <div className={classes.inputWrap}>
                            {`https://tronixweb.herokuapp.com/j/${linkID}`}
                        </div>
                        <Divider className={classes.divider}/>
                        <Tooltip title="Copy Link">
                            <IconButton
                                className={classes.iconButton}
                                onClick={copyToClipboard.bind(null, linkID)}
                            >
                                <CopyIcon fontSize="small"/>
                            </IconButton>
                        </Tooltip>
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        onClick={this.resetFields.bind(this)}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={copyToClipboard.bind(null, linkID)}
                    >
                        Copy Link
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    componentDidMount() {
        this.snack = this.context.snack;
        this.getEvents((err, events) => {
            if (err)
                this.snack("error", err.message);
            else
                this.setState({events});
        });
    }

    handleChange = name => event => {
        this.setState({[name]: event.target.value});
    };

    getEvents(cb) {
        fetch(`${API_SERVER}/event/names`, {
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
        fetch(`${API_SERVER}/part/team/register`, {
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