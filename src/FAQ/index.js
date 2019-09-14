import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";
import LinearProgress from "../LinearProgress";
import SimpleError from "../SimpleError";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
    paper: {
        ...theme.styles.translucentPaperContainer,
        margin: theme.spacing(1, 0),
    }
});

class FAQ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            faqs: [],
            showLoading: true,
        };
    }

    render() {
        let {showLoading, faqs} = this.state;
        let view;
        if (!showLoading) {
            if (faqs) {
                view = faqs.map(f => this.getPanel(f));
            } else {
                view = (
                    <SimpleError message={"Could not load faqs"}/>
                );
            }
        } else {
            view = (
                <LinearProgress/>
            );
        }
        return (
            <Container maxWidth="md">
                {view}
            </Container>
        );
    }

    getPanel(f) {
        const {classes} = this.props;
        return (
            <Paper key={f.question} className={classes.paper}>
                <Typography variant="h6" gutterBottom>{f.question}</Typography>
                <Typography variant="body2">{f.answer}</Typography>
            </Paper>
        );
    }

    componentDidMount() {
        this.server = this.context.server;
        this.snack = this.context.snack;
        this.fetchFAQs();
    }

    fetchFAQs() {
        fetch(`${this.server}/pub/faq/all`, {
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
            .then(faqs => {
                faqs.sort((f1, f2) => f2.rank - f1.rank);
                this.setState({faqs, showLoading: false});
            })
            .catch((err) => {
                this.setState({faqs: [], showLoading: false});
                this.snack("error", err.message);
            });
    }
}

FAQ.propTypes = {
    classes: PropTypes.object.isRequired,
};
FAQ.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(FAQ);