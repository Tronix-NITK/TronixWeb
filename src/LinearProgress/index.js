import React from "react";
import {withStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";

const styles = theme => ({
    paper: {
        ...theme.styles.translucentPaper,
        padding: theme.spacing(4),
    },
});

function LinearProgressComponent(props) {
    const {classes} = props;
    return (
        <Paper className={classes.paper}>
            <LinearProgress/>
        </Paper>
    );
}

export default withStyles(styles, {withTheme: true})(LinearProgressComponent);