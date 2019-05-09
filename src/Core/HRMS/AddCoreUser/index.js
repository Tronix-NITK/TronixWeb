import React, {Component} from "react";
import * as PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {withStyles} from "@material-ui/core";
import AppContext from "../../../AppContext";

const API_SERVER = "https://tronixserver.herokuapp.com";

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

class AddCoreUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            displayName: "",
            group: "MODERATOR",
        };
    }

    componentDidMount() {
        this.snack = this.context.snack;
    }

    createUser() {
        fetch(`${API_SERVER}/core/hrms/coreUser`, {
            mode: 'cors',
            credentials: 'include',
            method: "POST",
            body: JSON.stringify({
                email: this.state.email,
                displayName: this.state.displayName,
                group: this.state.group,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (!res.ok)
                throw Error(res.statusText);
            this.snack("success", "Added");
        }).catch(err => {
            this.snack("warn", err.message);
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
                <DialogTitle>Add core user</DialogTitle>
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
                    <TextField
                        margin="dense"
                        placeholder="Name"
                        type="text"
                        value={this.state.displayName}
                        onChange={this.handleTextChange('displayName')}
                        fullWidth
                    />
                    <Select
                        margin="dense"
                        placeholder="Group"
                        value={this.state.group}
                        onChange={this.handleTextChange('group')}
                        fullWidth
                    >
                        <MenuItem value={"MODERATOR"}>MODERATOR</MenuItem>
                        <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        fullWidth
                        onClick={this.createUser.bind(this)}
                    >
                        Create core user
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

AddCoreUser.propTypes = {
    classes: PropTypes.object.isRequired,
};
AddCoreUser.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(AddCoreUser);