import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import blue from '@material-ui/core/colors/blue';
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Register from "./Team/Register";
import Core from "./Core";
import Restore from "./Restore";
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

const theme = {
    "dark": createMuiTheme({
        palette: {
            type: "dark",
            primary: blue,
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
        marginRight: theme.spacing.unit,
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
                                           component={Register}/>
                                    <Route path="/"
                                           component={this.notFound.bind(this)}/>
                                </Switch>
                            </div>
                            <Snackbar
                                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                                open={this.state.infoSnack.length !== 0}
                                autoHideDuration={2000}
                                onClose={this.handleCloseSnack.bind(this)}
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
                                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                                open={this.state.successSnack.length !== 0}
                                onClose={this.handleCloseSnack.bind(this)}
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
                                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                                open={this.state.warnSnack.length !== 0}
                                onClose={this.handleCloseSnack.bind(this)}>
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
                                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                                open={this.state.errorSnack.length !== 0}
                                onClose={this.handleCloseSnack.bind(this)}
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
    }

    themeChanger(name) {
        if (name == null)
            name = localStorage.getItem("theme") === "dark" ? "light" : "dark";
        this.setState(prevState => ({theme: theme[name] != null ? name : prevState.theme}));
        if (theme[name] != null)
            localStorage.setItem("theme", name);
    }

    cancelLogin() {
        this.props.history.goBack();
    }

    home() {
        return (
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <a href="javascript:void(0);" onClick={() => this.part_logout()}>Logout</a>
                    </li>
                    <li>
                        <Link to="/signup">Signup</Link>
                    </li>
                    <li>
                        <Link to="/register">Register for event</Link>
                    </li>
                    <li>
                        <Link to="/core">Core</Link>
                    </li>
                </ul>
            </nav>
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

    part_logout() {
        fetch(`${this.server}/part/auth/logout`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        }).then((res) => {
            if (!res.ok)
                throw Error(res.statusText);
            this.snack("success", "Logged out");
        }).catch(err => {
            this.snack("error", err.message);
        });
    }

}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(App);