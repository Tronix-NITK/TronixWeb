import "./App.css";
import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import blue from '@material-ui/core/colors/blue';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Login from "./Login";
import Logout from "./Logout";
import Signup from "./Signup";
import Teams from "./Teams";
import TeamRegister from "./Teams/Register";
import TeamJoin from "./Teams/Join";
import Restore from "./Restore";
import FAQ from "./FAQ";
import Event from "./Event";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import InfoSnackIcon from '@material-ui/icons/Info';
import SuccessSnackIcon from '@material-ui/icons/CheckCircle';
import WarningSnackIcon from '@material-ui/icons/Warning';
import ErrorSnackIcon from '@material-ui/icons/Error';
import grey from "@material-ui/core/es/colors/grey";
import green from "@material-ui/core/es/colors/green";
import amber from "@material-ui/core/es/colors/amber";
import red from "@material-ui/core/es/colors/red";
import AppContext from "./AppContext";
import EventsComponent from "./Events";
import ExhibitsComponent from "./Exhibits";
import Exhibit from "./Exhibit";
import Home from "./Home";
import Particles from "react-particles-js";
import Hidden from "@material-ui/core/Hidden";
import SimpleError from "./SimpleError";
import Container from "@material-ui/core/Container";

const theme = {
    "dark": createMuiTheme({
        palette: {
            type: "dark",
            primary: {
                main: blue[500]
            },
            secondary: {
                main: grey[500]
            },
            error: {
                main: red[500]
            },
        },
        typography: {
            useNextVariants: true,
        },
        styles: {
            spaceageFont: {
                fontFamily: "spaceage",
                transform: "scale(1, 1.4)",
            },
            successColor: {
                color: green[500],
            },
            hover: {
                '&:hover': {
                    color: blue[500],
                },
            },
            translucentPaperContainer: {
                padding: 8 * 3,
                backgroundColor: "rgba(66,66,66,0.9)",
            },
            translucentPaper: {
                backgroundColor: "rgba(66,66,66,0.9)",
            },
            horizontalCenter: {
                display: "flex",
                justifyContent: "center",
            },
        },
        overrides: {
            MuiPaper: {
                root: {}
            },
            MuiBottomNavigation: {
                root: {
                    backgroundColor: null,
                }
            },
            MuiContainer: {
                root: {
                    marginTop: "16px",
                    marginBottom: "16px",
                }
            }
        }
    }),
};

