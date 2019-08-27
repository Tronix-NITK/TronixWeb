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
import ReactPlayer from 'react-player';
import PlayIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import EventButtonIcon from "@material-ui/icons/EventNote";
import ExhibitButtonIcon from "@material-ui/icons/Star";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import SocialIcon from '@material-ui/icons/ThumbUp';
import CollegeIcon from '@material-ui/icons/LocationCity';
import MailIcon from '@material-ui/icons/Mail';

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
    margin: {
        margin: theme.spacing(1),
    },
    centerFlex: {
        display: "flex",
        justifyContent: "center",
    },
    footerContainer: {
        display: "block",
        margin: theme.spacing(1),
    },
});

class HomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showNavMenu: false,
            showTrailer: false,
        };
        this.fabContainerRef = React.createRef();
    }

    render() {
        const {classes} = this.props;
        const {showTrailer} = this.state;
        const trailerIcon = showTrailer ? <PauseIcon fontSize="large"/> : <PlayIcon fontSize="large"/>;
        return (
            <div>
                <Grid container item xs={12}>
                    {showTrailer ? null :
                        <Grid item xs={12}>
                            <div className={classes.title}>
                                <Typography variant={"h1"}>
                                    TroniX
                                </Typography>
                            </div>
                        </Grid>
                    }
                    {!showTrailer ? null :
                        <Grid item sm={12}>
                            <div className={classes.centerFlex}>
                                <ReactPlayer
                                    url="https://www.youtube.com/watch?v=XmMHKcGBnsQ"
                                    controls={false}
                                    playing={true}
                                />
                            </div>
                        </Grid>
                    }
                    <Grid item xs={4}>
                        <div className={classes.centerFlex}>
                            <Button component={Link} to={"/e"}>
                                <EventButtonIcon fontSize="large"/>
                                <Typography>
                                    Events
                                </Typography>
                            </Button>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <div className={classes.centerFlex}>
                            <Button onClick={this.toggleTrailer}>
                                {trailerIcon}
                                <Typography>
                                    Trailer
                                </Typography>
                            </Button>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <div className={classes.centerFlex}>
                            <Button>
                                <ExhibitButtonIcon fontSize="large"/>
                                <Typography>
                                    Exhibits
                                </Typography>
                            </Button>
                        </div>
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
                        <div className={classes.footerContainer}>
                            <BottomNavigation
                                showLabels
                                onChange={(_, val) => window.open(val, "_blank")}
                            >
                                <BottomNavigationAction
                                    label="Facebook"
                                    icon={<SocialIcon/>}
                                    value="https://www.facebook.com/tronixcommittee/"
                                />
                                <BottomNavigationAction
                                    label="NITK"
                                    icon={<CollegeIcon/>}
                                    value="https://www.nitk.ac.in/"
                                />
                                <BottomNavigationAction
                                    label="Mail"
                                    icon={<MailIcon/>}
                                    value="mailto:tronix@gmail.com"
                                />
                            </BottomNavigation>
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

    toggleTrailer = () => {
        this.setState(prevState => ({
            showTrailer: !prevState.showTrailer
        }));
    };

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
    }
}

HomeComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};
HomeComponent.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(HomeComponent);