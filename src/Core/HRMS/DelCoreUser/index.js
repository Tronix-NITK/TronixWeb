import React, {Component} from "react";
import * as PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import {withStyles} from "@material-ui/core";

const API_SERVER = "https://tronixserver.herokuapp.com";

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

class DelCoreUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
        };
    }

    delUser() {
        fetch(`${API_SERVER}/core/hrms/coreUser`, {
            mode: 'cors',
            credentials: 'include',
            method: "DELETE",
            body: JSON.stringify({
                email: this.state.email,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (!res.ok)
                throw Error(res.statusText);
            if (this.props.onResult)
                this.props.onResult(null);
        }).catch(err => {
            if (this.props.onResult)
                this.props.onResult(err);
        });
    }

    handleTextChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

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
                <DialogTitle>Delete core user</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        placeholder="Email"
                        type="email"
                        value={this.state.email}
                        onChange={this.handleTextChange('email')}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        fullWidth
                        onClick={this.delUser.bind(this)}
                    >
                        Delete core user
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

DelCoreUser.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(DelCoreUser);