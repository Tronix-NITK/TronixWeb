import React, { Component } from "react";
import * as PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Logout from "./Logout";
import Signup from "./Signup";
import Teams from "./Teams";
import TeamRegister from "./Teams/Register";
import TeamJoin from "./Teams/Join";
import Restore from "./Restore";
import Privacy from "./Privacy";
import FAQ from "./FAQ";
import Event from "./Event";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import InfoSnackIcon from '@material-ui/icons/Info';
import SuccessSnackIcon from '@material-ui/icons/CheckCircle';
import WarningSnackIcon from '@material-ui/icons/Warning';
import ErrorSnackIcon from '@material-ui/icons/Error';
import grey from "@material-ui/core/es/colors/grey";
import green from "@material-ui/core/es/colors/green";
import amber from "@material-ui/core/es/colors/amber";
import red from "@material-ui/core/es/colors/red";
import AppContext from "./AppContext";
import EventsComponent from "./Events";
import ExhibitsComponent from "./Exhibits";
import Exhibit from "./Exhibit";
import Home from "./Home";
import Particles from "react-particles-js";
import Hidden from "@material-ui/core/Hidden";
import SimpleError from "./SimpleError";
import Footer from "./Footer";
import Container from "@material-ui/core/Container";
import { isURP, isParticipant } from "./helpers/auth";
import BackgroundImage from "./background.png";

const paperColor = "rgba(10,10,10,0.8)";
const particleColor = "#b70101", lineColor = "#b70101";
const MuiTheme = {
	"dark": createMuiTheme({
		palette: {
			type: "dark",
			background: {
				default: "#121212",
				paper: "rgba(10,10,10)",
			},
			primary: {
				main: "#b70101"
			},
			secondary: {
				main: grey[500]
			},
		},
		typography: {
			useNextVariants: true,
		},
		styles: {
			spaceageFont: {
				fontFamily: "spaceage",
				transform: "scale(1, 1.4)",
			},
			successColor: {
				color: green[500],
			},
			hover: {
				'&:hover': {
					color: "#b70101",
				},
			},
			translucentPaperContainer: {
				padding: 8 * 3,
				backgroundColor: paperColor,
			},
			translucentPaper: {
				backgroundColor: paperColor,
			},
			horizontalCenter: {
				display: "flex",
				justifyContent: "center",
			},
		},
		overrides: {
			MuiContainer: {
				root: {
					paddingTop: "16px",
					paddingBottom: "16px",
				}
			}
		}
	}),
};

const styles = theme => ({
	app: {
		paddingBottom: "56px",
	},
	backgroundWrapper: {
		position: "fixed",
		zIndex: "-1",
		width: "100vw",
		height: "100vh",
		backgroundImage: `url(${BackgroundImage})`,
		backgroundSize: "cover",
	},
	background: {
		width: "100%",
		height: "100%",
	},
	snackMessage: {
		display: 'flex',
		alignItems: 'center',
	},
	snackIcon: {
		fontSize: 20,
		opacity: 0.9,
		marginRight: theme.spacing(1),
	},
	infoSnack: {
		backgroundColor: grey[600],
	},
	successSnack: {
		backgroundColor: green[600],
	},
	warnSnack: {
		backgroundColor: amber[700],
	},
	errorSnack: {
		backgroundColor: red[700],
	},
});

