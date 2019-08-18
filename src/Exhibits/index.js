import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {Link} from "react-router-dom";

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
});

class ExhibitsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: true,
            exhibits: null,
        }
    }

    render() {
        const {classes} = this.props;
        let {showLoading, exhibits} = this.state;
        if (!showLoading) {
            if (exhibits) {
                return (
                    <div className={classes.root}>
                        <List>
                            {
                                exhibits.map(event => (
                                    <ListItem button component={Link} key={`li_${event.code}`} to={`/e/${event.code}`}>
                                        <ListItemText primary={event.name}/>
                                    </ListItem>
                                ))
                            }
                        </List>
                    </div>
                );
            } else {
                return (
                    <div className={classes.root}>
                        <Paper>
                            <Typography variant={"h1"}>
                                Could not find exhibits
                            </Typography>
                        </Paper>
                    </div>
                );
            }
        } else {
            return (
                <div className={classes.root}>
                    <CircularProgress/>
                </div>
            );
        }
    }

    componentDidMount() {
        this.server = this.context.server;
        this.snack = this.context.snack;
        this.getExhibits();
    }

    getExhibits() {
        this.setState({showLoading: true});
        fetch(`${this.server}/pub/event/namesAndCodes`, {
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
        }).then((exhibits) => {
            this.setState({exhibits});
            this.setState({showLoading: false});
        }).catch(err => {
            this.snack("error", err.message);
            this.setState({showLoading: false});
        });
    }
}

ExhibitsComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};
ExhibitsComponent.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(ExhibitsComponent);