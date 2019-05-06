import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import {Link, Route} from "react-router-dom";
import CoreLogin from "./CoreLogin";

const styles = theme => ({});

const API_SERVER = "https://tronixserver.herokuapp.com";

function logout() {
    fetch(`${API_SERVER}/core/auth/logout`, {
        mode: 'cors',
        credentials: 'include',
        method: "GET",
    }).then((res) => {
        if (!res.ok)
            throw Error(res.statusText);
    }).catch(err => {
        console.error(err);
    });
}

class Core extends Component {
    render() {
        const path = this.props.match.path;
        return (
            <div>
                Core
                <nav>
                    <ul>
                        <li>
                            <Link to="/core/login">Login</Link>
                        </li>
                        <li>
                            <a href="" onClick={logout}>Logout</a>
                        </li>
                    </ul>
                </nav>

                <Route path={`${path}/login`}
                       component={CoreLogin}/>
            </div>
        );
    }
}

Core.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(Core);