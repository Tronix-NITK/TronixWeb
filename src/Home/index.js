import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
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

class HomeComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.nav_container}>
                <List component="nav">
                    <ListItemLink to="/">
                        <ListItemText primary="Home"/>
                    </ListItemLink>
                    <ListItemLink to="/login">
                        <ListItemText primary="Login"/>
                    </ListItemLink>
                    <ListItemLink to="/logout">
                        <ListItemText primary="Logout"/>
                    </ListItemLink>
                    <ListItemLink to="/signup">
                        <ListItemText primary="Signup"/>
                    </ListItemLink>
                    <ListItemLink to="/e">
                        <ListItemText primary="Tronix Events"/>
                    </ListItemLink>
                    <ListItemLink to="/x">
                        <ListItemText primary="Tronix Exhibits"/>
                    </ListItemLink>
                    <ListItemLink to="/register">
                        <ListItemText primary="Register for an event"/>
                    </ListItemLink>
                    <ListItemLink to="/teams">
                        <ListItemText primary="Your teams"/>
                    </ListItemLink>
                </List>
            </div>
        );
    }

    componentDidMount() {
        this.server = this.context.server;
        this.snack = this.context.snack;
    }
}

HomeComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};
HomeComponent.contextType = AppContext;

function ListItemLink(props) {
    return <ListItem button component={Link} {...props} />;
}

export default withStyles(styles, {withTheme: true})(HomeComponent);