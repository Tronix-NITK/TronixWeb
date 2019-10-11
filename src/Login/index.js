import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button/index";
import Dialog from '@material-ui/core/Dialog/index';
import DialogTitle from "@material-ui/core/DialogTitle/index";
import DialogContent from "@material-ui/core/DialogContent/index";
import DialogContentText from "@material-ui/core/DialogContentText/index";
import DialogActions from "@material-ui/core/DialogActions/index";
import AppContext from "../AppContext";
import {Link, withRouter} from 'react-router-dom';
import {loginDirect} from "../helpers/auth";
import MUILink from "@material-ui/core/Link/Link";

const styles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
});


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {classes} = this.props;
        return (
            <Dialog open={true} onClose={this.onClose.bind(this)}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Login to Tronix with your Google account.
                    </DialogContentText>
                    <DialogContentText variant="subtitle2">
                        Checkout <MUILink component={Link} to="/faq">FAQ</MUILink> if you face any problems
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        fullWidth
                        onClick={this.onClickLogin.bind(this)}
                    >
                        Login with Google
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    componentDidMount() {
        this.server = this.context.server;
    }

    onClose() {
        if (this.props.onClose)
            this.props.onClose();
        else if (this.props.history)
            this.props.history.goBack();
    }

    onClickLogin() {
        loginDirect.bind(this)();
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
};
Login.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(withRouter(Login));