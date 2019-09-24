import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import SignupIcon from '@material-ui/icons/VerifiedUser';
import DetailsIcon from '@material-ui/icons/Create';
import RegisterIcon from '@material-ui/icons/Event';
import InviteIcon from '@material-ui/icons/GroupAdd';
import StepLabel from "@material-ui/core/StepLabel";
import UserGroup from "../helpers/userGroup";
import ReactPlayer from 'react-player/lib/players/YouTube';
import PlayIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import Hidden from "@material-ui/core/Hidden";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import ButtonGroup from "@material-ui/core/ButtonGroup";

const styles = theme => ({
    root: {
        paddingTop: theme.spacing(4),
    },
    title: {
        fontFamily: "spaceage",
    },
    spaceageFont: {
        ...theme.styles.spaceageFont,
    },
    logoContainer: {
        marginTop: 0,
        marginBottom: 0,
    },
    trailerDesktopContainer: {
        padding: theme.spacing(2),
        ...theme.styles.horizontalCenter,
    },
    gridItem: {
        padding: theme.spacing(1),
    },
    paper: {
        ...theme.styles.translucentPaper,
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
    }

    render() {
        const {classes} = this.props;
        const {showTrailer} = this.state;
        const trailerIcon = showTrailer ? <PauseIcon fontSize="large"/> : <PlayIcon fontSize="large"/>;
        return (
            <div className={classes.root}>
                <Grid container item xs={12}>
                    <Grid item xs={12} className={classes.gridItem}>
                        <Hidden smUp>
                            <Typography variant={"h2"} align={"center"} className={classes.title}>
                                Tronix
                            </Typography>
                        </Hidden>
                        <Hidden xsDown>
                            <Typography variant={"h1"} align={"center"} className={classes.title}>
                                Tronix
                            </Typography>
                        </Hidden>
                    </Grid>
                    {showTrailer ? null :
                        <Grid item xs={12} className={classes.gridItem}>
                            <Container maxWidth="sm" className={classes.logoContainer}>
                                <img width="100%" src="/images/logo1.png" alt={"tronix logo"}/>
                            </Container>
                        </Grid>
                    }
                    {!showTrailer ? null :
                        <Hidden smUp>
                            <Grid item xs={12} className={classes.gridItem}>
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
                            <Grid item xs={12} className={classes.trailerDesktopContainer}>
                                <ReactPlayer
                                    url="https://www.youtube.com/watch?v=XmMHKcGBnsQ"
                                    controls={false}
                                    playing={true}
                                />
                            </Grid>
                        </Hidden>
                    }
                    <Grid item xs={12} className={classes.gridItem}>
                        <ButtonGroup fullWidth>
                            <Button component={Link} to={"/e"} variant="outlined">
                                <Typography className={classes.spaceageFont}>
                                    Events
                                </Typography>
                            </Button>
                            <Button onClick={this.toggleTrailer}>
                                {trailerIcon}
                            </Button>
                            <Button component={Link} to={"/x"} variant="outlined">
                                <Typography className={classes.spaceageFont}>
                                    Exhibits
                                </Typography>
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <AppContext.Consumer>
                            {(context) => (
                                <Stepper
                                    component={Paper}
                                    className={classes.paper}
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
                </Grid>
            </div>
        );
    }

    toggleTrailer = () => {
        this.setState(prevState => ({
            showTrailer: !prevState.showTrailer
        }));
    };

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