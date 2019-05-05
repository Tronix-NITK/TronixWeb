import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

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
                <DialogTitle>Please wait</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Login {this.props.match.params.result}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        );
    }
}

Restore.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(Restore);