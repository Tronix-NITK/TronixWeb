import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import WarningIcon from '@material-ui/icons/Warning';

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
    spaceBetween: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    }
});

class ExhibitDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showErrorIcon: false,
            exhibit: null,
        }
    }

    render() {
        const {classes} = this.props;
        let exhibitName = this.props.match.params["name"];
        let {showErrorIcon, exhibit} = this.state;
        if (exhibit != null) {
            return (
                <div className={classes.root}>
                    <Paper className={classes.paper}>
                        <Typography variant="h3" gutterBottom>
                            {exhibit.name}
                        </Typography>
                        <Typography variant="body1">
                            {exhibit.summary}
                        </Typography>
                        <Typography variant="body1">
                            {exhibit.description}
                        </Typography>
                    </Paper>
                </div>
            );
        } else {
            return (
                <div className={classes.root}>
                    <Paper className={classes.paper}>
                        <div className={classes.spaceBetween}>
                            <Typography variant="h2">
                                {exhibitName}
                            </Typography>
                            {showErrorIcon ? <WarningIcon fontSize="large"/> : <CircularProgress/>}
                        </div>
                    </Paper>
                </div>
            );
        }
    }

    componentDidMount() {
        this.server = this.context.server;
        this.snack = this.context.snack;
        let exhibitCode = this.props.match.params["code"];
        this.getExhibit(exhibitCode);
    }

    getExhibit(code) {
        fetch(`${this.server}/exhibit/ofCode/${code}`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
            headers: {
                'Accept': 'application/json',
            }
        }).then((res) => {
            if (!res.ok)
                throw Error(res.statusText);
            else
                return res.json();
        }).then((exhibit) => {
            this.setState({exhibit});
        }).catch(err => {
            this.snack("error", err.message);
            this.setState({showErrorIcon: true});
        });
    }
}

ExhibitDisplay.propTypes = {
    classes: PropTypes.object.isRequired,
};
ExhibitDisplay.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(ExhibitDisplay);