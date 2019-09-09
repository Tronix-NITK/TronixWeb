import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import WarningIcon from '@material-ui/icons/Warning';
import Grid from "@material-ui/core/Grid";
import {Carousel} from "react-responsive-carousel";
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
                            <Grid item xs={12}>
                                <Typography variant="body1">
                                    {event.description}
                                </Typography>
                            </Grid>
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
                                        <Typography variant="h3`">
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