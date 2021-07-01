import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Body from "../../Components/Body/Body";
import { UserContext } from "../../Context/UserContext";
import {
	InputContainer,
	InputLabel,
	Input,
	AuthButton,
	AuthText,
	AuthAltText,
	Container,
} from "../User/styles/User";

const Register = () => {
	const [fullname, setFullname] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [user, setUser] = useContext(UserContext);

	const register = async () => {
		const body = {
			name: fullname,
			username: username,
			email: email,
			password: password,
		};

		await fetch("http://localhost:4000/register", {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-type": "application/json",
			},
		})
			.then(values => values.json())
			.then(data => {
				console.log(data);
				window.location.href = "http://localhost:3000/user";
			})
			.catch(e => console.log(e));
	};

	return (
		<Body>
			<Container>
				<InputContainer>
					<InputContainer>
						<InputLabel>Full Name</InputLabel>
						<Input value={fullname} onChange={e => setFullname(e.target.value)} />
					</InputContainer>
					<InputContainer>
						<InputLabel>E-mail</InputLabel>
						<Input value={email} onChange={e => setEmail(e.target.value)} />
					</InputContainer>
					<InputContainer>
						<InputLabel>Username</InputLabel>
						<Input value={username} onChange={e => setUsername(e.target.value)} />
					</InputContainer>
					<InputContainer>
						<InputLabel>Password</InputLabel>
						<Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
					</InputContainer>
					<AuthButton onClick={register}>Register</AuthButton>
					<AuthText>
						Already have an account?{" "}
						<Link to="/user">
							<AuthAltText>Login</AuthAltText>
						</Link>{" "}
						here
					</AuthText>
				</InputContainer>
			</Container>
		</Body>
	);
};

export default Register;
