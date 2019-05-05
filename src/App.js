import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import blue from '@material-ui/core/colors/blue';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Core from "./Core";
import Restore from "./Restore";

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
    App: {},
});

class App extends Component {
    constructor(props) {
        super(props);
        let savedTheme = localStorage.getItem("theme");
        if (theme[savedTheme] == null)
            savedTheme = "dark";
        this.state = {
            theme: savedTheme,
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
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

    render() {
        return (
            <MuiThemeProvider theme={theme[this.state.theme]}>
                <React.Fragment>
                    <CssBaseline/>
                    <Router>
                        <div>
                            <nav>
                                <ul>
                                    <li>
                                        <Link to="/">Home</Link>
                                    </li>
                                    <li>
                                        <Link to="/login">Login</Link>
                                    </li>
                                    <li>
                                        <Link to="/core">Core</Link>
                                    </li>
                                </ul>
                            </nav>

                            <Route path="/core"
                                   component={Core}/>
                            <Route path="/restore/:result"
                                   component={Restore}/>
                            <Route path="/login"
                                   component={Login}/>
                            <Route path="/register"
                                   component={Register}/>
                        </div>
                    </Router>
                </React.Fragment>
            </MuiThemeProvider>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(App);