import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import LinearProgress from "@material-ui/core/LinearProgress";

const styles = theme => ({});


class Restore extends Component {
    onClose() {
    }

    static restore() {
        let pathName = localStorage.getItem('restore.pathname') || '/';
        localStorage.removeItem('restore.pathname');
        window.location.pathname = pathName;
    }

    componentDidMount() {
        setTimeout(Restore.restore, 3000);
    }

    render() {
        return (
            <Dialog open={true} onClose={this.onClose.bind(this)}>
                <DialogTitle>Login {this.props.match.params.result === "success" ? "successful" : "failed"}, please wait.</DialogTitle>
                <DialogContent>
                    <LinearProgress/>
                </DialogContent>
            </Dialog>
        );
    }
}

Restore.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(Restore);