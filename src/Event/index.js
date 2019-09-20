import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import SimpleError from '../SimpleError';
import TeamIcon from '@material-ui/icons/People';
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Carousel} from 'react-responsive-carousel';
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Tooltip from "@material-ui/core/Tooltip";
import LinearProgress from "../LinearProgress";
import Container from "@material-ui/core/Container";

const styles = theme => ({
    paper: {
        ...theme.styles.translucentPaperContainer,
    },
    pdfIFrame: {
        width: "100%",
        height: "70vh",
    },
    spaceageFont: {
        ...theme.styles.spaceageFont,
    },
});

class EventDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: true,
            event: null,
        }
    }

    render() {
        const {classes} = this.props;
        let eventCode = this.props.match.params["code"];
        let {showLoading, event} = this.state;
        let view;
        if (!showLoading) {
            if (event) {
                view = (
                    <Paper className={classes.paper}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={8}>
                                <Typography variant="h4" noWrap className={classes.spaceageFont}>
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
                );
            } else {
                view = (
                    <SimpleError message={`Could not load ${eventCode}`}/>
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
        let eventCode = this.props.match.params["code"];
        this.getEvent(eventCode);
    }


    getEvent(code) {
        this.setState({showLoading: true});
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
            this.setState({event, showLoading: false});
        }).catch(err => {
            this.snack("error", err.message);
            this.setState({showLoading: false});
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
            <Typography variant="h5" gutterBottom>
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