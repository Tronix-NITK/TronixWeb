import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

const styles = theme => ({
    media: {},
    button: {
        margin: theme.spacing.unit,
    },
});


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onClose() {
        if (this.props.onClose)
            this.props.onClose();
        else if (this.props.history)
            this.props.history.goBack();
    }

    render() {
        const {classes} = this.props;
        return (
            <Dialog open={true} onClose={this.onClose.bind(this)}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Login in to Tronix with your Google account.
                    </DialogContentText>
                    <CardMedia
                        className={classes.media}
                        component="img"
                        alt="Tronix Logo"
                        image="/images/logo_1.png"
                        title="Tronix"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        fullWidth
                    >
                        Login with Google
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(Login);