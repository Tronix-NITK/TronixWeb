import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AddEvent from "./AddEvent";
import ModEvent from "./ModEvent";
import {Link, Route} from "react-router-dom";
import AppContext from "../../AppContext";

const styles = theme => ({});

class EMS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
        };
    }

    render() {
        const path = this.props.match.path;
        return (
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/core/EMS/addEvent">Add event</Link>
                        </li>
                        <li>
                            <Link to="/core/EMS/modEvent">Edit event</Link>
                        </li>
                    </ul>
                </nav>
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

EMS.propTypes = {
    classes: PropTypes.object.isRequired,
};
EMS.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(EMS);