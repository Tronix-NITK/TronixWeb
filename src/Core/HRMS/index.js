import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AddCoreUser from "./AddCoreUser";
import DelCoreUser from "./DelCoreUser";
import ModCoreUser from "./ModCoreUser";
import {Link, Route} from "react-router-dom";
import MaterialTable from 'material-table';
import AppContext from "../../AppContext";

const styles = theme => ({
    tableContainer: {
        padding: theme.spacing(2),
    },
});

const reverseUserGroup = {15: "SU", 10: "ADMIN", 5: "MODERATOR"};

class HRMS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
        };
    }

    render() {
        const {classes} = this.props;
        const path = this.props.match.path;
        return (
            <div>
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
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
                <div className={classes.tableContainer}>
                    <MaterialTable
                        columns={[
                            {title: 'Name', field: 'displayName',},
                            {title: 'Email', field: 'email', editable: 'onAdd'},
                            {
                                title: 'Group',
                                field: 'group',
                                lookup: reverseUserGroup,
                            },
                        ]}
                        actions={[
                            {
                                icon: 'refresh',
                                tooltip: 'Reload users',
                                isFreeAction: true,
                                onClick: () => this.fetchUsers()
                            }
                        ]}
                        editable={{
                            onRowAdd: newUser => this.addUser(newUser),
                            onRowUpdate: (newUser, oldUser) => this.modUser(newUser, oldUser),
                            onRowDelete: user => this.delUser(user),
                        }}
                        options={{
                            actionsColumnIndex: -1
                        }}
                        data={this.state.users}
                        title="Core users"
                    />
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.server = this.context.server;
        this.snack = this.context.snack;
        this.fetchUsers();
    }

    fetchUsers() {
        fetch(`${this.server}/core/hrms/coreUsers`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
            headers: {
                'Accept': 'application/json',
            }
        })
            .then((res) => {
                if (res.ok)
                    return res.json();
                else
                    throw Error(res.statusText);
            })
            .then(users => this.setState({users: users}))
            .catch((err) => {
                this.setState({users: []});
                this.snack("error", err.message);
            });
    }

    addUser(newUser) {
        let user = Object.assign({}, newUser);
        user.group = reverseUserGroup[user.group];
        return new Promise((resolve, reject) => {
            fetch(`${this.server}/core/hrms/coreUser`, {
                mode: 'cors',
                credentials: 'include',
                method: "POST",
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((res) => {
                if (!res.ok)
                    throw Error(res.statusText);
                const users = this.state.users;
                users.push(newUser);
                this.snack("success", "Added");
                this.setState({users}, () => resolve());
            }).catch((err) => {
                this.snack("warn", err.message);
                reject(err);
            });
        });
    }

    modUser(newUser, oldUser) {
        let user = Object.assign({}, newUser);
        user.group = reverseUserGroup[user.group];
        return new Promise((resolve, reject) => {
            fetch(`${this.server}/core/hrms/coreUser`, {
                mode: 'cors',
                credentials: 'include',
                method: "PUT",
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((res) => {
                if (!res.ok)
                    throw Error(res.statusText);
                const users = this.state.users;
                const index = users.indexOf(oldUser);
                users[index] = newUser;
                this.snack("success", "Edited");
                this.setState({users}, () => resolve());
            }).catch(err => {
                this.snack("warn", err.message);
                reject(err);
            });
        });
    }


    delUser(user) {
        return new Promise((resolve, reject) => {
            fetch(`${this.server}/core/hrms/coreUser`, {
                mode: 'cors',
                credentials: 'include',
                method: "DELETE",
                body: JSON.stringify({
                    email: user.email,
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((res) => {
                if (!res.ok)
                    throw Error(res.statusText);
                let users = this.state.users;
                const index = users.indexOf(user);
                users.splice(index, 1);
                this.snack("success", "Deleted");
                this.setState({users}, () => resolve());
            }).catch(err => {
                this.snack("warn", err.message);
                reject(err);
            });
        });
    }
}

HRMS.propTypes = {
    classes: PropTypes.object.isRequired,
};
HRMS.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(HRMS);