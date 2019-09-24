import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import MUILink from "@material-ui/core/Link";
import AppContext from "../AppContext";
import MaterialTable from "material-table";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

const styles = theme => ({
    root: {},
    teamDetails: {
        padding: theme.spacing(2),
    },
    noWrapTypo: {
        maxWidth: "50vw",
    },
});

class Teams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: null,
        };
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
                <Container maxWidth="md">
                    <MaterialTable
                        isLoading={this.state.teams == null}
                        columns={[
                            {title: 'Event', field: 'event.name',},
                            {
                                title: 'Team', field: 'name',
                                render: rowData => <Typography className={classes.noWrapTypo}
                                                               noWrap>{rowData.name}</Typography>
                            },
                        ]}
                        actions={[
                            {
                                icon: 'refresh',
                                tooltip: 'Reload',
                                isFreeAction: true,
                                onClick: () => this.loadTeams()
                            },
                            {
                                tooltip: 'Invite',
                                icon: 'person_add',
                                onClick: (e, team) => this.copyToClipBoard(this.makeJoinLink(team.linkID))
                            }
                        ]}
                        onRowClick={(event, rowData, togglePanel) => togglePanel()}
                        detailPanel={team => this.getDetailView(team)}
                        options={{
                            search: false,
                            paging: false,
                            header: false,
                        }}
                        data={this.state.teams || []}
                        title="My Teams"
                    />
                </Container>
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
        const link = this.makeJoinLink(team.linkID);
        return (
            <div className={classes.teamDetails}>
                <Typography variant={"h4"}>{team.name}</Typography>
                <Typography variant="body1" paragraph>{team.memberNames}</Typography>
                <Typography variant="h6">Team contact</Typography>
                <Typography variant="body1" paragraph>{team.contact}</Typography>
                <Typography variant="h6">Invite link</Typography>
                <MUILink href={link}>{link}</MUILink>
            </div>
        );
    }

    makeJoinLink(id) {
        return `${window.location.protocol}//${window.location.host}/j/${id}`;
    }

    copyToClipBoard(content) {
        navigator.clipboard.writeText(content);
        this.snack("success", "Copied invite link!")
    }
}

Teams.propTypes = {
    classes: PropTypes.object.isRequired,
};
Teams.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(Teams);