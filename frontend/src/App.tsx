import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import User from "./pages/User/User";
import Register from "./pages/Register/Register";
import { ThemeProvider } from "styled-components";
import Theme from "./theme.json";
import { UserContext } from "./Context/UserContext";
import { IUser } from "./types/IUser";

function App() {
	const [user, setUser] = useState<IUser>();
	return (
		<ThemeProvider theme={Theme}>
			<UserContext.Provider value={[user, setUser]}>
				<Router>
					<Route exact path="/" component={Homepage} />
					<Route exact path="/user" component={User} />
					<Route exact path="/register" component={Register} />
				</Router>
			</UserContext.Provider>
		</ThemeProvider>
	);
}

export default App;
