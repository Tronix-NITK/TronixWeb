import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../../../AppContext";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const styles = theme => ({
    root: {
        display: "flex",
        justifyContent: "center",
    },
    paper: {
        margin: theme.spacing(2, 2),
        padding: theme.spacing(4, 3),
        maxWidth: "700px",
        width: "100%",
    },
    textField: {},
    actions: {
        display: "flex",
        flexDirection: "row-reverse",
    },
    button: {
        margin: theme.spacing(1, 0, 1, 1),
    },
});

class AddEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event: {
                name: "",
                teamSize: "",
                summary: "",
                description: "",
            },
        }
    }

    render() {
        const {classes} = this.props;
        let {event} = this.state;
        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <Typography variant="h3" gutterBottom>
                        Add event
                    </Typography>
                    <TextField
                        type="text"
                        placeholder="Event name"
                        className={classes.textField}
                        value={event.name}
                        margin="normal"
                        onChange={this.handleEventChange("name")}/>
                    <br/>
                    <TextField
                        type="number"
                        placeholder="Max team size"
                        className={classes.textField}
                        value={event.teamSize}
                        margin="normal"
                        onChange={this.handleEventChange("teamSize")}/>
                    <br/>
                    <TextField
                        label="Summary"
                        placeholder="Short description of event"
                        multiline
                        fullWidth
                        rows={2}
                        rowsMax="4"
                        className={classes.textField}
                        value={event.summary}
                        onChange={this.handleEventChange("summary")}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        placeholder="Detailed description of event"
                        multiline
                        fullWidth
                        rows={4}
                        rowsMax="6"
                        className={classes.textField}
                        value={event.description}
                        onChange={this.handleEventChange("description")}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                    />
                    <div className={classes.actions}>
                        <Button
                            onClick={this.onAdd.bind(this)}
                            variant="contained" color="primary" className={classes.button}>
                            Add
                        </Button>
                        <Button
                            onClick={this.onCancel.bind(this)}
                            variant="contained" color="secondary" className={classes.button}>
                            Cancel
                        </Button>
                    </div>
                </Paper>
            </div>
        );
    }


    handleEventChange = name => event => {
        // Note: 'event' maybe recycled. Save val and pass that around.
        let val = event.target.value;
        this.setState(prevEvent => ({
            event: {
                ...prevEvent.event,
                [name]: val
            }
        }));
    };

    componentDidMount() {
        this.server = this.context.server;
        this.snack = this.context.snack;
    }

    onCancel() {
        this.props.history.goBack();
    }

    onAdd() {
        fetch(`${this.server}/core/event`, {
            mode: 'cors',
            credentials: 'include',
            method: "POST",
            body: JSON.stringify(this.state.event),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (!res.ok)
                throw Error(res.statusText);
            this.setState({
                event: {
                    name: "",
                    teamSize: "",
                    summary: "",
                    description: "",
                }
            });
            this.snack("success", "Added!");
        }).catch(err => {
            this.snack("error", err.message);
        });
    }
}

AddEvent.propTypes = {
    classes: PropTypes.object.isRequired,
};
AddEvent.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(AddEvent);