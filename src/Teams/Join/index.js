import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../../AppContext";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import {Link} from "react-router-dom";

const styles = theme => ({
    dialogButton: {
        margin: theme.spacing(1),
    },
});

class Join extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: "gettingTeam(0)",
            team: null,
        };
    }

    render() {
        switch (this.state.stage) {
            case "gettingTeam(0)":
                return this.stage0();
            case "confirm(1)":
                return this.stage1();
            case "joined(2)":
                return this.stage2();
            default:
                return this.stageErr();
        }
    }

    stage0() {
        return (
            <Dialog open={true}>
                <DialogTitle>Join team</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Fetching team details. Please wait.
                    </DialogContentText>
                </DialogContent>
                <DialogContent>
                    <LinearProgress/>
                </DialogContent>
                <DialogActions/>
            </Dialog>
        );
    }

    stage1() {
        const {classes} = this.props;
        const team = this.state.team;
        return (
            <Dialog open={true}>
                <DialogTitle>Join team</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Join team "{team.name}".
                    </DialogContentText>
                    <DialogContentText>
                        Participate in {team.event.name} with {team.members.map((m) => m.displayName).join(", ")}.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        className={classes.dialogButton}
                        component={Link} to={'/'}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.dialogButton}
                        onClick={this.onClickJoin.bind(this)}
                    >
                        Join
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    stage2() {
        const {classes} = this.props;
        const team = this.state.team;
        return (
            <Dialog open={true}>
                <DialogTitle>Join team</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Join team "{team.name}".
                    </DialogContentText>
                    <DialogContentText>
                        You are in!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.dialogButton}
                        component={Link} to={'/'}
                    >
                        Go Home
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    stageErr() {
        const {classes} = this.props;
        return (
            <Dialog open={true}>
                <DialogTitle>Join team</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        There was an error.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.dialogButton}
                        component={Link} to={'/'}
                    >
                        Go Home
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    componentDidMount() {
        this.server = this.context.server;
        this.snack = this.context.snack;
        let linkID = this.props.match.params["linkID"];
        this.getTeam(linkID);
    }

    onClickJoin() {
        let linkID = this.props.match.params["linkID"];
        this.joinTeam(linkID);
    }

    onClose() {

    }

    getTeam(linkID) {
        fetch(`${this.server}/part/team/get`, {
            mode: 'cors',
            credentials: 'include',
            method: "POST",
            body: JSON.stringify({linkID}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (!res.ok)
                throw Error(res.statusText);
            else
                return res.json();
        }).then((team) => {
            let user = this.context.partUser;
            let emails = team.members.map((m) => m.email);
            if (user != null && emails.indexOf(user.email) !== -1)
                this.setState({team, stage: "joined(2)"});
            else
                this.setState({team, stage: "confirm(1)"});
        }).catch(err => {
            this.snack("error", err.message);
            this.setState({stage: "failed(-1)"});
        });
    }

    joinTeam(linkID) {
        fetch(`${this.server}/part/team/join`, {
            mode: 'cors',
            credentials: 'include',
            method: "POST",
            body: JSON.stringify({linkID}),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (!res.ok)
                throw Error(res.statusText);
            this.setState({stage: "joined(2)"});
        }).catch(err => {
            this.snack("error", err.message);
            this.setState({stage: "failed(-1)"});
        });
    }
}

Join.propTypes = {
    classes: PropTypes.object.isRequired,
};
Join.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(Join);
