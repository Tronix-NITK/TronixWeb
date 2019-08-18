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
import StepLabel from "@material-ui/core/StepLabel";
import UserGroup from "../helpers/userGroup";

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
                        <AppContext.Consumer>
                            {(context) => (
                                <Stepper nonLinear activeStep={null} alternativeLabel orientation={"horizontal"}>
                                    {
                                        HomeComponent.getMakeTeamSteps(context).map(stepData => (
                                            <Step key={stepData.label}>
                                                <StepButton
                                                    icon={stepData.icon}
                                                    onClick={this.handleMakeTeamStepClick.bind(this, stepData.label)}
                                                >
                                                    <StepLabel>
                                                        <Typography variant={"h6"}
                                                                    gutterBottom>{stepData.label}</Typography>
                                                        <Typography variant={"body2"}>{stepData.content}</Typography>
                                                    </StepLabel>
                                                </StepButton>
                                            </Step>
                                        ))
                                    }
                                </Stepper>
                            )}
                        </AppContext.Consumer>
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

    static hasSignedUp({partUser}) {
        if (partUser == null)
            return false;
        return partUser.group <= UserGroup.PARTICIPANT;

    }

    static hasCompletedProfile({partUser}) {
        if (partUser == null)
            return false;
        if (partUser.group > UserGroup.PARTICIPANT)
            return false;
        return partUser.group >= UserGroup.PARTICIPANT;
    }

    static getMakeTeamSteps(context) {
        return [
            {
                label: "Signup",
                content: "Signup with Google",
                icon: <SignupIcon color={HomeComponent.hasSignedUp(context) ? "secondary" : undefined}/>,
            },
            {
                label: "Profile",
                content: "Complete your profile",
                icon: <DetailsIcon color={HomeComponent.hasCompletedProfile(context) ? "secondary" : undefined}/>,
            },
            {
                label: "Register",
                content: "Register for events",
                icon: <RegisterIcon/>,
            },
            {
                label: "Invite",
                content: "Share invite link",
                icon: <InviteIcon/>,
            },
        ];
    }

    componentDidMount() {
        this.server = this.context.server;
        this.snack = this.context.snack;
        this.partUser = this.context.partUser;
        console.log(this.partUser);
        this.getEvents();
        this.getExhibits();
    }

    eventsComponent(props) {
        return (
            <div>
                {
                    this.state.events.map((e) => {
                        return (
                            <div key={e.code}>
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