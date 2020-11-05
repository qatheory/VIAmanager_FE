import React from "react";
import AdminLayout from "layout/AdminLayout.js";
import SignIn from "pages/auth/SignIn";
import SignUp from "pages/auth/SignUp";
import { useSelector, useDispatch } from "react-redux";
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
	withRouter,
} from "react-router-dom";
import {
	selectLoggedIn,
	setUsername,
	setLoggedOut,
} from "store/reducers/viewSettings";
import axios from "axios";
import Constants from "_helpers/localConstants.js";
import Commons from "_helpers/commons.js";

function PrivateRoute({ component: Component, authed, ...rest }) {
	return (
		<Route
			{...rest}
			render={(props) =>
				authed === true ? (
					<Component {...props} />
				) : (
					<Redirect to={{ pathname: "/login" }} />
				)
			}
		/>
	);
}

function App(props) {
	const dispatch = useDispatch();
	const loggedIn = useSelector(selectLoggedIn);
	React.useEffect(() => {
		if (loggedIn) {
			let header = Commons.header();
			axios({
				url: `${Constants.API_DOMAIN}/api/current_user/`,
				method: "GET",
				headers: header,
			})
				.then((resp) => {
					dispatch(setUsername(resp.data.username));
					// if (sessionStorage.getItem("token")) {
					//   sessionStorage.setItem("token", resp.data.token);
					// } else {
					//   localStorage.setItem("token");
					// }

					// if (resp.data.user.workspaces.length == 0) {
					//   props.history.push("/admin/workspaces/create");
					// }
				})
				.catch((err) => {
					console.log(err);
					dispatch(setLoggedOut());
					localStorage.removeItem("token");
					sessionStorage.removeItem("token");
					props.history.push("/signin");
				});
		}
	});
	const handleRedirection = () => {
		if (loggedIn) {
			return <Redirect to="/admin/manage-via" />;
		}
		return <Redirect to="/signin" />;
	};
	return (
		<Switch>
			<PrivateRoute
				authed={loggedIn}
				path="/admin"
				component={AdminLayout}
			/>
			<Route component={SignIn} path="/signin"></Route>
			<Route component={SignUp} path="/signup"></Route>
			{handleRedirection()}
		</Switch>
	);
}

export default withRouter(App);
