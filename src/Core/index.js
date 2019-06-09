import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {LinearProgress, withStyles} from "@material-ui/core";
import {Link, Route} from "react-router-dom";
import Login from "./Login";
import HRMS from "./HRMS";
import EMS from "./EMS";
import TMS from "./TMS";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppContext from "../AppContext";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";

const styles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
    nav_container: {
        width: '100%',
        maxWidth: 360,
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
        // eslint-disable-next-line no-script-url
        const dudUrl = "javascript:;";
        return (
            <div>
                <div className={classes.nav_container}>
                    <List component="nav">
                        <ListItemLink to="/">
                            <ListItemText primary="Home"/>
                        </ListItemLink>
                        <ListItemLink to="/core/login">
                            <ListItemText primary="Login"/>
                        </ListItemLink>
                        <ListItemLink href={dudUrl} onClick={() => this.logout()}>
                            <ListItemText primary="Logout"/>
                        </ListItemLink>
                        <ListItemLink to="/core/hrms">
                            <ListItemText primary="HR management system"/>
                        </ListItemLink>
                        <ListItemLink to="/core/ems">
                            <ListItemText primary="Event management system"/>
                        </ListItemLink>
                        <ListItemLink to="/core/tms">
                            <ListItemText primary="Team management system"/>
                        </ListItemLink>
                        <ListItemLink to="/core">
                            <ListItemText primary="Core"/>
                        </ListItemLink>
                    </List>
                </div>
                <Route path={`${path}/login`}
                       component={Login}/>
                <Route path={`${path}/hrms`}
                       component={HRMS}/>
                <Route path={`${path}/ems`}
                       component={EMS}/>
                <Route path={`${path}/tms`}
                       component={TMS}/>
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

function ListItemLink(props) {
    return <ListItem button component={Link} {...props} />;
}

Core.propTypes = {
    classes: PropTypes.object.isRequired,
};
Core.contextType = AppContext;
export default withStyles(styles, {withTheme: true})(Core);