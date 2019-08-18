import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import SignupIcon from '@material-ui/icons/VerifiedUser';
import DetailsIcon from '@material-ui/icons/Create';
import RegisterIcon from '@material-ui/icons/Event';
import InviteIcon from '@material-ui/icons/GroupAdd';
import StepContent from "@material-ui/core/StepContent";
import StepLabel from "@material-ui/core/StepLabel";

const styles = theme => ({
    title: {
        padding: theme.spacing(5, 0),
        display: "flex",
        justifyContent: "center",
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    fab: {
        margin: theme.spacing(1),
    },
    registerStepperContainer: {
        // padding: theme.spacing(2),
    },
});

class HomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: null,
            exhibits: null,
        };
    }

    render() {
        const {classes} = this.props;
        const {events} = this.state;
        let eventsComponent = null;
        if (events != null)
            eventsComponent = this.eventsComponent();
        let makeTeamSteps = this.getMakeTeamSteps();
        return (
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    <div className={classes.title}>
                        <Typography variant={"h1"}>
                            TroniX
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div>
                        Events
                        {eventsComponent}
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div>Exe</div>
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.registerStepperContainer}>
                        <Stepper nonLinear activeStep={null} alternativeLabel orientation={"Horizontal"}>
                            {makeTeamSteps.map(stepData => (
                                <Step key={stepData.label}>
                                    <StepButton
                                        icon={stepData.icon}
                                        onClick={this.handleMakeTeamStepClick.bind(this, stepData.label)}
                                    >
                                        <StepLabel>
                                            <Typography variant={"h6"} gutterBottom>{stepData.label}</Typography>
                                            <Typography variant={"body2"}>{stepData.content}</Typography>
                                        </StepLabel>
                                    </StepButton>
                                </Step>
                            ))}
                        </Stepper>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div>
                        contact us
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <Fab color="primary" aria-label="add" className={classes.fab}>
                        <AddIcon/>
                    </Fab>
                </Grid>
            </Grid>
        );
    }

    handleMakeTeamStepClick(label) {
        const directs = {
            "Signup": "/signup",
            "Profile": "/signup",
            "Register": "/register",
            "Invite": "/teams",
        };
        this.props.history.push(directs[label]);
    }

    getMakeTeamSteps() {
        return [
            {
                label: "Signup",
                content: "Signup to tronix with your Google account",
                icon: <SignupIcon/>,
            },
            {
                label: "Profile",
                content: "Complete your profile with additional details",
                icon: <DetailsIcon/>,
            },
            {
                label: "Register",
                content: "Create a team by registering for any event",
                icon: <RegisterIcon/>,
            },
            {
                label: "Invite",
                content: "Invite friends to join your team using team link",
                icon: <InviteIcon/>,
            },
        ];
    }

    componentDidMount() {
        this.server = this.context.server;
        this.snack = this.context.snack;
        this.getEvents();
        this.getExhibits();
    }

    eventsComponent(props) {
        return (
            <div>
                {
                    this.state.events.map((e) => {
                        return (
                            <div>
                                <a href={`/e/${e.code}`}>{e.name}</a>
                                <br/>
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    getEvents() {
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
        }).catch(err => {
            this.snack("error", err.message);
        });
    }

    getExhibits() {
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
        }).then((exhibits) => {
            this.setState({exhibits});
        }).catch(err => {
            this.snack("error", err.message);
        });
    }
}

HomeComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};
HomeComponent.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(HomeComponent);