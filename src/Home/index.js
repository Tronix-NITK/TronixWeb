import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import SignupIcon from '@material-ui/icons/VerifiedUser';
import DetailsIcon from '@material-ui/icons/Create';
import RegisterIcon from '@material-ui/icons/Event';
import InviteIcon from '@material-ui/icons/GroupAdd';
import StepLabel from "@material-ui/core/StepLabel";
import UserGroup from "../helpers/userGroup";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import NavMenuIcon from '@material-ui/icons/Menu';
import {Link} from "react-router-dom";

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
    fabContainer: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        padding: theme.spacing(3),
    },
    fab: {},
    registerStepperContainer: {},
    eventsContainer: {
        padding: theme.spacing(2),
    },
    eventsListContainer: {
        padding: theme.spacing(1, 0),
    },
});

class HomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: null,
            exhibits: null,
            showNavMenu: false,
        };
        this.fabContainerRef = React.createRef();
    }

    render() {
        const {classes} = this.props;
        const {events} = this.state;
        let eventsComponent = null;
        if (events != null)
            eventsComponent = this.eventsComponent();
        return (
            <div>
                <Grid container item xs={12}>
                    <Grid item xs={12}>
                        <div className={classes.title}>
                            <Typography variant={"h1"}>
                                TroniX
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <div className={classes.eventsContainer}>
                            <Typography variant={"h4"}>
                                Events
                            </Typography>
                            <div className={classes.eventsListContainer}>
                                {eventsComponent}
                            </div>
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
                                                        onClick={this.handleNav.bind(this, stepData.label)}
                                                    >
                                                        <StepLabel>
                                                            <Typography variant={"h6"}
                                                                        gutterBottom>{stepData.label}</Typography>
                                                            <Typography
                                                                variant={"body2"}>{stepData.content}</Typography>
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
                </Grid>
                <div ref={this.fabContainerRef} className={classes.fabContainer}>
                    <Fab
                        color="primary"
                        className={classes.fab}
                        onClick={this.showNavMenu.bind(this)}
                    >
                        <NavMenuIcon/>
                    </Fab>
                    {/* FIXME: Menu doesn't resize when menu options change*/}
                    <AppContext.Consumer>
                        {(context) => (
                            <Menu
                                anchorEl={this.fabContainerRef.current}
                                getContentAnchorEl={null}
                                transformOrigin={{vertical: 'bottom', horizontal: 'center',}}
                                open={this.state.showNavMenu}
                                onClose={this.hideNavMenu.bind(this)}
                                PaperProps={{
                                    style: {
                                        width: 150,
                                    },
                                }}
                            >
                                {this.getMenuOptions(context)}
                            </Menu>)}
                    </AppContext.Consumer>
                </div>
            </div>
        );
    }

    getMenuOptions(context) {
        const loggedInOptions = ["My teams", "Register team", "Logout"];
        const loggedOutOptions = ["Signup", "Login"];
        let options = HomeComponent.hasSignedUp(context) ? loggedInOptions : loggedOutOptions;
        return options.map(option => (
            <MenuItem
                key={option}
                onClick={this.handleNav.bind(this, option)}
            >
                {option}
            </MenuItem>
        ))
    }

    hideNavMenu() {
        this.setState({showNavMenu: false});
    }

    showNavMenu() {
        this.setState({showNavMenu: true});
    }

    handleNav(title) {
        const directs = {
            "Signup": "/signup",
            "Profile": "/signup",
            "Register": "/register",
            "Register team": "/register",
            "Invite": "/teams",
            "My teams": "/teams",
            "Logout": "/logout",
            "Login": "/login",
        };
        this.props.history.push(directs[title]);
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
                completed: HomeComponent.hasSignedUp(context),
            },
            {
                label: "Profile",
                content: "Complete your profile",
                icon: <DetailsIcon color={HomeComponent.hasCompletedProfile(context) ? "secondary" : undefined}/>,
                completed: HomeComponent.hasCompletedProfile(context),
            },
            {
                label: "Register",
                content: "Register for events",
                icon: <RegisterIcon/>,
                completed: false,
            },
            {
                label: "Invite",
                content: "Share invite link",
                icon: <InviteIcon/>,
                completed: false,
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
        return this.state.events.map((e) => {
            return (
                <div key={e.code}>
                    <Link to={`/e/${e.code}`}>{e.name}</Link>
                    <br/>
                </div>
            );
        });
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