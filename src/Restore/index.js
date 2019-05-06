import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {DialogContentText, withStyles} from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});


class Restore extends Component {
    onClose() {
    }

    restore() {
        let result = this.props.match.params.result;
        let pathName = localStorage.getItem('restore.pathname') || '/';
        localStorage.removeItem('restore.pathname');
        switch (result) {
            case "success":
                window.location.pathname = pathName;
                break;
            case "failure":
                window.location.pathname = "/";
                break;
            case "completeRegistration":
                window.location.pathname = "/register";
                break;
            default:
                break;
        }
    }

    render() {
        const {classes} = this.props;
        let result = this.props.match.params.result;
        return (
            <Dialog open={true} onClose={this.onClose.bind(this)}>
                <DialogTitle>
                    Login {result === "success" || result === "completeRegistration" ? "successful" : "failed"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Hit continue to
                        {result === "success" ? " continue browsing" : null}
                        {result === "failure" ? " try again" : null}
                        {result === "completeRegistration" ? " complete registration" : null}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        fullWidth
                        onClick={this.restore.bind(this)}
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

Restore.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(Restore);