import {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});


class Restore extends Component {
    onClose() {
    }

    restore() {
        let restore_state = this.props.match.params.state;
        let history = this.props.history;
        // let pathName = localStorage.getItem('restore.pathname') || '/';
        // localStorage.removeItem('restore.pathname');
        switch (restore_state) {
            case "PLS":
                this.snack("success", "Login success");
                history.push("/");
                break;
            case "PLF":
                this.snack("warn", "Login failed");
                history.push("/");
                break;
            case "PPS":
                this.snack("success", "Continue with signup");
                history.push("/signup");
                break;
            case "CLS":
                this.snack("success", "Login success");
                history.push("/core");
                break;
            case "CLF":
                this.snack("warn", "Login failed");
                history.push("/");
                break;
            default:
                history.push("/");
        }
    }

    componentDidMount() {
        this.snack = this.context.snack;
        this.restore();
    }

    render() {
        return null;
    }
}

Restore.propTypes = {
    classes: PropTypes.object.isRequired,
};
Restore.contextType = AppContext;
export default withStyles(styles, {withTheme: true})(Restore);