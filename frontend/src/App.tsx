import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import { ThemeProvider } from "styled-components";
import Theme from "./theme.json";

function App() {
	return (
		<ThemeProvider theme={Theme}>
			<Router>
				<Route exact path="/" component={Homepage} />
			</Router>
		</ThemeProvider>
	);
}

export default App;
