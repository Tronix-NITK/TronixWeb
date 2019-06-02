import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {LinearProgress, withStyles} from "@material-ui/core";
import {Link, Route} from "react-router-dom";
import Login from "./Login";
import HRMS from "./HRMS";
import EMS from "./EMS";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppContext from "../AppContext";

const styles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
});

class Core extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: "getUser",
            user: null,
        };
    }

    render() {
        const {classes} = this.props;
        const path = this.props.match.path;
        const history = this.props.history;
        switch (this.state.stage) {
            case "getUser": {
                return (
                    <Dialog open={true}>
                        <DialogTitle>Authenticating</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Please wait while I log you in.
                            </DialogContentText>
                        </DialogContent>
                        <DialogContent>
                            <LinearProgress/>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                fullWidth
                                onClick={() => history.push('/')}
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>
                );
            }
            case "authTheUser": {
                return (<Route path={`/`} component={Login}/>);
            }
            case "loggedOut": {
                history.push("/");
                return null;
            }
            default:
        }
        return (
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/core/login">Login</Link>
                        </li>
                        <li>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,no-script-url */}
                            <a href="javascript:void(0);" onClick={this.logout.bind(this)}>Logout</a>
                        </li>
                        <li>
                            <Link to="/core/hrms">HRMS</Link>
                        </li>
                        <li>
                            <Link to="/core/ems">EMS</Link>
                        </li>
                    </ul>
                </nav>
                <Route path={`${path}/login`}
                       component={Login}/>
                <Route path={`${path}/hrms`}
                       component={HRMS}/>
                <Route path={`${path}/ems`}
                       component={EMS}/>
            </div>
        );
    }

    componentDidMount() {
        this.server = this.context.server;
        this.snack = this.context.snack;
        switch (this.state.stage) {
            case "getUser":
                this.getUser((user) => {
                    if (user != null)
                        this.setState({user: user, stage: "home"});
                    else {
                        this.setState({user: null, stage: "authTheUser"});
                    }
                });
                break;
            case "foo":
                break;
            default:
        }
    }

    getUser(cb) {
        fetch(`${this.server}/core/info/self`,
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
        })
            .then(user => cb(user))
            .catch(() => cb(null));
    }

    logout() {
        fetch(`${this.server}/core/auth/logout`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        }).then((res) => {
            if (!res.ok)
                throw Error(res.statusText);
            this.snack("success", "Logged out");
            this.setState({user: null, stage: "loggedOut"});
        }).catch(err => {
            this.snack("error", err.message);
        });
    }
}

Core.propTypes = {
    classes: PropTypes.object.isRequired,
};
Core.contextType = AppContext;
export default withStyles(styles, {withTheme: true})(Core);