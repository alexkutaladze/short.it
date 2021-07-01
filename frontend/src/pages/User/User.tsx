import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Body from "../../Components/Body/Body";
import { UserContext } from "../../Context/UserContext";
import { FaIdBadge } from "react-icons/fa";
import {
	InputLabel,
	Input,
	Container,
	InputContainer,
	AuthButton,
	AuthAltText,
	AuthText,
	UserInfoContainer,
	UserTextContainer,
	UserAnalyticsContainer,
	UserAnalytics,
} from "./styles/User";
import Theme from "../../theme.json";
import { IUser } from "../../types/IUser";
import { IGeneratedURL } from "../../types/IGeneratedURL";

const User = () => {
	const [user, setUser] = useContext(UserContext);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [linkStatistics, setLinkStatistics] = useState<IGeneratedURL[]>();

	useEffect(() => {
		const jwt = window.localStorage.getItem("jid");

		if (jwt) {
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
				.catch(e => console.log(e));
		} else {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (!user && !user?.createdURLs) return;
		(async () => {
			const body = {
				urls: user.createdURLs,
			};
			await fetch("http://localhost:4000/getLinkAnalytics", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify(body),
			})
				.then(values => values.json())
				.then(data => setLinkStatistics(data))
				.catch(e => console.log(e));
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

	if (loading) return <Body>loading...</Body>;

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
							<p>Created URLs</p>
							{linkStatistics ? (
								linkStatistics.map(item => (
									<a
										key={item._id}
										href={`http://localhost:4000/visit?short=${item.shortened}&by=${user.userName}`}
										target="_blank"
										style={{ display: "block" }}
									>
										{item.shortened}
									</a>
								))
							) : (
								<p>No URLs created (so far &#128521;)</p>
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
