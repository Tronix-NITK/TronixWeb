import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {LinearProgress, withStyles} from "@material-ui/core";
import {Link, Route} from "react-router-dom";
import Login from "./Login";
import HRMS from "./HRMS";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

const API_SERVER = "https://tronixserver.herokuapp.com";

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
                return (<div/>);
            }
            default:
        }
        return (
            <div>
                Core
                <nav>
                    <ul>
                        <li>
                            <Link to="/core/login">Login</Link>
                        </li>
                        <li>
                            <a href="javascript:void(0);" onClick={this.logout.bind(this)}>Logout</a>
                        </li>
                        <li>
                            <Link to="/core/hrms">HRMS</Link>
                        </li>
                    </ul>
                </nav>
                <Route path={`${path}/login`}
                       component={Login}/>
                <Route path={`${path}/hrms`}
                       component={HRMS}/>
            </div>
        );
    }

    componentDidMount() {
        switch (this.state.stage) {
            case "getUser": {
                this.getUser((user) => {
                    if (user != null)
                        this.setState({user: user, stage: "home"});
                    else {
                        this.setState({user: null, stage: "authTheUser"});
                    }
                });
            }
                break;
            default:
        }
    }

    getUser(cb) {
        fetch(`${API_SERVER}/core/info/self`,
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
        fetch(`${API_SERVER}/core/auth/logout`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        }).then((res) => {
            if (!res.ok)
                throw Error(res.statusText);
            this.setState({user: null, stage: "loggedOut"});
        }).catch(err => {
            console.error(err);
        });
    }
}

Core.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(Core);