import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {LinearProgress, withStyles} from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog/index';
import DialogTitle from "@material-ui/core/DialogTitle/index";
import DialogContent from "@material-ui/core/DialogContent/index";
import DialogContentText from "@material-ui/core/DialogContentText/index";
import AppContext from "../AppContext";
import DialogActions from "@material-ui/core/DialogActions";

const styles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
});


class Logout extends Component {
    render() {
        return (
            <Dialog open={true} fullWidth maxWidth="xs">
                <DialogTitle>Logging out</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please wait</DialogContentText>
                </DialogContent>
                <DialogContent>
                    <LinearProgress/>
                </DialogContent>
                <DialogActions/>
            </Dialog>
        );
    }

    componentDidMount() {
        this.server = this.context.server;
        this.snack = this.context.snack;
        fetch(`${this.server}/part/auth/logout`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        }).then((res) => {
            if (!res.ok)
                throw Error(res.statusText);
            this.props.history.push("/");
            this.props.onLogout();
        }).catch(err => {
            this.snack("error", err.message);
        });
    }
}

Logout.propTypes = {
    classes: PropTypes.object.isRequired,
};
Logout.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(Logout);