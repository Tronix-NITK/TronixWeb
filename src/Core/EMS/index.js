import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AddEvent from "./AddEvent";
import ModEvent from "./ModEvent";
import {Link, Route} from "react-router-dom";
import AppContext from "../../AppContext";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
    nav_container: {
        width: '100%',
        maxWidth: 360,
    },
});

class EMS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
        };
    }

    render() {
        const path = this.props.match.path;
        const {classes} = this.props;
        return (
            <div>
                <div className={classes.nav_container}>
                    <Divider/>
                    <List component="nav">
                        <ListItemLink to="/core/ems/addEvent">
                            <ListItemText primary="Add event"/>
                        </ListItemLink>
                        <ListItemLink to="/core/ems/modEvent">
                            <ListItemText primary="Edit event"/>
                        </ListItemLink>
                    </List>
                </div>
                <Route path={`${path}/addEvent`}
                       component={AddEvent}/>
                <Route path={`${path}/modEvent`}
                       component={ModEvent}/>
                <Route path={`${path}/modEvent/:eventCode`}
                       component={ModEvent}/>
            </div>
        );
    }

    componentDidMount() {
        this.server = this.context.server;
        this.snack = this.context.snack;
    }
}

function ListItemLink(props) {
    return <ListItem button component={Link} {...props} />;
}

EMS.propTypes = {
    classes: PropTypes.object.isRequired,
};
EMS.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(EMS);