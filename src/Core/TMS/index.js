import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import MaterialTable from 'material-table';
import AppContext from "../../AppContext";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import WarningIcon from "@material-ui/core/SvgIcon/SvgIcon";

const styles = theme => ({
    root: {
        display: "flex",
        justifyContent: "center",
    },
    paper: {
        margin: theme.spacing(2, 2),
        padding: theme.spacing(4, 3),
        maxWidth: "1000px",
        width: "100%",
    },
    spaceBetween: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: theme.spacing(2),
    },
    tableContainer: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
    },
    teamDetails: {
        padding: theme.spacing(2),
    }
});


class TMS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            codes: null,
            code: "",
            showErrorIcon: false,
            showLoading: true,
            teams: [],
        };
    }

    render() {
        const {classes} = this.props;
        const {teams, codes, code, showLoading, showErrorIcon} = this.state;
        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <div className={classes.spaceBetween}>
                        <Typography variant="h3">
                            TMS
                        </Typography>
                        {showLoading ? <CircularProgress/> : null}
                        {showErrorIcon ? <WarningIcon fontSize="large"/> : null}
                    </div>
                    <div>
                        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
                        <div className={classes.tableContainer}>
                            <MaterialTable
                                columns={[
                                    {title: 'Team', field: 'name',},
                                    {title: 'College', field: 'college.name',},
                                    {title: 'Members', field: 'memberNames',},
                                    {title: 'Contact', field: 'contact',},
                                ]}
                                actions={[
                                    {
                                        icon: 'refresh',
                                        tooltip: 'Reload',
                                        isFreeAction: true,
                                        onClick: () => this.loadTeams(code)
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
                                }}
                                data={teams}
                                title={
                                    codes == null ? "Wait for it" :
                                        <Select
                                            placeholder="Event code"
                                            value={code}
                                            displayEmpty
                                            onChange={this.handleCodeChange}
                                        >
                                            <MenuItem value="" disabled>
                                                <em>Select event to edit</em>
                                            </MenuItem>
                                            {codes.map(code => (
                                                <MenuItem key={'codeKey' + code} value={code}>{code}</MenuItem>))}
                                        </Select>
                                }
                            />
                        </div>
                    </div>
                </Paper>
            </div>
        );
    }

    componentDidMount() {
        this.server = this.context.server;
        this.snack = this.context.snack;
        this.loadEventCodes();
    }

    handleCodeChange = event => {
        let code = event.target.value;
        if (code) {
            this.setState({code});
            this.setState({showLoading: true, showErrorIcon: false});
            this.loadTeams(code);
        } else {
            this.setState({teams: null, code});
            this.setState({showLoading: false, showErrorIcon: false});
        }
    };

    loadTeams(code) {
        fetch(`${this.server}/core/tms/byEventCode/${code}`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
            headers: {
                'Accept': 'application/json',
            }
        }).then((res) => {
            if (res.ok)
                return res.json();
            else
                throw Error(res.statusText);
        }).then(teams => {
            for (let i = 0; i < teams.length; ++i) {
                teams[i].memberNames = teams[i].members.map((m) => m.displayName).join(", ");
                teams[i].memberEmails = teams[i].members.map((m) => m.email).join(", ");
            }
            this.setState({teams, showLoading: false, showErrorIcon: false});
            console.log(teams);
        }).catch(err => {
            this.snack("error", err.message);
            this.setState({showLoading: false, showErrorIcon: true});
        });
    }

    loadEventCodes() {
        fetch(`${this.server}/event/codes`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
            headers: {
                'Accept': 'application/json',
            }
        }).then((res) => {
            if (res.ok)
                return res.json();
            else
                throw Error(res.statusText);
        }).then(codes => {
            this.setState({codes, showLoading: false, showErrorIcon: false});
        }).catch(err => {
            this.snack("error", err.message);
            this.setState({showLoading: false, showErrorIcon: true});
        });
    }

    getDetailView(team) {
        const {classes} = this.props;
        return (
            <div className={classes.teamDetails}>
                <Typography variant="h6">Team members</Typography>
                <Typography variant="body1" gutterBottom>{team.memberNames}</Typography>
                <Typography variant="h6">Emails</Typography>
                <Typography variant="body1" gutterBottom>{team.memberEmails}</Typography>
                <Typography variant="h6">Invite link</Typography>
                <Typography variant="body1" gutterBottom>https://tronixweb.herokuapp.com/j/{team.linkID}</Typography>
            </div>
        );
    }

    copyLinkID(team) {
        // Todo: Implement copy
        this.snack("success", "Copied invite link");
    }
}

TMS.propTypes = {
    classes: PropTypes.object.isRequired,
};
TMS.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(TMS);