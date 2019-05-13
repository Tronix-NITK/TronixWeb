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

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

class ModCoreUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            displayName: "",
            group: "MODERATOR",
        };
    }

    render() {
        const {classes} = this.props;
        return (
            <Dialog open={true} onClose={this.onClose.bind(this)}>
                <DialogTitle>Modify core user</DialogTitle>
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
                        color="secondary"
                        className={classes.button}
                        fullWidth
                        onClick={this.modUser.bind(this)}
                    >
                        Modify core user
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    componentDidMount() {
        this.server = this.context.server;
        this.snack = this.context.snack;
    }

    modUser() {
        fetch(`${this.server}/core/hrms/coreUser`, {
            mode: 'cors',
            credentials: 'include',
            method: "PUT",
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
            this.snack("success", "Edited");
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
}

ModCoreUser.propTypes = {
    classes: PropTypes.object.isRequired,
};
ModCoreUser.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(ModCoreUser);