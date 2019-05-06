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
        let source = this.props.match.params.source;
        let pathName = localStorage.getItem('restore.pathname') || '/';
        localStorage.removeItem('restore.pathname');
        switch (source) {
            case "loginSuccess":
                window.location.pathname = "/";
                break;
            case "loginFailure":
                window.location.pathname = "/";
                break;
            case "signup":
                window.location.pathname = "/signup";
                break;
            default:
                window.location.pathname = "/";
        }
    }

    componentDidMount() {
        let source = this.props.match.params.source;
        switch (source) {
            case "signup":
                this.restore();
                break;
            default:
        }
    }

    render() {
        const {classes} = this.props;
        let source = this.props.match.params.source, title, contentText;
        switch (source) {
            case "loginSuccess":
                title = "Login successful";
                contentText = "Hit continue to continue";
                break;
            case "loginFailure":
                title = "Login failed";
                contentText = "Hit continue to continue";
                break;
            case "signup":
                title = "Login successful";
                contentText = "Hit continue to continue";
                break;
            default:
                title = "Go home";
                contentText = "Hit continue to go home";
        }
        return (
            <Dialog open={true} onClose={this.onClose.bind(this)}>
                <DialogTitle>
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {contentText}
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