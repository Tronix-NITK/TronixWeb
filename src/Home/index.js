import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";
import ListItem from "@material-ui/core/ListItem";
import {Link} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
    title: {
        padding: theme.spacing(5, 0),
        display: "flex",
        justifyContent: "center",
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});

class HomeComponent extends Component {
    render() {
        const {classes} = this.props;
        return (
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    <div className={classes.title}>
                        <Typography variant={"h1"}>
                            TroniX
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div>Events</div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div>Exe</div>
                </Grid>
                <Grid item xs={12}>
                    <div>
                        signup -> register for event -> invite to team
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div>
                        contact us
                    </div>
                </Grid>
            </Grid>
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


/*
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
*/