const API_SERVER = {
	url: process.env.REACT_APP_API_URL,
	mode: process.env.REACT_APP_FETCH_MODE,
};

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			infoSnack: "", successSnack: "", warnSnack: "", errorSnack: "",
			user: null,
		};
	}

	render() {
		const { classes } = this.props;
		const { user } = this.state;
		const participant = isParticipant(user);
		const urp = isURP(user);
		return (
			<MuiThemeProvider theme={MuiTheme["dark"]}>
				<React.Fragment>
					<CssBaseline />
					<AppContext.Provider value={
						{
							snack: (t, m) => this.snack(t, m),
							server: API_SERVER,
							user: user,
						}
					}>
						<Hidden xsDown>
							<Particles
								className={classes.backgroundWrapper}
								canvasClassName={classes.background}
								params={particleConfDesktop} />
						</Hidden>
						<Hidden smUp>
							<Particles
								className={classes.backgroundWrapper}
								canvasClassName={classes.background}
								params={particleConfMobile} />
						</Hidden>
						<Snackbar
							anchorOrigin={{ vertical: "top", horizontal: "right" }}
							open={this.state.infoSnack.length !== 0}
							onClose={this.handleCloseSnack.bind(this)}
							autoHideDuration={3000}
						>
							<SnackbarContent
								className={classes.infoSnack}
								message={
									<span className={classes.snackMessage}>
										<InfoSnackIcon className={classes.snackIcon} />{this.state.infoSnack}
									</span>
								}
							/>
						</Snackbar>
						<Snackbar
							anchorOrigin={{ vertical: "top", horizontal: "right" }}
							open={this.state.successSnack.length !== 0}
							onClose={this.handleCloseSnack.bind(this)}
							autoHideDuration={3000}
						>
							<SnackbarContent
								className={classes.successSnack}
								message={
									<span className={classes.snackMessage}>
										<SuccessSnackIcon className={classes.snackIcon} />{this.state.successSnack}
									</span>
								}
							/>
						</Snackbar>
						<Snackbar
							anchorOrigin={{ vertical: "top", horizontal: "right" }}
							open={this.state.warnSnack.length !== 0}
							onClose={this.handleCloseSnack.bind(this)}
							autoHideDuration={3000}
						>
							<SnackbarContent
								className={classes.warnSnack}
								message={
									<span className={classes.snackMessage}>
										<WarningSnackIcon className={classes.snackIcon} />{this.state.warnSnack}
									</span>
								}
							/>
						</Snackbar>
						<Snackbar
							anchorOrigin={{ vertical: "top", horizontal: "right" }}
							open={this.state.errorSnack.length !== 0}
							onClose={this.handleCloseSnack.bind(this)}
							autoHideDuration={3000}
						>
							<SnackbarContent
								className={classes.errorSnack}
								message={
									<span className={classes.snackMessage}>
										<ErrorSnackIcon className={classes.snackIcon} />{this.state.errorSnack}
									</span>
								}
							/>
						</Snackbar>
						<Router>
							<div className={classes.app}>
								<Switch>
									<Route path="/privacy" component={Privacy} />
									<Route path="/logout"
										render={(props) => <Logout {...props}
											onLogout={this.onLogout.bind(this)} />} />
									<Route path="/faq"
										component={FAQ} />
									{
										urp ? <Route path="/" component={Signup} /> : null
									}
									<Route exact path="/"
										component={Home} />
									<Route path="/restore/:state"
										component={Restore} />
									<Route path="/login"
										component={Login} />
									<Route path="/signup"
										component={Signup} />
									<Route path={["/e/:code", "/event/:code", "/events/:code"]}
										component={Event} />
									<Route path={["/e", "/event", "/events"]}
										component={EventsComponent} />
									<Route path={["/x/:code", "/exhibit/:code", "/exhibits/:code"]}
										component={Exhibit} />
									<Route path={["/x", "/exhibit", "/exhibits"]}
										component={ExhibitsComponent} />

									<Route path="/register/:code"
										component={participant ? TeamRegister : Login} />
									<Route path="/register"
										component={participant ? TeamRegister : Login} />
									<Route path="/j/:linkID"
										component={participant ? TeamJoin : Login} />
									<Route path="/teams"
										component={participant ? Teams : Login} />

									<Route path="/"
										component={this.notFound.bind(this)} />
								</Switch>
							</div>
							<Footer user={user} />
						</Router>
					</AppContext.Provider>
				</React.Fragment>
			</MuiThemeProvider>
		);
	}

	componentDidMount() {
		this.server = API_SERVER;
		this.loadPartUser();
	}

	notFound() {
		return (
			<Container maxWidth="md">
				<SimpleError message="Page not found!" />
			</Container>
		);
	}

	handleCloseSnack() {
		this.setState({ infoSnack: "", successSnack: "", warnSnack: "", errorSnack: "", });
	}

	onLogout() {
		this.setState({ user: null });
		this.snack("success", "Logged out");
	}

	snack(type, msg) {
		this.setState({ [`${type}Snack`]: msg });
	}

	loadPartUser() {
		fetch(`${this.server.url}/part/auth/user`,
			{
				mode: this.server.mode,
				credentials: 'include',
				method: "POST",
				headers: {
					'Accept': 'application/json',
				},
			}).then((res) => {
				if (res.ok)
					return res.json();
				else
					throw Error(res.statusText);
			}).then(user => {
				this.setState({ user });
			}).catch(() => {
				this.setState({ user: null });
			});
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired,
};

const particleConfDesktop = {
	"particles": {
		"number": {
			"value": 70,
		},
		"color": {
			"value": particleColor,
		},
		"size": {
			"value": 3
		},
		"line_linked": {
			"color": lineColor,
			"width": 2,
		}
	},
	"interactivity": {
		"detect_on": "window",
		"events": {
			"onhover": {
				"enable": true,
				"mode": "repulse"
			}
		}
	}
};
const particleConfMobile = {
	"particles": {
		"number": {
			"value": 20,
		},
		"color": {
			"value": particleColor,
		},
		"size": {
			"value": 3
		},
		"line_linked": {
			"color": lineColor,
			"width": 2,
		}
	},
	"interactivity": {
		"detect_on": "window",
		"events": {
			"onhover": {
				"enable": true,
				"mode": "repulse"
			}
		}
	}
};

export default withStyles(styles, { withTheme: true })(App);