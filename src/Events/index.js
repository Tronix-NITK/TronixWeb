import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from "@material-ui/core/Button";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import {Link} from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import LinearProgress from "@material-ui/core/LinearProgress";

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
});

class EventsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: true,
            events: null,
            expandedEvent: null,
        }
    }

    render() {
        const {classes} = this.props;
        let {showLoading, events} = this.state;
        let view;
        if (!showLoading) {
            if (events) {
                view = (
                    <div className={classes.paper}>
                        {
                            events.map(e => this.getExpansionPanel(e))
                        }
                    </div>
                );
            } else {
                view = (
                    <Paper className={classes.paper}>
                        <Typography variant={"h3"}>
                            Could not load events
                        </Typography>
                    </Paper>
                );
            }
        } else {
            view = (
                <Paper className={classes.paper}>
                    <LinearProgress/>
                </Paper>
            );
        }
        return (
            <div className={classes.root}>
                {view}
            </div>
        );
    }

    componentDidMount() {
        this.server = this.context.server;
        this.snack = this.context.snack;
        this.getEvents();
    }

    handleExpansion = (expandedEvent) => (_, isExpanded) => {
        this.setState({expandedEvent: isExpanded ? expandedEvent : null});
    };

    getExpansionPanel = (event) => {
        const {classes} = this.props;
        const {expandedEvent} = this.state;
        return (
            <ExpansionPanel
                key={event.code}
                expanded={expandedEvent === event.code}
                onChange={this.handleExpansion(event.code)}
            >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>
                        {event.name}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    {event.description}
                </ExpansionPanelDetails>
                <Divider/>
                <ExpansionPanelActions>
                    <Button component={Link} to={`/e/${event.code}`} variant={"contained"}>
                        Learn More
                    </Button>
                    <Button
                        component={Link} to={`/register/${event.code}`} variant={"contained"}
                        color={"primary"}
                    >
                        Register
                    </Button>

                </ExpansionPanelActions>
            </ExpansionPanel>
        );
    };

    getEvents() {
        this.setState({showLoading: true});
        fetch(`${this.server}/pub/event/briefs`, {
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
            this.setState({events});
            this.setState({showLoading: false});
        }).catch(err => {
            this.snack("error", err.message);
            this.setState({showLoading: false});
        });
    }
}

EventsComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};
EventsComponent.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(EventsComponent);