import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../../../AppContext";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import WarningIcon from "@material-ui/core/SvgIcon/SvgIcon";
import CircularProgress from "@material-ui/core/CircularProgress";

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
    spaceBetween: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: theme.spacing(2),
    },
});

class ModEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            codes: null,
            code: "",
            event: null,
            showErrorIcon: false,
            showLoading: true,
        }
    }

    render() {
        const {classes} = this.props;
        let {event, codes, showErrorIcon, showLoading, code} = this.state;
        let eventForm = event == null ? null : this.getEditForm();
        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <div className={classes.spaceBetween}>
                        <Typography variant="h3">
                            Edit event
                        </Typography>
                        {showLoading ? <CircularProgress/> : null}
                        {showErrorIcon ? <WarningIcon fontSize="large"/> : null}
                    </div>
                    {codes == null ? null :
                        <Select
                            placeholder="Event code"
                            value={code}
                            displayEmpty
                            onChange={this.handleCodeChange}
                        >
                            <MenuItem value="" disabled>
                                <em>Select event to edit</em>
                            </MenuItem>
                            {codes.map(code => (<MenuItem key={'codeKey' + code} value={code}>{code}</MenuItem>))}
                        </Select>
                    }
                    <br/>
                    {eventForm}
                </Paper>
            </div>
        );
    }

    handleCodeChange = event => {
        let code = event.target.value;
        if (code) {
            this.setState({code});
            this.setState({showLoading: true, showErrorIcon: false});
            this.loadEvent(code);
        } else {
            this.setState({event: null, code});
            this.setState({showLoading: false, showErrorIcon: false});
        }
    };

    getEditForm() {
        const {classes} = this.props;
        let {event} = this.state;
        return (
            <div>
                <TextField
                    type="text"
                    placeholder="Event name"
                    className={classes.textField}
                    value={event.name}
                    disabled
                    margin="normal"
                    onChange={this.handleEventChange("name")}/>
                <br/>
                <TextField
                    type="number"
                    placeholder="Max team size"
                    className={classes.textField}
                    value={event.teamSize}
                    disabled
                    margin="normal"
                    onChange={this.handleEventChange("teamSize")}/>
                <br/>
                <TextField
                    label="Summary"
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
                        onClick={this.onEdit.bind(this)}
                        variant="contained" color="primary" className={classes.button}>
                        Edit
                    </Button>
                    <Button
                        onClick={this.onCancel.bind(this)}
                        variant="contained" color="secondary" className={classes.button}>
                        Cancel
                    </Button>
                </div>
            </div>
        )
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
        let eventCode = this.props.match.params["eventCode"];
        if (eventCode)
            this.loadEvent(eventCode);
        else
            this.loadEventCodes();
    }

    onCancel() {
        this.props.history.goBack();
    }

    onEdit() {
        this.setState({showLoading: true, showErrorIcon: false});
        fetch(`${this.server}/core/ems`, {
            mode: 'cors',
            credentials: 'include',
            method: "PUT",
            body: JSON.stringify(this.state.event),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (!res.ok)
                throw Error(res.statusText);
            this.snack("success", "Edited!");
            this.setState({showLoading: false, showErrorIcon: false});
        }).catch(err => {
            this.snack("error", err.message);
            this.setState({showLoading: false, showErrorIcon: true});
        });
    }

    loadEvent(eventCode) {
        fetch(`${this.server}/event/byCode/${eventCode}`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
            headers: {
                'Accept': 'application/json',
            }
        }).then((res) => {
            if (res.ok)
                return res.json();
            else
                throw Error(res.statusText);
        }).then(event => {
            this.setState({event, showLoading: false, showErrorIcon: false});
        }).catch(err => {
            this.snack("error", err.message);
            this.setState({showLoading: false, showErrorIcon: true});
        });
    }

    loadEventCodes() {
        fetch(`${this.server}/event/codes`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
            headers: {
                'Accept': 'application/json',
            }
        }).then((res) => {
            if (res.ok)
                return res.json();
            else
                throw Error(res.statusText);
        }).then(codes => {
            this.setState({codes, showLoading: false, showErrorIcon: false});
        }).catch(err => {
            this.snack("error", err.message);
            this.setState({showLoading: false, showErrorIcon: true});
        });
    }
}

ModEvent.propTypes = {
    classes: PropTypes.object.isRequired,
};
ModEvent.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(ModEvent);