const styles = theme => ({
    app: {},
    backgroundWrapper: {
        position: "fixed",
        zIndex: "-1",
        width: "100vw",
        height: "100vh",
    },
    background: {
        width: "100%",
        height: "100%",
    },
    snackMessage: {
        display: 'flex',
        alignItems: 'center',
    },
    snackIcon: {
        fontSize: 20,
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    infoSnack: {
        backgroundColor: grey[600],
    },
    successSnack: {
        backgroundColor: green[600],
    },
    warnSnack: {
        backgroundColor: amber[700],
    },
    errorSnack: {
        backgroundColor: red[700],
    },
});

const API_SERVER = "https://tronixserver.herokuapp.com/api/v1";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infoSnack: "", successSnack: "", warnSnack: "", errorSnack: "",
            user: null,
        };
    }

    render() {
        const {classes} = this.props;
        const {user} = this.state;
        return (
            <MuiThemeProvider theme={theme["dark"]}>
                <React.Fragment>
                    <CssBaseline/>
                    <AppContext.Provider value={
                        {
                            snack: (t, m) => this.snack(t, m),
                            server: API_SERVER,
                            user: user,
                        }
                    }>
                        <Router>
                            <div className={classes.app}>
                                <Hidden xsDown>
                                    <Particles
                                        className={classes.backgroundWrapper}
                                        canvasClassName={classes.background}
                                        params={particleConfDesktop}/>
                                </Hidden>
                                <Hidden smUp>
                                    <Particles
                                        className={classes.backgroundWrapper}
                                        canvasClassName={classes.background}
                                        params={particleConfMobile}/>
                                </Hidden>
                                <Switch>
                                    <Route exact path="/"
                                           component={Home}/>
                                    <Route path="/restore/:state"
                                           component={Restore}/>
                                    <Route path="/login"
                                           component={Login}/>
                                    <Route path="/logout"
                                           render={(props) => <Logout {...props}
                                                                      onLogout={this.onLogout.bind(this)}/>}/>
                                    <Route path="/signup"
                                           component={Signup}/>
                                    <Route path="/e/:code"
                                           component={Event}/>
                                    <Route path="/e"
                                           component={EventsComponent}/>
                                    <Route path="/x/:code"
                                           component={Exhibit}/>
                                    <Route path="/x"
                                           component={ExhibitsComponent}/>
                                    <Route path="/faq"
                                           component={FAQ}/>

                                    {/* Todo: Check user.group == participant */}
                                    <Route path="/register/:code"
                                           component={user ? TeamRegister : Login}/>
                                    <Route path="/register"
                                           component={user ? TeamRegister : Login}/>
                                    <Route path="/j/:linkID"
                                           component={user ? TeamJoin : Login}/>
                                    <Route path="/teams"
                                           component={user ? Teams : Login}/>

                                    <Route path="/"
                                           component={this.notFound.bind(this)}/>
                                </Switch>
                            </div>
                            <Snackbar
                                anchorOrigin={{vertical: "top", horizontal: "right"}}
                                open={this.state.infoSnack.length !== 0}
                                onClose={this.handleCloseSnack.bind(this)}
                                autoHideDuration={3000}
                            >
                                <SnackbarContent
                                    className={classes.infoSnack}
                                    message={
                                        <span className={classes.snackMessage}>
                            <InfoSnackIcon className={classes.snackIcon}/>{this.state.infoSnack}
                        </span>
                                    }
                                />
                            </Snackbar>
                            <Snackbar
                                anchorOrigin={{vertical: "top", horizontal: "right"}}
                                open={this.state.successSnack.length !== 0}
                                onClose={this.handleCloseSnack.bind(this)}
                                autoHideDuration={3000}
                            >
                                <SnackbarContent
                                    className={classes.successSnack}
                                    message={
                                        <span className={classes.snackMessage}>
                            <SuccessSnackIcon className={classes.snackIcon}/>{this.state.successSnack}
                        </span>
                                    }
                                />
                            </Snackbar>
                            <Snackbar
                                anchorOrigin={{vertical: "top", horizontal: "right"}}
                                open={this.state.warnSnack.length !== 0}
                                onClose={this.handleCloseSnack.bind(this)}
                                autoHideDuration={3000}
                            >
                                <SnackbarContent
                                    className={classes.warnSnack}
                                    message={
                                        <span className={classes.snackMessage}>
                            <WarningSnackIcon className={classes.snackIcon}/>{this.state.warnSnack}
                        </span>
                                    }
                                />
                            </Snackbar>
                            <Snackbar
                                anchorOrigin={{vertical: "top", horizontal: "right"}}
                                open={this.state.errorSnack.length !== 0}
                                onClose={this.handleCloseSnack.bind(this)}
                                autoHideDuration={3000}
                            >
                                <SnackbarContent
                                    className={classes.errorSnack}
                                    message={
                                        <span className={classes.snackMessage}>
                            <ErrorSnackIcon className={classes.snackIcon}/>{this.state.errorSnack}
                        </span>
                                    }
                                />
                            </Snackbar>
                        </Router>
                    </AppContext.Provider>
                </React.Fragment>
            </MuiThemeProvider>
        );
    }

    componentDidMount() {
        this.server = API_SERVER;
        this.loadPartUser();
    }

    notFound() {
        return (
            <Container maxWidth="md">
                <SimpleError message="Page not found!"/>
            </Container>
        );
    }

    handleCloseSnack() {
        this.setState({infoSnack: "", successSnack: "", warnSnack: "", errorSnack: "",});
    }

    onLogout() {
        this.setState({user: null});
        this.snack("success", "Logged out");
    }

    snack(type, msg) {
        this.setState({[`${type}Snack`]: msg});
    }

    loadPartUser() {
        fetch(`${this.server}/part/auth/user`,
            {
                mode: 'cors',
                credentials: 'include',
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                },
            }).then((res) => {
            if (res.ok)
                return res.json();
            else
                throw Error(res.statusText);
        }).then(user => {
            this.setState({user});
        }).catch(() => {
            this.setState({user: null});
        });
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

const particleColor = blue[500], lineColor = blue[700];
const particleConfDesktop = {
    "particles": {
        "number": {
            "value": 70,
        },
        "color": {
            "value": particleColor,
        },
        "size": {
            "value": 3
        },
        "line_linked": {
            "color": lineColor,
            "width": 2,
        }
    },
    "interactivity": {
        "detect_on": "window",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse"
            }
        }
    }
};
const particleConfMobile = {
    "particles": {
        "number": {
            "value": 20,
        },
        "color": {
            "value": particleColor,
        },
        "size": {
            "value": 3
        },
        "line_linked": {
            "color": lineColor,
            "width": 2,
        }
    },
    "interactivity": {
        "detect_on": "window",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse"
            }
        }
    }
};

export default withStyles(styles, {withTheme: true})(App);