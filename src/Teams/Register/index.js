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
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import MUILink from '@material-ui/core/Link';

const styles = theme => ({
    paper: {
        ...theme.styles.translucentPaperContainer,
    },
    button: {
        margin: theme.spacing(2, 0, 0, 1),
    },
    paperWrap: {
        padding: theme.spacing(2),
    },
});

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
        return (
            <Container maxWidth="md">
                {view}
            </Container>
        );
    }

    getState1View() {
        const {classes} = this.props;
        const title = "Register for " + (this.state.eventName ? `${this.state.eventName}` : "events");
        const menu = this.state.events.map(e =>
            <MenuItem key={`e_${e.code}`} value={e.name}>{e.name}</MenuItem>
        );
        return (
            <Paper className={classes.paper}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="h4">{title}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">
                            Create a team to participate.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            margin="dense"
                            placeholder="Team name"
                            type="text"
                            onChange={this.handleChange("teamName")}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            margin="dense"
                            placeholder="Phone number"
                            type="tel"
                            onChange={this.handleChange("teamContact")}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
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
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2">
                            Checkout the <MUILink component={Link} to="/faq">FAQ</MUILink> if you face any problems.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <div dir="rtl">
                            <Button
                                variant="contained"
                                className={classes.button}
                                color="primary"
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
                    </Grid>
                </Grid>
            </Paper>
        );
    }

    getState2View() {
        const {classes} = this.props;
        const title = `Registered for ${this.state.eventName}!`;
        const linkID = this.state.linkID;
        const link = `https://${window.location.host}/j/${linkID}`;
        return (
            <Paper className={classes.paper}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom>{title}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>Share the team invite link.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paperWrap}>
                            <MUILink href={link}>
                                {link}
                            </MUILink>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <div dir="rtl">
                            <Button
                                variant="contained"
                                className={classes.button}
                                color="primary"
                                onClick={() => this.copyToClipBoard(link)}
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
                    </Grid>
                </Grid>
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

    copyToClipBoard(content){
        navigator.clipboard.writeText(content);
        this.snack("success", "Copied!")
    }
}

Register.propTypes = {
    classes: PropTypes.object.isRequired,
};
Register.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(Register);