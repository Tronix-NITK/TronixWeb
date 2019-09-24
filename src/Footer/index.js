import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";
import {Link, withRouter} from "react-router-dom";
import BottomNavigation from "@material-ui/core/BottomNavigation/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import SvgIcon from "@material-ui/core/SvgIcon/SvgIcon";
import MailIcon from '@material-ui/icons/Mail';
import FAQIcon from '@material-ui/icons/LiveHelp';
import HomeIcon from '@material-ui/icons/Home';
import LoginIcon from "@material-ui/icons/AccountCircle";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import MUILink from "@material-ui/core/Link";
import Hidden from "@material-ui/core/Hidden";

const styles = theme => ({
    footer: {
        position: "fixed",
        bottom: 0,
        width: "100%",
        ...theme.styles.translucentPaper,
    },
});

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nav: null
        };
    }

    render() {
        const {classes, user} = this.props;
        const {nav} = this.state;
        return (
            <div>
                <Hidden xsDown>
                    <BottomNavigation
                        className={classes.footer}
                        showLabels
                        value={nav}
                    >
                        {
                            this.getActions(user, false)
                        }
                    </BottomNavigation>
                </Hidden>
                <Hidden smUp>
                    <BottomNavigation
                        className={classes.footer}
                        showLabels
                        value={nav}
                    >
                        {
                            this.getActions(user, true)
                        }
                    </BottomNavigation>
                </Hidden>
            </div>
        );
    }

    getActions(user, xs) {
        return [
            <BottomNavigationAction
                key={0}
                label="Facebook"
                icon={
                    <SvgIcon>
                        <path
                            d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m13 2h-2.5A3.5 3.5 0 0 0 12 8.5V11h-2v3h2v7h3v-7h3v-3h-3V9a1 1 0 0 1 1-1h2V5z"/>
                    </SvgIcon>
                }
                color="textSecondary"
                component={MLink}
                href={"https://www.facebook.com/tronixcommittee/"}
                target="_blank"
            />,
            <BottomNavigationAction
                key={1}
                label="FAQ"
                color="textSecondary"
                icon={<FAQIcon/>}
                component={Link}
                to="/faq"
            />,
            <BottomNavigationAction
                key={2}
                label="Home"
                color="textSecondary"
                icon={<HomeIcon/>}
                component={Link}
                to="/"
            />,
            <BottomNavigationAction
                key={3}
                label={user ? "Logout" : "Login"}
                icon={user ? <LogoutIcon/> : <LoginIcon/>}
                component={Link}
                color="textSecondary"
                to={user ? "/logout" : "/login"}
            />,
            xs ? null : <BottomNavigationAction
                key={4}
                label="Mail"
                icon={<MailIcon/>}
                component={MLink}
                color="textSecondary"
                href={"mailto:tronix@nitk.edu.in"}
                target="_blank"
            />,
        ]
    }

    componentDidMount() {
        this.setNav(window.location);
        this.unlisten = this.props.history.listen((location, action) => {
            this.setNav(location);
        });
    }

    componentWillUnmount() {
        this.unlisten();
    }

    setNav(location) {
        const path = location.pathname.toLowerCase();
        let nav;
        if (path === "/login") nav = 3;
        else if (path === "/") nav = 2;
        else if (path === "/faq") nav = 1;
        else nav = null;
        this.setState({nav});
    }
}

class MLink extends Component {
    render() {
        return (
            <MUILink {...this.props} underline={"none"}>
                {this.props.children}
            </MUILink>
        );
    }
}

Footer.propTypes = {
    classes: PropTypes.object.isRequired,
};
Footer.contextType = AppContext;

export default withStyles(styles, {withTheme: true})(withRouter(Footer));