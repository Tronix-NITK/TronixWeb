import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import WarningIcon from '@material-ui/icons/Warning';
import TeamIcon from '@material-ui/icons/People';
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Carousel} from 'react-responsive-carousel';
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Tooltip from "@material-ui/core/Tooltip";
import LinearProgress from "@material-ui/core/LinearProgress";

const styles = theme => ({
    root: {
        ...theme.styles.horizontalCenter,
    },
    paper: {
        ...theme.styles.paper,
        margin: theme.spacing(2),
        padding: theme.spacing(3),
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
        let eventCode = this.props.match.params["code"];
        let {showErrorIcon, event} = this.state;
        if (event != null) {
            return (
                <div className={classes.root}>
                    <Paper className={classes.paper}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={8}>
                                <Typography variant="h3">
                                    {event.name}
                                </Typography>
                            </Grid>
                            <Hidden xsDown>
                                <Grid item xs={4}>
                                    <Button
                                        variant={"contained"}
                                        component={Link}
                                        to={`/register/${event.code}`}
                                        fullWidth
                                    >
                                        Register
                                    </Button>
                                </Grid>
                            </Hidden>
                            <Grid item xs={7}>
                                <Typography variant="body1">
                                    {
                                        event.date.toLocaleDateString("en-US", {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })
                                    }
                                </Typography>
                            </Grid>
                            <Grid
                                justify="flex-end"
                                item xs={5} container spacing={1}>
                                <Grid item>
                                    <Tooltip title={"Max team size"}>
                                        <TeamIcon/>
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1">
                                        {event.teamSize}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1">
                                    {event.description}
                                </Typography>
                            </Grid>
                            <Hidden smUp>
                                <Grid item xs={12}>
                                    <Button
                                        variant={"contained"}
                                        component={Link}
                                        to={`/register/${event.code}`}
                                        fullWidth
                                    >
                                        Register
                                    </Button>
                                </Grid>
                            </Hidden>
                            {
                                event.gallery.length ?
                                    <Grid item xs={12}>
                                        <Carousel
                                            autoPlay={true}
                                            showThumbs={false}
                                            interval={2000}
                                            infiniteLoop={true}
                                            dynamicHeight={true}
                                            showStatus={false}
                                            useKeyboardArrows={true}
                                        >
                                            {
                                                event.gallery.map(url => (
                                                    <img key={url} src={url} alt={":("}/>
                                                ))
                                            }
                                        </Carousel>
                                    </Grid> : null
                            }
                            {
                                event.problemStatement ?
                                    <Grid item xs={12}>
                                        <PSComponent
                                            link={event.problemStatement}
                                            classes={classes}
                                        />
                                    </Grid> : null
                            }
                        </Grid>
                    </Paper>
                </div>
            );
        } else {
            return (
                <div className={classes.root}>
                    <Paper className={classes.paper}>
                        <Grid justify="space-between" container>
                            {
                                showErrorIcon ?
                                    <Grid item>
                                        <Typography variant="h3">
                                            {eventCode}
                                        </Typography>
                                    </Grid> : null
                            }
                            {
                                showErrorIcon ?
                                    <Grid item>
                                        <WarningIcon fontSize="large"/>
                                    </Grid> : null
                            }
                            {
                                !showErrorIcon ?
                                    <Grid item xs={12}>
                                        <LinearProgress/>
                                    </Grid> : null
                            }
                        </Grid>
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
        fetch(`${this.server}/pub/event/ofCode/${code}`, {
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

function PSComponent(props) {
    const {classes, link} = props;
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Problem Statement
            </Typography>
            <iframe
                className={classes.pdfIFrame}
                title="Problem Statement"
                src={link}
            />
        </div>
    );
}

export default withStyles(styles, {withTheme: true})(EventDisplay);