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
import ReactPlayer from 'react-player/lib/players/YouTube';
import PlayIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import EventButtonIcon from "@material-ui/icons/EventNote";
import ExhibitButtonIcon from "@material-ui/icons/Star";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import SocialIcon from '@material-ui/icons/ThumbUp';
// import CollegeIcon from '@material-ui/icons/LocationCity';
import MailIcon from '@material-ui/icons/Mail';
import FAQIcon from '@material-ui/icons/QuestionAnswer';
import Hidden from "@material-ui/core/Hidden";
import Paper from "@material-ui/core/Paper";

const styles = theme => ({
    title: {
        padding: theme.spacing(4, 0, 2, 0),
        ...theme.styles.horizontalCenter,
    },
    fabContainer: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        padding: theme.spacing(3),
    },
    fab: {},
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
        ...theme.styles.horizontalCenter,
    },
    trailerDesktop: {
        ...theme.styles.horizontalCenter,
    },
    stepper: {
        ...theme.styles.translucentPaper,
        margin: theme.spacing(1),
    },
    bottomNav: {
        ...theme.styles.translucentPaper,
        margin: theme.spacing(1),
    },
    trailerWrapper: {
        position: "relative",
        paddingTop: "56.25%",
    },
    trailer: {
        position: "absolute",
        top: 0,
        left: 0,
    },
    successColor: {...theme.styles.successColor},
    hover: {...theme.styles.hover},
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
                        <Hidden smUp>
                            <Grid item xs={12}>
                                <div className={classes.trailerWrapper}>
                                    <ReactPlayer
                                        className={classes.trailer}
                                        width='100%'
                                        height='100%'
                                        url="https://www.youtube.com/watch?v=XmMHKcGBnsQ"
                                        controls={false}
                                        playing={true}
                                    />
                                </div>
                            </Grid>
                        </Hidden>
                    }
                    {!showTrailer ? null :
                        <Hidden xsDown>
                            <Grid item xs={12}>
                                <div className={classes.trailerDesktop}>
                                    <ReactPlayer
                                        url="https://www.youtube.com/watch?v=XmMHKcGBnsQ"
                                        controls={false}
                                        playing={true}
                                    />
                                </div>
                            </Grid>
                        </Hidden>
                    }
                    <Hidden smUp>
                        <Grid item xs={12}>
                            <div className={classes.centerFlex}>
                                <Button onClick={this.toggleTrailer}>
                                    {trailerIcon}
                                    <Typography>
                                        Trailer
                                    </Typography>
                                </Button>
                            </div>
                        </Grid>
                    </Hidden>
                    <Grid item xs={12} sm={4}>
                        <div className={classes.centerFlex}>
                            <Button component={Link} to={"/e"}>
                                <EventButtonIcon fontSize="large"/>
                                <Typography>
                                    Events
                                </Typography>
                            </Button>
                        </div>
                    </Grid>
                    <Hidden xsDown>
                        <Grid item xs={12} sm={4}>
                            <div className={classes.centerFlex}>
                                <Button onClick={this.toggleTrailer}>
                                    {trailerIcon}
                                    <Typography>
                                        Trailer
                                    </Typography>
                                </Button>
                            </div>
                        </Grid>
                    </Hidden>
                    <Grid item xs={12} sm={4}>
                        <div className={classes.centerFlex}>
                            <Button component={Link} to={"/x"}>
                                <ExhibitButtonIcon fontSize="large"/>
                                <Typography>
                                    Exhibits
                                </Typography>
                            </Button>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <AppContext.Consumer>
                            {(context) => (
                                <Stepper
                                    component={Paper}
                                    className={classes.stepper}
                                    nonLinear
                                    activeStep={null}
                                    alternativeLabel
                                    orientation={"horizontal"}
                                >
                                    {
                                        HomeComponent.getMakeTeamSteps(context).map(stepData => (
                                            <Step key={stepData.label}>
                                                <StepButton
                                                    component={Link}
                                                    className={`${classes.hover} ${stepData.disabled ? classes.successColor : {}}`}
                                                    {...stepData}
                                                >
                                                    <StepLabel>
                                                        <Typography
                                                            variant={"body1"}
                                                            gutterBottom
                                                        >
                                                            {stepData.label}
                                                        </Typography>
                                                        <Hidden xsDown>
                                                            <Typography
                                                                variant={"body2"}
                                                            >
                                                                {stepData.content}
                                                            </Typography>
                                                        </Hidden>
                                                    </StepLabel>
                                                </StepButton>
                                            </Step>
                                        ))
                                    }
                                </Stepper>
                            )}
                        </AppContext.Consumer>
                    </Grid>
                    <Grid item xs={12}>
                        <BottomNavigation
                            component={Paper}
                            className={classes.bottomNav}
                            showLabels
                            onChange={(_, val) => window.open(val, "_blank")}
                        >
                            {
                                HomeComponent.getFooterData().map(d =>
                                    <BottomNavigationAction
                                        {...d}
                                        key={d.label}
                                        className={classes.hover}
                                    >
                                    </BottomNavigationAction>
                                )
                            }
                        </BottomNavigation>
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
        const loggedInOptions = [
            {key: "My teams", to: "/teams",},
            {key: "Register team", to: "/register"},
            {key: "Logout", to: "/logout"},
        ];
        const loggedOutOptions = [
            {key: "Signup", to: "/signup",},
            {key: "Login", to: "/login"},
        ];
        let options = HomeComponent.hasSignedUp(context) ? loggedInOptions : loggedOutOptions;
        return options.map(option => (
            <MenuItem
                component={Link}
                {...option}
            >
                {option.key}
            </MenuItem>
        ))
    }

    hideNavMenu() {
        this.setState({showNavMenu: false});
    }

    showNavMenu() {
        this.setState({showNavMenu: true});
    }

    static hasSignedUp({user}) {
        return user != null;
    }

    static hasCompletedProfile({user}) {
        return user != null && user.group === UserGroup.PARTICIPANT;
    }

    static getMakeTeamSteps(context) {
        return [
            {
                label: "Signup",
                content: "Signup with Google",
                icon: <SignupIcon/>,
                to: "/signup",
                disabled: HomeComponent.hasSignedUp(context),
            },
            {
                label: "Profile",
                content: "Complete your profile",
                icon: <DetailsIcon/>,
                to: "/signup",
                disabled: HomeComponent.hasCompletedProfile(context),
            },
            {
                label: "Register",
                content: "Register for events",
                icon: <RegisterIcon/>,
                to: "/register",
                disabled: false,
            },
            {
                label: "Invite",
                content: "Share invite link",
                icon: <InviteIcon/>,
                to: "/teams",
                disabled: false,
            },
        ];
    }

    static getFooterData() {
        return [
            {
                label: "Facebook",
                icon: <SocialIcon/>,
                value: "https://www.facebook.com/tronixcommittee/",
            },
            // {
            //     label: "NITK",
            //     icon: <CollegeIcon/>,
            //     value: "https://www.nitk.ac.in/",
            // },
            {
                label: "FAQ",
                icon: <FAQIcon/>,
                value: "/faq",
            },
            {
                label: "Mail",
                icon: <MailIcon/>,
                value: "mailto:tronix@gmail.com",
            },
        ]
    }

    componentDidMount() {
        this.server = this.context.server;
        this.snack = this.context.snack;
        this.user = this.context.user;
    }
}

HomeComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};
HomeComponent.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(HomeComponent);