import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";
import MaterialTable from "material-table";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
    root: {},
    tableContainer: {
        margin: theme.spacing(2),
    },
    teamDetails: {
        padding: theme.spacing(2),
    }
});

class Teams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: [],
        };
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
                <div className={classes.tableContainer}>
                    <MaterialTable
                        columns={[
                            {title: 'Team', field: 'name',},
                            {title: 'Event', field: 'event.name',},
                        ]}
                        actions={[
                            {
                                icon: 'refresh',
                                tooltip: 'Reload',
                                isFreeAction: true,
                                onClick: () => this.loadTeams()
                            },
                            {
                                icon: 'add',
                                tooltip: 'Invite',
                                onClick: (team) => this.copyLinkID(team)
                            }
                        ]}
                        detailPanel={team => this.getDetailView(team)}
                        options={{
                            actionsColumnIndex: -1,
                            search: false,
                            paging: false,
                        }}
                        data={this.state.teams}
                        title="My Teams"
                    />
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.snack = this.context.snack;
        this.server = this.context.server;
        this.loadTeams();
    }

    loadTeams() {
        fetch(`${this.server}/part/team`, {
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
        }).then((teams) => {
            for (let i = 0; i < teams.length; ++i)
                teams[i].memberNames = teams[i].members.map((m) => m.displayName).join(", ");
            this.setState({teams});
        }).catch(err => {
            this.snack("error", err.message);
        });
    }

    getDetailView(team) {
        const {classes} = this.props;
        return (
            <div className={classes.teamDetails}>
                <Typography variant="h6">Team members</Typography>
                <Typography variant="body1" gutterBottom>{team.memberNames}</Typography>
                <Typography variant="h6">Team contact</Typography>
                <Typography variant="body1" gutterBottom>{team.contact}</Typography>
                <Typography variant="h6">Invite link</Typography>
                <Typography variant="body1"
                            gutterBottom>{`https://${window.location.host}/j/${team.linkID}`}</Typography>
            </div>
        );
    }

    copyLinkID(team) {
        // Todo: Implement copy
        this.snack("success", "Copied invite link");
    }
}

Teams.propTypes = {
    classes: PropTypes.object.isRequired,
};
Teams.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(Teams);