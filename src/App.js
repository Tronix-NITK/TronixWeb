import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import blue from '@material-ui/core/colors/blue';
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Teams from "./Teams";
import TeamRegister from "./Teams/Register";
import TeamJoin from "./Teams/Join";
import Core from "./Core";
import Restore from "./Restore";
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
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import EventsComponent from "./Events";

const theme = {
    "dark": createMuiTheme({
        palette: {
            type: "dark",
            primary: blue,
            secondary: red,
        },
        typography: {
            useNextVariants: true,
        },
    }),
    "light": createMuiTheme({
        palette: {
            type: "light",
        },
        typography: {
            useNextVariants: true,
        },
    })
};

const styles = theme => ({
    app: {},
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
    nav_container: {
        width: '100%',
        maxWidth: 360,
    },
});

const API_SERVER = "https://tronixserver.herokuapp.com";

class App extends Component {
    constructor(props) {
        super(props);
        let savedTheme = localStorage.getItem("theme");
        if (theme[savedTheme] == null)
            savedTheme = "dark";
        this.state = {
            theme: savedTheme,
            infoSnack: "", successSnack: "", warnSnack: "", errorSnack: "",
            partUser: null,
        };
    }

    render() {
        const {classes} = this.props;
        return (
            <MuiThemeProvider theme={theme[this.state.theme]}>
                <React.Fragment>
                    <CssBaseline/>
                    <AppContext.Provider value={
                        {
                            snack: (t, m) => this.snack(t, m),
                            server: API_SERVER,
                            partUser: this.state.partUser,
                        }
                    }>
                        <Router>
                            <div className={classes.app}>
                                <Switch>
                                    <Route exact path="/"
                                           component={this.home.bind(this)}/>
                                    <Route path="/core"
                                           component={Core}/>
                                    <Route path="/restore/:state"
                                           component={Restore}/>
                                    <Route path="/login"
                                           component={Login}/>
                                    <Route path="/signup"
                                           component={Signup}/>
                                    <Route path="/register"
                                           component={TeamRegister}/>
                                    <Route path="/register/:code"
                                           component={TeamRegister}/>
                                    <Route path="/j/:linkID"
                                           component={TeamJoin}/>
                                    <Route path="/teams"
                                           component={Teams}/>
                                    <Route path="/e/:code"
                                           component={Event}/>
                                    <Route path="/e"
                                           component={EventsComponent}/>
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

    themeChanger(name) {
        if (name == null)
            name = localStorage.getItem("theme") === "dark" ? "light" : "dark";
        this.setState(prevState => ({theme: theme[name] != null ? name : prevState.theme}));
        if (theme[name] != null)
            localStorage.setItem("theme", name);
    }

    home() {
        const {classes} = this.props;
        // eslint-disable-next-line no-script-url
        const dudUrl = "javascript:;";
        return (
            <div className={classes.nav_container}>
                <List component="nav">
                    <ListItemLink to="/">
                        <ListItemText primary="Home"/>
                    </ListItemLink>
                    <ListItemLink to="/login">
                        <ListItemText primary="Login"/>
                    </ListItemLink>
                    <ListItemLink href={dudUrl} onClick={() => this.partLogout()}>
                        <ListItemText primary="Logout"/>
                    </ListItemLink>
                    <ListItemLink to="/signup">
                        <ListItemText primary="Signup"/>
                    </ListItemLink>
                    <ListItemLink to="/e">
                        <ListItemText primary="Tronix Events"/>
                    </ListItemLink>
                    <ListItemLink to="/register">
                        <ListItemText primary="Register for an event"/>
                    </ListItemLink>
                    <ListItemLink to="/teams">
                        <ListItemText primary="Your teams"/>
                    </ListItemLink>
                    <ListItemLink to="/core">
                        <ListItemText primary="Core"/>
                    </ListItemLink>
                </List>
            </div>
        );
    }

    notFound() {
        return (
            <div>
                Not Found
            </div>
        );
    }

    handleCloseSnack() {
        this.setState({infoSnack: "", successSnack: "", warnSnack: "", errorSnack: "",});
    }

    snack(type, msg) {
        this.setState({[`${type}Snack`]: msg});
    }

    partLogout() {
        fetch(`${this.server}/part/auth/logout`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        }).then((res) => {
            if (!res.ok)
                throw Error(res.statusText);
            this.setState({partUser: null});
            this.snack("success", "Logged out");
        }).catch(err => {
            this.snack("error", err.message);
        });
    }

    loadPartUser() {
        fetch(`${this.server}/part/info/self`,
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
        }).then(partUser => {
            this.setState({partUser});
        }).catch(() => {
            this.setState({partUser: null});
        });
    }
}

function ListItemLink(props) {
    return <ListItem button component={Link} {...props} />;
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(App);