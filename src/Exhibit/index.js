import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import WarningIcon from '@material-ui/icons/Warning';
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
    root: {
        display: "flex",
        justifyContent: "center",
    },
    paper: {
        margin: theme.spacing(2, 2),
        padding: theme.spacing(4, 3),
        maxWidth: "700px",
        width: "100%",
    },
    spaceBetween: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    pdfIFrame: {
        width: "100%",
        height: "70vh",
    }
});

class EventDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showErrorIcon: false,
            event: null,
        }
    }

    render() {
        const {classes} = this.props;
        let eventName = this.props.match.params["name"];
        let {showErrorIcon, event} = this.state;
        if (event != null) {
            return (
                <div className={classes.root}>
                    <Paper className={classes.paper}>
                        <Typography variant="h3" gutterBottom>
                            {event.name}
                        </Typography>
                        <Typography variant="body1">
                            {event.description}
                        </Typography>
                    </Paper>
                </div>
            );
        } else {
            return (
                <div className={classes.root}>
                    <Paper className={classes.paper}>
                        <div className={classes.spaceBetween}>
                            <Typography variant="h2">
                                {eventName}
                            </Typography>
                            {showErrorIcon ? <WarningIcon fontSize="large"/> : <CircularProgress/>}
                        </div>
                    </Paper>
                </div>
            );
        }
    }

    componentDidMount() {
        this.server = this.context.server;
        this.snack = this.context.snack;
        let eventCode = this.props.match.params["code"];
        this.getEvent(eventCode);
    }


    getEvent(code) {
        fetch(`${this.server}/pub/exhibit/ofCode/${code}`, {
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
        }).then((event) => {
            event.date = new Date(event.date);
            this.setState({event});
        }).catch(err => {
            this.snack("error", err.message);
            this.setState({showErrorIcon: true});
        });
    }
}

EventDisplay.propTypes = {
    classes: PropTypes.object.isRequired,
};
EventDisplay.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(EventDisplay);