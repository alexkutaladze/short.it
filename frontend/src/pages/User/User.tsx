import React, { useContext, useEffect, useState } from "react";
import { FaIdBadge } from "react-icons/fa";
import { Link } from "react-router-dom";
import Body from "../../Components/Body/Body";
import LinkComponent from "../../Components/LinkComponent/LinkComponent";
import { UserContext } from "../../Context/UserContext";
import Theme from "../../theme.json";
import { IGeneratedURL } from "../../types/IGeneratedURL";
import { IUser } from "../../types/IUser";
import {
	AuthAltText,
	AuthButton,
	AuthText,
	Container,
	Input,
	InputContainer,
	InputLabel,
	UserAnalytics,
	UserAnalyticsContainer,
	UserInfoContainer,
	UserTextContainer,
} from "./styles/User";

const User = () => {
	const [user, setUser] = useContext(UserContext);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [createdLinkStatistics, setCreatedLinkStatistics] = useState<IGeneratedURL[]>();
	const [visitedLinkStatistics, setVisitedLinkStatistics] = useState<IGeneratedURL[]>();
	const [linksLoading, setLinksLoading] = useState(true);

	useEffect(() => {
		if (!user && !user?.createdURLs && !user?.visitedURLs) {
			setLinksLoading(false);
			return;
		}
		(async () => {
			const createdBody = {
				urls: user.createdURLs,
			};
			await fetch("http://localhost:4000/getLinkAnalytics", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify(createdBody),
			})
				.then(values => values.json())
				.then(data => setCreatedLinkStatistics(data))
				.catch(e => console.log(e));

			const visitedBody = {
				urls: user.visitedURLs,
			};
			await fetch("http://localhost:4000/getLinkAnalytics", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify(visitedBody),
			})
				.then(values => values.json())
				.then(data => {
					setVisitedLinkStatistics(data);
				})
				.catch(e => console.log(e));

			setLinksLoading(false);
		})();
	}, [user]);

	const login = async () => {
		const body = {
			username,
			password,
		};
		await fetch("http://localhost:4000/login", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(body),
		})
			.then(val => val.json())
			.then(data => {
				console.log(data);
				if (data.ok) {
					window.localStorage.setItem("jid", data.accessToken);
					setUser(data.user);
				} else setError("Incorrect credentials");
			})
			.catch(e => console.error(e));
	};

	if (linksLoading) return <Body>loading...</Body>;

	return (
		<Body>
			{user ? (
				<>
					<UserInfoContainer>
						<FaIdBadge size={150} color={Theme.sidebar} />
						<UserTextContainer>
							<p>{user.userName}</p>
							<p>Member since {user.createdAt.toLocaleDateString()}</p>
						</UserTextContainer>
					</UserInfoContainer>
					<UserAnalyticsContainer>
						<UserAnalytics>
							<h3>Created URLs</h3>
							{linksLoading ? (
								<p>No URLs created (so far &#128521;)</p>
							) : createdLinkStatistics ? (
								createdLinkStatistics.map((item, index) => {
									if (item === null) return;
									return <LinkComponent key={item._id} user={user} short={item} />;
								})
							) : (
								<p>No URLs created (so far &#128521;)</p>
							)}
						</UserAnalytics>
						<UserAnalytics>
							<h3>Visited URLs</h3>
							{visitedLinkStatistics ? (
								visitedLinkStatistics.map((item, index) => {
									if (item === null) return;
									return <LinkComponent key={item._id} user={user} short={item} />;
								})
							) : linksLoading ? (
								<p>No URLs visited (so far &#128521;)</p>
							) : (
								<p>Loading...</p>
							)}
						</UserAnalytics>
					</UserAnalyticsContainer>
				</>
			) : (
				<Container>
					<InputContainer>
						<form onSubmit={e => e.preventDefault()}>
							<InputContainer>
								<InputLabel>Username</InputLabel>
								<Input value={username} onChange={e => setUsername(e.target.value)} />
							</InputContainer>
							<InputContainer>
								<InputLabel>Password</InputLabel>
								<Input
									type="password"
									value={password}
									onChange={e => setPassword(e.target.value)}
								/>
							</InputContainer>
							<AuthButton type="submit" onClick={login}>
								Login
							</AuthButton>
						</form>
						{error && <p>{error}</p>}
						<AuthText>
							Don't have an account?{" "}
							<Link to="/register">
								<AuthAltText>Register</AuthAltText>
							</Link>{" "}
							here
						</AuthText>
					</InputContainer>
				</Container>
			)}
		</Body>
	);
};

export default User;
