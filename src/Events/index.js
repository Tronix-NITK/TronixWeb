import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {Link} from "react-router-dom";

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
        }
    }

    render() {
        const {classes} = this.props;
        let {showLoading, events} = this.state;
        if (!showLoading) {
            if (events) {
                return (
                    <div className={classes.root}>
                        <List>
                            {
                                events.map(event => (
                                    <ListItem button component={Link} key={`li_${event.code}`} to={`/e/${event.code}`}>
                                        <ListItemText primary={event.name}/>
                                    </ListItem>
                                ))
                            }
                        </List>
                    </div>
                );
            } else {
                return (
                    <div className={classes.root}>
                        <Paper>
                            <Typography variant={"h1"}>
                                Could not find events
                            </Typography>
                        </Paper>
                    </div>
                );
            }
        } else {
            return (
                <div className={classes.root}>
                    <CircularProgress/>
                </div>
            );
        }
    }

    componentDidMount() {
        this.server = this.context.server;
        this.snack = this.context.snack;
        this.getEvents();
    }

    getEvents() {
        this.setState({showLoading: true});
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