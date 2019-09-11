import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {Carousel} from "react-responsive-carousel";
import LinearProgress from "../LinearProgress";
import SimpleError from "../SimpleError";
import Container from "@material-ui/core/Container";

const styles = theme => ({
    paper: {
        ...theme.styles.translucentPaperContainer,
    },
});

class EventDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
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

export default withStyles(styles, {withTheme: true})(EventDisplay);