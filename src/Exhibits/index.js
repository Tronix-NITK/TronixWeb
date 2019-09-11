import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from "@material-ui/core/Button";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import {Link} from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import LinearProgress from "../LinearProgress";
import SimpleError from "../SimpleError";
import Container from "@material-ui/core/Container";

const styles = theme => ({
    panel: {
        ...theme.styles.translucentPaper,
    },
    flexOne: {
        flex: 1,
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
        let {showLoading, events} = this.state;
        let view;
        if (!showLoading) {
            if (events) {
                view = events.map(e => this.getExpansionPanel(e))
            } else {
                view = (
                    <SimpleError message={"Could not load exhibits"}/>
                );
            }
        } else {
            view = (
                <LinearProgress/>
            );
        }
        return (
            <Container maxWidth="md">
                {view}
            </Container>
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
                className={classes.panel}
                key={event.code}
                expanded={expandedEvent === event.code}
                onChange={this.handleExpansion(event.code)}
            >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography variant="h6">{event.name}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    {event.description}
                </ExpansionPanelDetails>
                <Divider/>
                <ExpansionPanelActions>
                    <Button component={Link} to={`/x/${event.code}`} variant={"contained"}>
                        Learn More
                    </Button>
                </ExpansionPanelActions>
            </ExpansionPanel>
        );
    };

    getEvents() {
        this.setState({showLoading: true});
        fetch(`${this.server}/pub/exhibit/briefs`, {
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
            events.sort((e1, e2) => e1.rank - e2.rank);
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