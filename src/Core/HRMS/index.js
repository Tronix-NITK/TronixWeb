import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AddCoreUser from "./AddCoreUser";
import DelCoreUser from "./DelCoreUser";
import ModCoreUser from "./ModCoreUser";
import {Link, Route} from "react-router-dom";

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

const API_SERVER = "https://tronixserver.herokuapp.com";

class HRMS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: "getUser",
            user: null,
        };
    }

    render() {
        const {classes} = this.props;
        const path = this.props.match.path;
        return (
            <div>
                HRMS
                <nav>
                    <ul>
                        <li>
                            <Link to="/core/hrms/addCoreUser">Add core user</Link>
                        </li>
                        <li>
                            <Link to="/core/hrms/delCoreUser">Delete core user</Link>
                        </li>
                        <li>
                            <Link to="/core/hrms/modCoreUser">Edit core user</Link>
                        </li>
                    </ul>
                </nav>
                <Route path={`${path}/addCoreUser`}
                       component={AddCoreUser}/>
                <Route path={`${path}/delCoreUser`}
                       component={DelCoreUser}/>
                <Route path={`${path}/modCoreUser`}
                       component={ModCoreUser}/>
            </div>
        );
    }

    getUsersTable() {
        return (
            <div>

            </div>
        );
    }
}

HRMS.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(HRMS);