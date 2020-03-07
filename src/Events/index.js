import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import LinearProgress from "../LinearProgress";
import Container from "@material-ui/core/Container";
import SimpleError from "../SimpleError";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
    card: {
        ...theme.styles.translucentPaper,
    },
    media: {
        height: "20vh",
    },
    descriptionWrapper: {
        overflow: "hidden",
        display: "-webkit-box",
        "-webkit-line-clamp": 3,
        "-webkit-box-orient": "vertical",
    },
    description: {
        margin: 0,
    }
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
        let {showLoading, events} = this.state;
        let view;
        if (!showLoading) {
            if (events) {
                view = (
                    <Grid
                        container
                        justify="center"
                        alignItems="center"
                        spacing={3}
                    >
                        {events.map(e =>
                            <Grid
                                key={e.code}
                                item
                                xs={12}
                                md={4}
                            >
                                {this.getEventCard(e)}
                            </Grid>
                        )}
                    </Grid>
                );
            } else {
                view = (
                    <SimpleError message={"Could not load events"}/>
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

    getEventCard = (event) => {
        const {classes} = this.props;
        return (
            <Card className={classes.card}>
                <CardActionArea component={Link} to={`/e/${event.code}`}>
                    <CardMedia
                        className={classes.media}
                        image="/images/eventCardTest.jpg"
                        title="Contemplative Reptile"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {event.name}
                        </Typography>
                        <div className={classes.descriptionWrapper}>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                className={classes.description}
                            >
                                {event.description}
                            </Typography>
                        </div>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button
                        component={Link} to={`/register/${event.code}`} variant={"contained"}
                        color={"primary"}
                    >
                        Register
                    </Button>
                    <Button component={Link} to={`/e/${event.code}`} variant={"outlined"}>
                        Learn More
                    </Button>
                </CardActions>
            </Card>
        );
    };

    getEvents() {
        this.setState({showLoading: true});
        fetch(`${this.server.url}/pub/event/briefs`, {
            mode: this.server.mode,
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
            events.map(e => e.date = new Date(e.date));
            events.sort((e1, e2) => e1.date - e2.date);
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