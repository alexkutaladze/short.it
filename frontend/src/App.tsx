import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import User from "./pages/User/User";
import Register from "./pages/Register/Register";
import { ThemeProvider } from "styled-components";
import Theme from "./theme.json";
import { UserContext } from "./Context/UserContext";
import { IUser } from "./types/IUser";
import Stats from "./pages/Stats/Stats";

function App() {
	const [user, setUser] = useState<IUser>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (user) return;
		const jwt = window.localStorage.getItem("jid");
		if (!jwt) {
			return setLoading(false);
		}
		fetch("http://localhost:4000/auth", {
			credentials: "include",
			method: "GET",
			headers: {
				authorization: `bearer ${jwt}`,
			},
		})
			.then(values => values.json())
			.then(data => {
				if (data.ok) {
					let fetchedUser: IUser = {
						email: data.user.email,
						createdAt: new Date(data.user.createdAt),
						userName: data.user.userName,
						updatedAt: new Date(data.user.updatedAt),
						fullName: data.user.fullName,
						createdURLs: data.user.createdURLs,
						visitedURLs: data.user.visitedURLs,
					};
					setUser(fetchedUser);
					setLoading(false);
				}
			})
			.catch(e => {
				console.error(e);
				setLoading(false);
			});
	}, []);

	if (loading)
		return (
			<div
				style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
			>
				<h1>Loading...</h1>
			</div>
		);

	return (
		<ThemeProvider theme={Theme}>
			<UserContext.Provider value={[user, setUser]}>
				<Router>
					<Route exact path="/" component={Homepage} />
					<Route exact path="/user" component={User} />
					<Route exact path="/register" component={Register} />
					<Route exact path="/stats" component={Stats} />
				</Router>
			</UserContext.Provider>
		</ThemeProvider>
	);
}

export default App;
